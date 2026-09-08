import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Card, Button, Textarea, Spinner, Alert } from '../components/ui';
import { aboutAPI } from '../services/api';

const AboutManagement = () => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    facultyDescription: '',
    facultyVision: '',
    facultyMission: '',
    requirements: '',
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-about'],
    queryFn: () => aboutAPI.get(),
  });

  useEffect(() => {
    const about = data?.data;
    if (about) {
      setForm({
        facultyDescription: about.facultyDescription || '',
        facultyVision: about.facultyVision || '',
        facultyMission: about.facultyMission || '',
        requirements: Array.isArray(about.requirements)
          ? about.requirements.join('\n')
          : about.requirements || '',
      });
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: (payload) => aboutAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-about'] });
      queryClient.invalidateQueries({ queryKey: ['about'] });
      toast.success('About page updated');
    },
    onError: (err) => toast.error(err.message || 'Failed to update about page'),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      facultyDescription: form.facultyDescription,
      facultyVision: form.facultyVision,
      facultyMission: form.facultyMission,
      requirements: form.requirements
        .split('\n')
        .map((r) => r.trim())
        .filter(Boolean),
    });
  };

  if (isLoading) {
    return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;
  }

  if (error) {
    return <Alert type="error" message="Failed to load about information" />;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">About Management</h2>
        <p className="text-gray-600 mt-1">Edit the public About page content</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-5">
          <Textarea
            label="Faculty Description"
            name="facultyDescription"
            value={form.facultyDescription}
            onChange={handleChange}
            rows={6}
            required
            fullWidth
          />
          <Textarea
            label="Faculty Vision"
            name="facultyVision"
            value={form.facultyVision}
            onChange={handleChange}
            rows={4}
            required
            fullWidth
          />
          <Textarea
            label="Faculty Mission"
            name="facultyMission"
            value={form.facultyMission}
            onChange={handleChange}
            rows={4}
            required
            fullWidth
          />
          <Textarea
            label="Requirements (one per line)"
            name="requirements"
            value={form.requirements}
            onChange={handleChange}
            rows={5}
            helperText="Each line becomes a separate requirement item"
            fullWidth
          />
          <Button type="submit" variant="primary" loading={mutation.isPending}>
            Save Changes
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default AboutManagement;
