import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AuthLayout = () => {
	return (
		<div className="min-h-screen flex flex-col">
			<Header />
			<main className="flex-1 flex items-center justify-center bg-gradient-to-br from-pink-100 to-rose-200">
				<Outlet />
			</main>
			<Footer />
		</div>
	);
};

export default AuthLayout;
