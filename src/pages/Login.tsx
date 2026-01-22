import { useState } from 'react';

export default function Login() {
	const [isNewUser, setIsNewUser] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log({ email, password });
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

				<form onSubmit={handleSubmit} className="space-y-5">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Email
						</label>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="you@example.com"
							className="w-full rounded-lg border border-gray-300 px-4 py-2
                focus:outline-none focus:ring-2 focus:ring-pink-400"
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Password
						</label>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="••••••••"
							className="w-full rounded-lg border border-gray-300 px-4 py-2
                focus:outline-none focus:ring-2 focus:ring-pink-400"
							required
						/>
					</div>

					{isNewUser &&
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Confirm Password
								</label>
								<input
									type="password"
									value={passwordConfirm}
									onChange={(e) => setPassword(e.target.value)}
									placeholder="Please confirm password"
									className="w-full rounded-lg border border-gray-300 px-4 py-2
		                focus:outline-none focus:ring-2 focus:ring-pink-400"
									required
								/>
							</div>
					}

					<button
						type="submit"
						className="w-full bg-pink-500 hover:bg-pink-600 text-white
              font-semibold py-2.5 rounded-lg transition"
					>
						Sign In
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
