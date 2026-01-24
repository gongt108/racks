import { useRef, useState, useEffect } from 'react';
import { FaCircleExclamation } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/supabaseClient';
import { toast } from 'react-toastify';

interface NewUser {
	email: string;
	password: string;
	passwordConfirm: string;
	firstName: string | null;
	lastName: string | null;
}

type FieldName = 'email' | 'password' | 'passwordConfirm';

type FieldError = {
	field: 'email' | 'password' | 'passwordConfirm' | null;
	message: string;
};

const ErrorMessage = ({ text }: { text: string }) => (
	<div className="mt-1 flex items-center gap-1 text-sm text-red-500">
		<FaCircleExclamation className="h-4 w-4" />
		<span>{text}</span>
	</div>
);

export default function Login() {
	const [isNewUser, setIsNewUser] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [newUser, setNewUser] = useState<NewUser>({
		email: '',
		password: '',
		passwordConfirm: '',
		firstName: null,
		lastName: null,
	});
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		const loadUser = async () => {
			const { data, error } = await supabase.auth.getUser();
			if (data.user) {
				navigate('/');
			}
			setLoading(false);
		};

		loadUser();
	}, [navigate]);

	const fieldRefs = useRef<Record<FieldName, HTMLDivElement | null>>({
		email: null,
		password: null,
		passwordConfirm: null,
	});

	const [fieldError, setFieldError] = useState<FieldError>({
		field: null,
		message: '',
	});

	const handleNewUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setNewUser((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const validateUserInput = (e: React.FormEvent) => {
		e.preventDefault();

		// EMAIL
		if (!email.trim()) {
			setFieldError({
				field: 'email',
				message: 'Email is required',
			});
			scrollToField('email');
			return;
		}

		// PASSWORD
		if (!password.trim()) {
			setFieldError({
				field: 'password',
				message: 'Password is required',
			});
			scrollToField('password');
			return;
		}

		// CONFIRM PASSWORD
		if (isNewUser && password.trim() && password !== newUser.passwordConfirm) {
			setFieldError({
				field: 'passwordConfirm',
				message: 'Passwords do not match',
			});
			scrollToField('passwordConfirm');
			return;
		}

		setFieldError({ field: null, message: '' });

		const createdUser = { ...newUser, email, password };
		loginOrSignUp(createdUser);
	};

	const scrollToField = (field: FieldName) => {
		fieldRefs.current[field]?.scrollIntoView({
			behavior: 'smooth',
			block: 'center',
		});
	};

	const loginOrSignUp = async (createdUser: {
		email: string;
		password: string;
		passwordConfirm: string;
		firstName: string | null;
		lastName: string | null;
	}) => {
		setLoading(true);

		try {
			if (isNewUser) {
				// SIGN UP
				const { error } = await supabase.auth.signUp({
					email: createdUser.email,
					password: createdUser.password,
					options: {
						data: {
							firstName: createdUser.firstName,
							lastName: createdUser.lastName,
						},
					},
				});

				if (error) {
					toast.error(error.message);
					return;
				}

				toast.success('Account created successfully!');
				navigate('/');
			} else {
				// LOGIN
				const { error } = await supabase.auth.signInWithPassword({
					email: email,
					password: password,
				});

				if (error) {
					toast.error(error.message);
					return;
				}

				toast.success('You are logged in successfully!');
				navigate('/');
			}
		} catch (err) {
			console.error(err);
			toast.error('Something went wrong. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="w-full flex flex-col items-center justify-center bg-gradient-to-br from-pink-100 to-rose-200">
			<div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
				<h1 className="text-3xl font-bold text-center text-rose-600 mb-2">
					Welcome Back
				</h1>
				<p className="text-center text-gray-500 mb-6">
					Sign in to your account
				</p>

				<form onSubmit={validateUserInput} className="space-y-5">
					<div ref={(el) => (fieldRefs.current.email = el)}>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Email Address
						</label>
						<input
							type="email"
							name="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="you@example.com"
							className="w-full rounded-lg border border-gray-300 px-4 py-2
                focus:outline-none focus:ring-2 focus:ring-pink-400"
						/>
						{fieldError.field === 'email' && (
							<ErrorMessage text={fieldError.message} />
						)}
					</div>

					<div ref={(el) => (fieldRefs.current.password = el)}>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Password
						</label>
						<input
							type="password"
							name="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="••••••••"
							className="w-full rounded-lg border border-gray-300 px-4 py-2
                focus:outline-none focus:ring-2 focus:ring-pink-400"
						/>
						{fieldError.field === 'password' && (
							<ErrorMessage text={fieldError.message} />
						)}
					</div>

					{isNewUser && (
						<div className="space-y-5">
							<div ref={(el) => (fieldRefs.current.passwordConfirm = el)}>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Confirm Password
								</label>
								<input
									type="password"
									name="passwordConfirm"
									value={newUser.passwordConfirm}
									onChange={handleNewUserInput}
									placeholder="Please confirm password"
									className="w-full rounded-lg border border-gray-300 px-4 py-2
                                                    focus:outline-none focus:ring-2 focus:ring-pink-400"
								/>
								{fieldError.field === 'passwordConfirm' && (
									<ErrorMessage text={fieldError.message} />
								)}
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									First Name
								</label>
								<input
									type="text"
									name="firstName"
									value={newUser.firstName}
									onChange={handleNewUserInput}
									placeholder="First Name"
									className="w-full rounded-lg border border-gray-300 px-4 py-2
                focus:outline-none focus:ring-2 focus:ring-pink-400"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Last Name
								</label>
								<input
									type="text"
									name="lastName"
									value={newUser.lastName}
									onChange={handleNewUserInput}
									placeholder="Last Name"
									className="w-full rounded-lg border border-gray-300 px-4 py-2
                focus:outline-none focus:ring-2 focus:ring-pink-400"
								/>
							</div>
						</div>
					)}

					<button
						type="submit"
						className="w-full bg-pink-500 hover:bg-pink-600 text-white
              font-semibold py-2.5 rounded-lg transition"
					>
						Sign {isNewUser ? 'Up' : 'In'}
					</button>
				</form>

				<p className="text-center text-sm text-gray-500 mt-6">
					{isNewUser ? (
						<>
							Have an account?{' '}
							<button
								type="button"
								onClick={() => setIsNewUser(false)}
								className="text-pink-500 font-semibold hover:underline"
							>
								Log in
							</button>
						</>
					) : (
						<>
							Don’t have an account?{' '}
							<button
								type="button"
								onClick={() => setIsNewUser(true)}
								className="text-pink-500 font-semibold hover:underline"
							>
								Sign up
							</button>
						</>
					)}
				</p>
			</div>
		</div>
	);
}
