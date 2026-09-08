import { useEffect, useState } from 'react';
import { Card, Button, Input, Badge, Spinner } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user, updateProfile, isLoading } = useAuth();
  const [form, setForm] = useState({
    username: '',
    email: '',
    fullName: '',
    phone: '',
  });

  useEffect(() => {
    if (user) {
      setForm({
        username: user.username || '',
        email: user.email || '',
        fullName: user.fullName || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateProfile(form);
  };

  if (!user) {
    return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
        <p className="text-gray-600 mt-1">Update your account information</p>
      </div>

      <Card>
        <div className="mb-6 flex items-center gap-3">
          <Badge variant="primary" className="capitalize">{user.role}</Badge>
          {user.department && <Badge>{user.department.name || user.department}</Badge>}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Username" name="username" value={form.username} onChange={handleChange} required fullWidth />
          <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} required fullWidth />
          <Input label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} fullWidth />
          <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} fullWidth />
          <Button type="submit" variant="primary" loading={isLoading}>
            Save Profile
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Profile;
