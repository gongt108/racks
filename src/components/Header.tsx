// src/components/Header.tsx
const Header = () => {
	return (
		<header className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-10 bg-white">
			<div className="mx-auto flex w-full max-w-[72rem] justify-between py-6 ">
				<div className="flex items-center gap-3">
					<div className="flex flex-col space-y-1">
						<h1 className="text-3xl font-bold tracking-tight text-foreground">
							RACKS
						</h1>
						<p>re-envision your retail</p>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<div>
						<p>About Us</p>
					</div>
					<div>
						<p>Contact</p>
					</div>
					<div>
						<p>Sign In</p>
					</div>
				</div>
			</div>
		</header>
	);
};

export default Header;
