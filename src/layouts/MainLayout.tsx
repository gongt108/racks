// src/layouts/MainLayout.tsx
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const MainLayout = () => {
	return (
		<div className="max-h-screen h-screen bg-background">
			<Header />
			<main className="overflow-y-scroll flex-1">
				<Outlet />
			</main>
			<Footer />
		</div>
	);
};

export default MainLayout;
