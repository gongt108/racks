// src/layouts/MainLayout.tsx
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const MainLayout = () => {
	return (
		<div className="min-h-screen bg-background flex flex-col">
			<Header />
			<main className="overflow-y-auto flex-1">
				<Outlet />
			</main>
			<Footer />
		</div>
	);
};

export default MainLayout;
