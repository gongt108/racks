// src/layouts/MainLayout.tsx
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '@/hooks/useAuth';

const HIDE_PREVIEW_ROUTES = ['/login', '/about', '/contact'];

const MainLayout = () => {
	const { user, isLoading } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	const shouldShowPreview =
		!isLoading && !user && !HIDE_PREVIEW_ROUTES.includes(location.pathname);

	return (
		<div className="min-h-screen flex flex-col relative">
			<Header />
			<main className="flex-1 overflow-y-auto">
				<Outlet />
			</main>
			<Footer />

			{shouldShowPreview && (
				<>
					<div className="fixed inset-0 bg-white/20 backdrop-blur-sm z-40" />

					<div className="fixed inset-0 z-50 flex items-center justify-center">
						<div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center">
							<h2 className="text-xl font-semibold mb-2">Preview Mode</h2>
							<p className="text-gray-600 mb-4">
								Please log in to use full functionality.
							</p>

							<button
								onClick={() => navigate('/login')}
								className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-lg"
							>
								Log in
							</button>
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default MainLayout;
