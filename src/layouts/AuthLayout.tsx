import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-rose-200">
			<Outlet />
		</div>
	);
};

export default AuthLayout;
