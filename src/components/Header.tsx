// src/components/Header.tsx
import { useLocation, useNavigate } from 'react-router-dom';
import { FaSignInAlt } from 'react-icons/fa';
import { BsFillInfoCircleFill } from 'react-icons/bs';
import { MdEmail } from 'react-icons/md';

const Header = () => {
	const navigate = useNavigate();
	const { pathname } = useLocation();

	const activePage = pathname.split('/')[1] || null;

	const headerLinks = [
		{
			id: 'about',
			label: 'About Us',
			path: '/about',
			Icon: BsFillInfoCircleFill,
		},
		{
			id: 'contact',
			label: 'Contact',
			path: '/contact',
			Icon: MdEmail,
		},
		{
			id: 'login',
			label: 'Sign In',
			path: '/login',
			Icon: FaSignInAlt,
		},
	];

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
					{headerLinks.map(({ id, label, path, Icon }) => {
						const isActive = activePage === id;
						return (
							<div
								key={id}
								onClick={() => navigate(path)}
								className={`flex flex-row items-center justify-center gap-2 px-4 py-2 font-semibold  transition-transform duration-150 hover:-translate-y-1 rounded-full hover:bg-white/30 hover:font-bold
							  	${isActive ? 'text-violet-400 shadow-sm bg-white/20 rounded-full font-bold' : 'text-white'}`}
							>
								<Icon
									fontSize="medium"
									className={isActive ? 'text-violet-400' : 'text-white'}
								/>
								<p
									className={`text-sm ${
										isActive ? 'text-violet-400' : 'text-white'
									}`}
								>
									{label}
								</p>
							</div>
						);
					})}
				</nav>
			</div>
		</header>
	);
};

export default Header;
