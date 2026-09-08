import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Card, Button, Input, Textarea, Spinner, Alert } from '../components/ui';
import { contactAPI } from '../services/api';

const ContactManagement = () => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    phoneNumber: '',
    whatsapp: '',
    email: '',
    address: '',
    workingHours: '',
    facebookUrl: '',
    twitterUrl: '',
    linkedinUrl: '',
    instagramUrl: '',
    youtubeUrl: '',
    mapEmbedUrl: '',
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-contact'],
    queryFn: () => contactAPI.get(),
  });

  useEffect(() => {
    const contact = data?.data;
    if (contact) {
      setForm({
        phoneNumber: contact.phoneNumber || '',
        whatsapp: contact.whatsapp || '',
        email: contact.email || '',
        address: contact.address || '',
        workingHours: contact.workingHours || '',
        facebookUrl: contact.facebookUrl || '',
        twitterUrl: contact.twitterUrl || '',
        linkedinUrl: contact.linkedinUrl || '',
        instagramUrl: contact.instagramUrl || '',
        youtubeUrl: contact.youtubeUrl || '',
        mapEmbedUrl: contact.mapEmbedUrl || '',
      });
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: (payload) => contactAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-contact'] });
      queryClient.invalidateQueries({ queryKey: ['contact'] });
      toast.success('Contact information updated');
    },
    onError: (err) => toast.error(err.message || 'Failed to update contact'),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  if (isLoading) {
    return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;
  }

  if (error) {
    return <Alert type="error" message="Failed to load contact information" />;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Contact Management</h2>
        <p className="text-gray-600 mt-1">Edit contact details shown on the public Contact page</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Phone Number" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} required fullWidth />
            <Input label="WhatsApp" name="whatsapp" value={form.whatsapp} onChange={handleChange} required fullWidth />
            <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} required fullWidth />
            <Input label="Working Hours" name="workingHours" value={form.workingHours} onChange={handleChange} fullWidth />
          </div>
          <Textarea label="Address" name="address" value={form.address} onChange={handleChange} rows={3} fullWidth />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Facebook URL" name="facebookUrl" value={form.facebookUrl} onChange={handleChange} required fullWidth />
            <Input label="Twitter URL" name="twitterUrl" value={form.twitterUrl} onChange={handleChange} fullWidth />
            <Input label="LinkedIn URL" name="linkedinUrl" value={form.linkedinUrl} onChange={handleChange} fullWidth />
            <Input label="Instagram URL" name="instagramUrl" value={form.instagramUrl} onChange={handleChange} fullWidth />
            <Input label="YouTube URL" name="youtubeUrl" value={form.youtubeUrl} onChange={handleChange} fullWidth />
            <Input label="Map Embed URL" name="mapEmbedUrl" value={form.mapEmbedUrl} onChange={handleChange} fullWidth />
          </div>
          <Button type="submit" variant="primary" loading={mutation.isPending}>
            Save Changes
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default ContactManagement;
