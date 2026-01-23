import { AuthProvider } from '@/context/AuthContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import Index from './pages/Index';
import Login from './pages/Login';
import Inventory from './pages/Inventory';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

function App() {
	return (
		<>
			<AuthProvider>
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
							<Route path="/dashboard" element={<Dashboard />} />
							<Route path="*" element={<NotFound />} />
						</Route>
						<Route element={<AuthLayout />}>
							<Route path="/login" element={<Login />} />
						</Route>
					</Routes>
				</BrowserRouter>
			</AuthProvider>
		</>
	);
}

export default App;
