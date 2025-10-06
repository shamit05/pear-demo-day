'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Check for redirect URL (only for investors)
        const redirectUrl = localStorage.getItem('redirectAfterLogin');
        if (redirectUrl && data.user.role === 'investor') {
          localStorage.removeItem('redirectAfterLogin');
          router.push(redirectUrl);
        } else {
          // Redirect based on role
          if (data.user.role === 'admin') {
            router.push('/dashboard/admin');
          } else if (data.user.role === 'founder') {
            router.push('/dashboard/founder');
          } else {
            router.push('/dashboard/investor');
          }
        }
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--fill-color)] to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <img 
              src="https://pear.vc/wp-content/themes/pear-vc/assets/images/pearvc_logo.png" 
              alt="Pear VC"
              className="h-12 w-auto mx-auto mb-4"
            />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Demo Day Portal</h1>
          <p className="text-gray-600">Sign in to manage connections</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-black/10">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--button-color)] focus:border-[var(--button-color)] transition"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--button-color)] focus:border-[var(--button-color)] transition"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--button-color)] text-black font-bold py-3 rounded-lg hover:bg-[var(--button-color)]/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Quick Login Buttons for Demo */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3 text-center">Quick Login (Demo)</p>
            <div className="space-y-2">
              <button
                onClick={() => quickLogin('investor@demo.com', 'investor123')}
                className="w-full px-4 py-2 border-2 border-black bg-transparent text-black rounded-lg hover:bg-black hover:text-white transition text-sm font-medium"
              >
                Investor Account
              </button>
              <button
                onClick={() => quickLogin('admin@pear.vc', 'admin123')}
                className="w-full px-4 py-2 border-2 border-black bg-transparent text-black rounded-lg hover:bg-black hover:text-white transition text-sm font-medium"
              >
                Admin Account
              </button>
              <button
                onClick={() => quickLogin('founder@innovate.com', 'founder123')}
                className="w-full px-4 py-2 border-2 border-black bg-transparent text-black rounded-lg hover:bg-black hover:text-white transition text-sm font-medium"
              >
                Founder Account
              </button>
            </div>
          </div>
        </div>

        {/* Back to site */}
        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-gray-600 hover:text-black transition">
            ← Back to Demo Day
          </Link>
        </div>
      </div>
    </div>
  );
}
