import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import PageHero from '../components/PageHero';
import SectionHeader from '../components/SectionHeader';
import { Card, Spinner, Alert, Input, Textarea } from '../components/ui';
import { contactAPI } from '../services/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({});

  const { data, isLoading } = useQuery({
    queryKey: ['contact'],
    queryFn: contactAPI.get,
  });

  const sendMessageMutation = useMutation({
    mutationFn: contactAPI.sendMessage,
    onSuccess: () => {
      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setErrors({});
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to send message');
    },
  });

  const contactInfo = data?.data;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    sendMessageMutation.mutate(formData);
  };

  const InfoRow = ({ icon: Icon, label, children }) => (
    <div className="flex items-start gap-4">
      <div className="w-11 h-11 shrink-0 flex items-center justify-center bg-[rgba(199,156,120,0.12)]">
        <Icon size={20} className="text-[#C79C78]" />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">{label}</p>
        {children}
      </div>
    </div>
  );

  return (
    <Layout>
      <PageHero
        title="Contact Us"
        subtitle="Get in touch with the Faculty of Journalism and Public Relations. We welcome your inquiries."
        breadcrumbs={[{ label: 'Contact' }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-1 space-y-6">
            <Card className="!p-0 overflow-hidden">
              <div className="h-1.5 bg-[#C79C78]" />
              <div className="p-6">
                <SectionHeader title="Contact Information" />
                {isLoading ? (
                  <div className="flex justify-center py-8"><Spinner /></div>
                ) : contactInfo ? (
                  <div className="space-y-6">
                    {contactInfo.email && (
                      <InfoRow icon={FiMail} label="Email">
                        <a href={`mailto:${contactInfo.email}`} className="text-sm text-[#C79C78] hover:underline break-all">
                          {contactInfo.email}
                        </a>
                      </InfoRow>
                    )}
                    {(contactInfo.phoneNumber || contactInfo.phone) && (
                      <InfoRow icon={FiPhone} label="Phone">
                        <a href={`tel:${contactInfo.phoneNumber || contactInfo.phone}`} className="text-sm text-slate-700">
                          {contactInfo.phoneNumber || contactInfo.phone}
                        </a>
                      </InfoRow>
                    )}
                    {contactInfo.address && (
                      <InfoRow icon={FiMapPin} label="Address">
                        <p className="text-sm text-slate-700">{contactInfo.address}</p>
                      </InfoRow>
                    )}
                  </div>
                ) : (
                  <Alert type="info" message="Contact information not available" />
                )}
              </div>
            </Card>

            <Card className="!p-0 overflow-hidden">
              <div className="h-1.5 bg-[#C79C78]" />
              <div className="p-6">
                <SectionHeader title="Office Hours" />
                {contactInfo?.workingHours ? (
                  <p className="text-sm text-slate-700 leading-relaxed">{contactInfo.workingHours}</p>
                ) : (
                  <p className="text-sm text-slate-500">Office hours not set. Update them in Admin → Contact.</p>
                )}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="!p-0 overflow-hidden">
              <div className="h-1.5 bg-[#C79C78]" />
              <div className="p-6 sm:p-8">
                <SectionHeader
                  title="Send us a Message"
                  description="Fill out the form below and our team will respond as soon as possible."
                />

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Input label="Your Name" name="name" placeholder="Ahmad" value={formData.name} onChange={handleChange} error={errors.name} required fullWidth />
                    <Input label="Your Email" name="email" type="email" placeholder="ahmad@example.com" value={formData.email} onChange={handleChange} error={errors.email} required fullWidth />
                  </div>
                  <Input label="Subject" name="subject" placeholder="How can we help you?" value={formData.subject} onChange={handleChange} error={errors.subject} required fullWidth />
                  <Textarea label="Message" name="message" placeholder="Your message..." value={formData.message} onChange={handleChange} error={errors.message} rows={6} required fullWidth />
                  <button type="submit" disabled={sendMessageMutation.isPending} className="btn-primary w-full sm:w-auto">
                    <FiSend size={18} />
                    {sendMessageMutation.isPending ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
