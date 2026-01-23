import { useEffect, useState } from 'react';
import { supabase } from '@/supabaseClient';

const Profile = () => {
	const [user, setUser] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [isEditing, setIsEditing] = useState(false);

	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
	});

	const [newPassword, setNewPassword] = useState('');
	const [success, setSuccess] = useState('');
	const [error, setError] = useState('');

	// Load authenticated user
	useEffect(() => {
		const loadUser = async () => {
			const { data, error } = await supabase.auth.getUser();

			if (error || !data.user) {
				setError('You must be logged in to view this page.');
				setLoading(false);
				return;
			}

			setUser(data.user);
			setFormData({
				firstName: data.user.user_metadata?.firstName ?? '',
				lastName: data.user.user_metadata?.lastName ?? '',
			});

			setLoading(false);
		};

		loadUser();
	}, []);

	const initial =
		formData.firstName?.[0]?.toUpperCase() ??
		user?.email?.[0]?.toUpperCase() ??
		'?';

	// Save profile metadata
	const handleSaveProfile = async () => {
		setLoading(true);
		setError('');
		setSuccess('');

		const { error } = await supabase.auth.updateUser({
			data: {
				firstName: formData.firstName,
				lastName: formData.lastName,
			},
		});

		if (error) {
			setError(error.message);
		} else {
			setSuccess('Profile updated successfully.');
			setIsEditing(false);
		}

		setLoading(false);
	};

	// Change password
	const handleChangePassword = async () => {
		if (newPassword.length < 6) {
			setError('Password must be at least 6 characters.');
			return;
		}

		setLoading(true);
		setError('');
		setSuccess('');

		const { error } = await supabase.auth.updateUser({
			password: newPassword,
		});

		if (error) {
			setError(error.message);
		} else {
			setSuccess('Password updated successfully.');
			setNewPassword('');
		}

		setLoading(false);
	};

	// Loading screen
	if (loading) {
		return (
			<div className="mx-auto max-w-[72rem] py-24 text-center text-gray-500">
				Loading profile…
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-[72rem] px-4 py-12">
			<div className="rounded-2xl bg-white border border-gray-200 shadow-md p-8">
				{/* Alerts */}
				{success && (
					<div className="mb-4 rounded-lg bg-green-100 text-green-700 px-4 py-3">
						{success}
					</div>
				)}
				{error && (
					<div className="mb-4 rounded-lg bg-red-100 text-red-700 px-4 py-3">
						{error}
					</div>
				)}

				{/* Avatar */}
				<div className="flex flex-col items-center">
					<div className="h-24 w-24 rounded-full bg-violet-500 text-white flex items-center justify-center text-4xl font-bold shadow-sm">
						{initial}
					</div>

					<h2 className="mt-4 text-2xl font-bold text-gray-800">
						{formData.firstName} {formData.lastName}
					</h2>

					<p className="text-sm text-gray-500">{user.email}</p>
				</div>

				{/* Profile Fields */}
				<div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<label className="block text-sm font-medium mb-1">
							First Name
						</label>
						<input
							disabled={!isEditing}
							value={formData.firstName}
							onChange={(e) =>
								setFormData({ ...formData, firstName: e.target.value })
							}
							className={`w-full rounded-lg border px-4 py-2 ${
								isEditing
									? 'border-gray-300 focus:ring-2 focus:ring-violet-400'
									: 'bg-gray-100 border-gray-200'
							}`}
						/>
					</div>

					<div>
						<label className="block text-sm font-medium mb-1">
							Last Name
						</label>
						<input
							disabled={!isEditing}
							value={formData.lastName}
							onChange={(e) =>
								setFormData({ ...formData, lastName: e.target.value })
							}
							className={`w-full rounded-lg border px-4 py-2 ${
								isEditing
									? 'border-gray-300 focus:ring-2 focus:ring-violet-400'
									: 'bg-gray-100 border-gray-200'
							}`}
						/>
					</div>

					<div>
						<label className="block text-sm font-medium mb-1">Email</label>
						<input
							disabled
							value={user.email}
							className="w-full rounded-lg border bg-gray-100 border-gray-200 px-4 py-2"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium mb-1">
							Password
						</label>
						<input
							disabled
							value="********"
							className="w-full rounded-lg border bg-gray-100 border-gray-200 px-4 py-2"
						/>
					</div>
				</div>

				{/* Actions */}
				<div className="mt-8 flex justify-end gap-4">
					{isEditing ? (
						<>
							<button
								onClick={() => {
									setIsEditing(false);
									setFormData({
										firstName: user.user_metadata?.firstName ?? '',
										lastName: user.user_metadata?.lastName ?? '',
									});
								}}
								className="px-6 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
							>
								Cancel
							</button>
							<button
								onClick={handleSaveProfile}
								className="px-6 py-2 rounded-lg bg-violet-500 text-white font-semibold hover:bg-violet-600"
							>
								Save Changes
							</button>
						</>
					) : (
						<button
							onClick={() => setIsEditing(true)}
							className="px-6 py-2 rounded-lg bg-violet-500 text-white font-semibold hover:bg-violet-600"
						>
							Edit Profile
						</button>
					)}
				</div>

				{/* Change Password */}
				<div className="mt-10 border-t pt-6">
					<h3 className="text-lg font-semibold mb-3">
						Change Password
					</h3>

					<div className="flex gap-4 max-w-md">
						<input
							type="password"
							placeholder="New password"
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
							className="flex-1 rounded-lg border px-4 py-2"
						/>

						<button
							onClick={handleChangePassword}
							className="rounded-lg bg-violet-500 px-5 py-2 text-white font-semibold hover:bg-violet-600"
						>
							Update
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Profile;
