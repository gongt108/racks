// src/components/Header.tsx
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/supabaseClient';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaSignInAlt } from 'react-icons/fa';
import { BsFillInfoCircleFill } from 'react-icons/bs';
import { MdEmail } from 'react-icons/md';

const Header = () => {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const [user, setUser] = useState<any>(null);
	const [open, setOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		supabase.auth.getUser().then(({ data }) => {
			setUser(data.user);
		});

		const { data: listener } = supabase.auth.onAuthStateChange(
			(_event, session) => {
				setUser(session?.user ?? null);
			},
		);

		return () => listener.subscription.unsubscribe();
	}, []);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(e.target as Node)
			) {
				setOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const initial =
		user?.user_metadata?.firstName?.[0]?.toUpperCase() ??
		user?.email?.[0]?.toUpperCase();

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
				<nav className="flex flex-row items-center w-1/2 max-w-[24rem] justify-between text-sm font-medium text-pink-100">
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
					{/* AUTH BUTTON */}
					{user ? (
						<div className="relative" ref={dropdownRef}>
							<button
								onClick={() => setOpen(!open)}
								className="
								h-10 w-10 rounded-full
								bg-white text-violet-600
								font-bold text-lg
								flex items-center justify-center
								shadow-md hover:scale-105 transition
							"
							>
								{initial}
							</button>

							{open && (
								<div
									className="
				absolute right-0 mt-3 w-40
				rounded-xl bg-white shadow-lg
				overflow-hidden text-sm
			"
								>
									<button
										onClick={() => {
											navigate('/profile');
											setOpen(false);
										}}
										className="block w-full px-4 py-3 text-left hover:bg-gray-100"
									>
										Profile
									</button>

									<button
										onClick={async () => {
											await supabase.auth.signOut();
											setOpen(false);
											navigate('/login');
										}}
										className="block w-full px-4 py-3 text-left text-red-500 hover:bg-gray-100"
									>
										Log out
									</button>
								</div>
							)}
						</div>
					) : (
						<div
							onClick={() => navigate('/login')}
							className={`flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 ${activePage === 'login' ? 'text-violet-400' : 'text-white'} font-semibold cursor-pointer hover:bg-white/30`}
						>
							<FaSignInAlt className="h-4 w-4" />
							Sign In
						</div>
					)}
				</nav>
			</div>
		</header>
	);
};

export default Header;
