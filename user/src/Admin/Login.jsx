import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { Button, Input } from '../components/ui';
import BrandLogos from '../components/BrandLogos';
import { DEVELOPER_NAME } from '../config/routes';
import toast from 'react-hot-toast';

const Login = () => {
  const { login } = useAuth();
  const [submitting, setSubmitting] = useState(false);
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
    if (!validateForm() || submitting) return;

    setSubmitting(true);
    try {
      await login({ username: formData.username.trim(), password: formData.password });
    } catch (error) {
      toast.error(error.message || 'Login failed. Check username, password, and that the backend is running.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 page-backdrop">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <BrandLogos size="md" className="justify-center" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-1 font-serif">
            Journalism & Public Relations Faculty
          </h2>
          <p className="text-base text-gray-500 mb-4">Staff Login</p>
          <h3 className="text-xl font-semibold text-gray-800">Sign in to your account</h3>
          <p className="mt-1 text-sm text-gray-500">Enter your credentials to access the dashboard</p>
        </div>

        <div className="glass-panel-strong rounded-2xl p-8 space-y-6 border border-white/90">
          <form
            id="staff-login-form"
            onSubmit={handleSubmit}
            className="space-y-5"
            method="post"
            autoComplete="on"
            noValidate
            data-lpignore="true"
            data-1p-ignore
          >
            <Input
              label="Username"
              name="username"
              id="staff-username"
              type="text"
              autoComplete="username"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              data-lpignore="true"
              data-1p-ignore
              data-form-type="other"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              error={errors.username}
              icon={<FiUser size={20} />}
              fullWidth
              required
            />

            <div className="relative">
              <Input
                label="Password"
                name="password"
                id="staff-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                data-lpignore="true"
                data-1p-ignore
                data-form-type="other"
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
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>

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

            <Button type="submit" variant="primary" size="lg" fullWidth loading={submitting} disabled={submitting}>
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

        <p className="text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Journalism & Public Relations Faculty · Developed by {DEVELOPER_NAME}
        </p>
      </div>
    </div>
  );
};

export default Login;
