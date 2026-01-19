import { AuthProvider } from "@/context/AuthContext";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Index from './pages/Index';
import Inventory from './pages/Inventory';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

function App() {
	return (
		<>
			<AuthProvider>
				<BrowserRouter>
					<Routes>
						<Route element={<MainLayout />}>
							<Route path="/" element={<Index />} />
							{/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
							<Route path="/inventory" element={<Inventory />} />
							<Route path="/dashboard" element={<Dashboard />} />
							<Route path="*" element={<NotFound />} />
						</Route>
					</Routes>
				</BrowserRouter>
   </AuthProvider>
		</>
	);
}

export default App;
