import { AuthProvider } from '@/context/AuthContext';
import { PricingProvider } from '@/context/PricingContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import Index from './pages/Index';
import Login from './pages/Login';
import Inventory from './pages/Inventory';
import EditItem from './pages/EditItem';
import Sold from './pages/Sold';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

function App() {
	return (
		<>
			<AuthProvider>
				<PricingProvider>
					<BrowserRouter>
						<ToastContainer
							position="top-right"
							autoClose={4000}
							hideProgressBar={false}
							closeOnClick
							pauseOnHover
							draggable
						/>
						<Routes>
							<Route element={<MainLayout />}>
								<Route path="/" element={<Index />} />
								<Route path="/inventory" element={<Inventory />} />
								<Route path="/edit/:itemId" element={<EditItem />} />
								<Route path="/sold" element={<Sold />} />
								<Route path="/dashboard" element={<Dashboard />} />
								<Route path="/settings" element={<Settings />} />
								<Route path="/profile" element={<Profile />} />
								<Route path="*" element={<NotFound />} />
							</Route>
							<Route element={<AuthLayout />}>
								<Route path="/login" element={<Login />} />
							</Route>
						</Routes>
					</BrowserRouter>
				</PricingProvider>
			</AuthProvider>
		</>
	);
}

export default App;
