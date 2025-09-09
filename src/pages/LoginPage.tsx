import React, { useState } from 'react';

interface LoginPageProps {
  onLogin: (username: string, password: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('لطفاً نام کاربری و رمز عبور را وارد کنید.');
      return;
    }

    // Simulate an async login for a better user experience
    // In a real app, this would be an API call
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));

      if (username !== 'admin' || password !== '123456') {
        setError('نام کاربری یا رمز عبور اشتباه است.');
        return;
      }
      onLogin(username, password);
    } catch (err) {
      setError('خطایی در هنگام ورود رخ داد. لطفاً دوباره تلاش کنید.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 sm:p-10 transform transition-all duration-300 hover:scale-[1.01]">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-2">
            ورود به سیستم
          </h2>
          <p className="text-lg text-gray-600">
            سیستم مدیریت انبار هوشمند
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          {/* Username Input */}
          <div>
            <label htmlFor="username" className="sr-only">نام کاربری</label>
            <div className="relative">
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full px-5 py-3 pr-12 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base transition duration-200 ease-in-out"
                placeholder="نام کاربری"
              />
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                {/* User Icon (using a simple text icon for demonstration, in a real app use an SVG icon library) */}
                👤
              </span>
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="sr-only">رمز عبور</label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-5 py-3 pr-12 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base transition duration-200 ease-in-out"
                placeholder="رمز عبور"
              />
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                {/* Lock Icon */}
                🔒
              </span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm text-center animate-pulse">
              {error}
            </div>
          )}

          {/* Login Button */}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent text-lg font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md transform transition-all duration-200 ease-in-out hover:scale-105 active:scale-95"
            >
              ورود
            </button>
          </div>

          {/* Hint for Credentials */}
          <div className="text-center text-sm text-gray-500 mt-6">
            <p className="text-gray-500 text-sm">
              برای تست: <span className="font-semibold">نام کاربری:</span> admin | <span className="font-semibold">رمز عبور:</span> 123456
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;