import Modal from './Modal';

type ConfirmModalProps = {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const ConfirmModal = ({
  isOpen,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onCancel}>
      <div className="text-center">
        <div className="text-4xl mb-2">🗑️</div>

        <h2 className="text-lg font-semibold mb-2">{title}</h2>

        <p className="text-sm text-gray-600 mb-5">
          {description}
        </p>

        <div className="flex gap-3 justify-center">
          <button
            className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
            onClick={onCancel}
          >
            {cancelText}
          </button>

          <button
            className="px-4 py-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
