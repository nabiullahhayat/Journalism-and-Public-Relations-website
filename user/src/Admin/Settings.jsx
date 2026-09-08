import { useState } from 'react';
import { Card, Button, Input, Alert } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';

const Settings = () => {
  const { changePassword, isLoading } = useAuth();
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword.length < 8) {
      setError('New password must be at least 8 characters');
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const result = await changePassword({
      currentPassword: form.currentPassword,
      newPassword: form.newPassword,
    });

    if (result.success) {
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-600 mt-1">Manage your account security</p>
      </div>

      <Card title="Change Password">
        {error && <div className="mb-4"><Alert type="error" message={error} /></div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Current Password"
            name="currentPassword"
            type="password"
            value={form.currentPassword}
            onChange={handleChange}
            required
            fullWidth
          />
          <Input
            label="New Password"
            name="newPassword"
            type="password"
            value={form.newPassword}
            onChange={handleChange}
            required
            fullWidth
            helperText="Minimum 8 characters"
          />
          <Input
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            fullWidth
          />
          <Button type="submit" variant="primary" loading={isLoading}>
            Update Password
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Settings;
