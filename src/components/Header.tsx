// src/components/Header.tsx
import { useLocation, useNavigate } from 'react-router-dom';
import { FaSignInAlt } from 'react-icons/fa';

const Header = () => {
	const navigate = useNavigate();
	const { pathname } = useLocation();

	const activePage = pathname.split('/')[1] || null;

	return (
		<header
			className="
				sticky top-0 z-20
				border-b border-white/10
				bg-gradient-to-r from-violet-300 to-pink-300
			"
		>
			<div className="mx-auto flex w-full max-w-[72rem] items-center justify-between px-4 py-5">
				{/* Logo / Brand */}
				<div className="flex items-center gap-3">
					<div className="flex flex-col leading-tight">
						<h1 className="text-3xl font-extrabold tracking-tight text-white">
							RACKS
						</h1>
						<p className="text-sm text-pink-100">re-envision your retail</p>
					</div>
				</div>

				{/* Nav */}
				<nav className="flex items-center gap-6 text-sm font-medium text-pink-100">
					<div
						className="
							flex items-center gap-2 px-4 py-2
							 font-white font-semibold
							transition-transform duration-150
							hover:-translate-y-1 rounded-full hover:bg-white/30 hover:font-bold hover:text-violet-400
							"
					>
						About Us
					</div>
					<div
						onClick={() => navigate('/login')}
						className="
							flex items-center gap-2 px-4 py-2
							bg-white/20 font-white font-semibold
							shadow-sm
							transition-transform duration-150
							hover:-translate-y-1 rounded-full hover:bg-white/30 hover:font-bold hover:text-violet-400
							"
					>
						Contact
					</div>
					<div
						onClick={() => navigate('/login')}
						className="
							flex items-center gap-2 px-4 py-2
							bg-white/20 font-white font-semibold
							shadow-sm
							transition-transform duration-150
							hover:-translate-y-1 rounded-full hover:bg-white/30 hover:font-bold hover:text-violet-400
							"
					>
						<FaSignInAlt className="w-4 h-4" />
						Sign In
					</div>
				</nav>
			</div>
		</header>
	);
};

export default Header;
