import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { Button, Input } from '../components/ui';

const Login = () => {
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    await login({ username: formData.username, password: formData.password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 page-backdrop">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center items-center space-x-3 mb-4">
            <img src="/jour.png" alt="Faculty Logo" className="h-14 w-auto object-contain" />
            <img src="/kdr.png" alt="Kandahar University Logo" className="h-14 w-auto object-contain" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-1">
            Journalism and Public Relations Faculty
          </h2>
          <p className="text-base text-gray-500 mb-4">Admin Portal</p>
          <h3 className="text-xl font-semibold text-gray-800">Sign in to your account</h3>
          <p className="mt-1 text-sm text-gray-500">Enter your credentials to access the admin dashboard</p>
        </div>

        {/* Form card */}
        <div className="glass-panel-strong rounded-2xl p-8 space-y-6 border border-white/90">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Username"
              name="username"
              type="text"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              error={errors.username}
              icon={<FiMail size={20} />}
              fullWidth
              required
            />

            <div className="relative">
              <Input
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                icon={<FiLock size={20} />}
                fullWidth
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 border-gray-300 rounded"
                  style={{ accentColor: '#C79C78' }}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to="/admin/forgot-password"
                  className="font-medium hover:opacity-75 transition-opacity"
                  style={{ color: '#C79C78' }}
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button type="submit" variant="primary" size="lg" fullWidth loading={isLoading} disabled={isLoading}>
              Sign In
            </Button>
          </form>

          <div className="text-center text-sm text-gray-600">
            <Link
              to="/"
              className="font-medium hover:opacity-75 transition-opacity"
              style={{ color: '#C79C78' }}
            >
              ← Back to website
            </Link>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Journalism and Public Relations Faculty. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
