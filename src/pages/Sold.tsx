import { useEffect, useState } from 'react';
import { supabase } from '@/supabaseClient';
import { FaSearch } from 'react-icons/fa';

import ItemCard from '@/components/ItemCard';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { StatusKey } from '@/constants/statusOptions';

type Item = any; // you can strongly type this later

const Sold = () => {
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<Record<string, Item[]>>({});
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null);

  useEffect(() => {
    const fetchAndHydrate = async () => {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('status', 'sold');

      if (error || !data) {
        console.error(error);
        return;
      }

      const itemsByCategory: Record<string, Item[]> = {};

      await Promise.all(
        data.map(async (item) => {
          let photoUrls: string[] = [];

          if (item.photos?.length) {
            const signedUrls = await Promise.all(
              item.photos.map(async (path: string) => {
                const { data } = await supabase.storage
                  .from('item-photos')
                  .createSignedUrl(path, 60 * 60);

                return data?.signedUrl ?? null;
              })
            );

            photoUrls = signedUrls.filter(Boolean) as string[];
          }

          const category = item.category || 'uncategorized';

          const enrichedItem = {
            ...item,
            photoUrls,
            profit:
              item.listing_price && item.purchase_price
                ? item.listing_price - item.purchase_price
                : 0,
          };

          if (!itemsByCategory[category]) {
            itemsByCategory[category] = [];
          }

          itemsByCategory[category].push(enrichedItem);
        })
      );

      setItems(itemsByCategory);
    };

    fetchAndHydrate();
  }, []);

  // Update item status (local only for analytics)
  const handleStatusChange = (itemId: number, newStatus: StatusKey) => {
    setItems((prev) => {
      const updated = { ...prev };

      for (const category in updated) {
        updated[category] = updated[category].map((item) =>
          item.id === itemId ? { ...item, status: newStatus } : item
        );
      }

      return updated;
    });
  };

  // Open delete modal
  const triggerDeleteModal = (item: Item) => {
    setItemToDelete(item);
  };

  // Confirm delete
  const handleDelete = async () => {
    if (!itemToDelete) return;

    await supabase.from('items').delete().eq('id', itemToDelete.id);

    setItems((prev) => {
      const updated = { ...prev };

      for (const category in updated) {
        updated[category] = updated[category].filter(
          (item) => item.id !== itemToDelete.id
        );

        if (updated[category].length === 0) {
          delete updated[category];
        }
      }

      return updated;
    });

    setItemToDelete(null);
  };

  const hasItems = Object.keys(items).length > 0;

  return (
    <div className="flex flex-col w-full h-full relative">
      {/* Top Navigation */}
      <div className="bg-white w-full border-b border-gray-200">
        <div className="w-full max-w-7xl mx-auto flex justify-between items-center py-3 px-6">
          <div className="flex gap-2">
            <button className="border rounded-lg px-4 py-2 text-sm hover:bg-gray-50">
              Filter
            </button>
          </div>

          <div className="relative w-1/3">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="w-full border border-gray-300 rounded-full pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Empty State */}
      {!hasItems && (
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 mx-6 mt-6 text-center">
          <h1 className="mb-2 text-3xl font-extrabold text-gray-800">
            No analytics available yet
          </h1>
          <p className="text-gray-500">
            Sold items will appear here once available.
          </p>
        </div>
      )}

      {/* Grouped Items */}
      {Object.entries(items).map(([category, categoryItems]) => (
        <div
          key={category}
          className="w-full max-w-[72rem] mx-auto px-6 py-8"
        >
          <h2 className="text-xl font-semibold mb-4 capitalize">
            {category}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {categoryItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                triggerDeleteModal={triggerDeleteModal}
                handleStatusChange={handleStatusChange}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!itemToDelete}
        title="Delete this item?"
        description={`Are you sure you want to remove ${
          itemToDelete?.name || `Item ${itemToDelete?.id}`
        }? This action can’t be undone.`}
        confirmText="Yes, delete 💔"
        cancelText="Never mind 💭"
        onConfirm={handleDelete}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  );
};

export default Sold;
