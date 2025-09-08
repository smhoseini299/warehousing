import React, { useState } from 'react';
import { LogIn, Package } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export default function LoginPage() {
  const { dispatch } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Simple authentication - in real app, this would be an API call
    if (username === 'admin' && password === '123456') {
      dispatch({
        type: 'LOGIN',
        payload: { id: '1', username: 'مدیر سیستم', role: 'admin' }
      });
      dispatch({ type: 'LOAD_INITIAL_DATA' });
    } else {
      setError('نام کاربری یا رمز عبور اشتباه است');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center">
            <Package className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            سیستم مدیریت انبار
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            جهت ورود به سیستم اطلاعات خود را وارد کنید
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">نام کاربری</label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm text-right"
                placeholder="نام کاربری"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">رمز عبور</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm text-right"
                placeholder="رمز عبور"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded-md">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <span className="absolute right-0 inset-y-0 flex items-center pr-3">
                <LogIn className="h-5 w-5 text-blue-500 group-hover:text-blue-400" />
              </span>
              ورود به سیستم
            </button>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              نام کاربری: admin | رمز عبور: 123456
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}