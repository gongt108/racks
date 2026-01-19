// src/layouts/MainLayout.tsx
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const MainLayout = () => {
	return (
		<div className="min-h-screen h-screen bg-background flex-col">
			<Header />
			<main className="overflow-y-scroll flex-1 h-full">
				<Outlet />
			</main>
			<Footer />
		</div>
	);
};

export default MainLayout;
