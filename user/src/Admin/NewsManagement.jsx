import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiPlus, FiEdit2, FiTrash2, FiImage, FiX, FiStar, FiFileText } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { 
  Card, 
  Button, 
  Input, 
  Textarea, 
  Select, 
  Modal, 
  Table, 
  Badge,
  Pagination,
  Spinner,
  EmptyState,
  Alert
} from '../components/ui';
import { newsAPI } from '../services/api';
import { getImageUrl } from '../utils/image';

const NewsManagement = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    image: null,
    featured: false,
  });
  const [errors, setErrors] = useState({});

  const limit = 10;

  // Fetch news
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-news', page, search],
    queryFn: () => newsAPI.getAll({ page, limit, search }),
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data) => newsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-news']);
      toast.success('News created successfully!');
      handleCloseModal();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create news');
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => newsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-news']);
      toast.success('News updated successfully!');
      handleCloseModal();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update news');
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => newsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-news']);
      toast.success('News deleted successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete news');
    },
  });

  // Toggle featured mutation
  const toggleFeaturedMutation = useMutation({
    mutationFn: (id) => newsAPI.toggleFeatured(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-news']);
      toast.success('Featured status updated!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update featured status');
    },
  });

  const news = data?.data || [];
  const pagination = data?.meta?.pagination || {};

  const categoryOptions = [
    { value: 'announcement', label: 'Announcement' },
    { value: 'event', label: 'Event' },
    { value: 'research', label: 'Research' },
    { value: 'achievement', label: 'Achievement' },
    { value: 'general', label: 'General' },
  ];

  const handleOpenModal = (newsItem = null) => {
    if (newsItem) {
      setEditingNews(newsItem);
      setFormData({
        title: newsItem.title,
        excerpt: newsItem.excerpt,
        content: newsItem.content,
        category: newsItem.category,
        image: null,
        featured: newsItem.featured,
      });
      setImagePreview(getImageUrl(newsItem.image));
    } else {
      setEditingNews(null);
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        category: '',
        image: null,
        featured: false,
      });
      setImagePreview(null);
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingNews(null);
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      category: '',
      image: null,
      featured: false,
    });
    setImagePreview(null);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors((prev) => ({ ...prev, image: 'Please select an image file' }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, image: 'Image size should be less than 5MB' }));
        return;
      }

      setFormData((prev) => ({ ...prev, image: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      if (errors.image) {
        setErrors((prev) => ({ ...prev, image: '' }));
      }
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setImagePreview(editingNews?.image || null);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.excerpt.trim()) {
      newErrors.excerpt = 'Excerpt is required';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const submitData = new FormData();
    submitData.append('title', formData.title);
    // description is required by the backend schema — use excerpt as description
    submitData.append('description', formData.excerpt || formData.content.substring(0, 200));
    submitData.append('excerpt', formData.excerpt);
    submitData.append('content', formData.content);
    submitData.append('category', formData.category || 'general');
    submitData.append('featured', String(formData.featured));
    submitData.append('status', 'published');

    if (formData.image) {
      submitData.append('image', formData.image);
    }

    if (editingNews) {
      updateMutation.mutate({ id: editingNews.id || editingNews._id, data: submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this news article?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleToggleFeatured = (id) => {
    toggleFeaturedMutation.mutate(id);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const columns = [
    {
      header: 'Image',
      accessor: 'image',
      render: (row) => (
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
          {row.image ? (
            <img src={getImageUrl(row.image)} alt={row.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FiImage className="text-gray-400" size={24} />
            </div>
          )}
        </div>
      ),
    },
    {
      header: 'Title',
      accessor: 'title',
      render: (row) => (
        <div className="min-w-[200px]">
          <p className="font-medium text-gray-900 line-clamp-2">{row.title}</p>
          <p className="text-sm text-gray-500 mt-1">{formatDate(row.createdAt)}</p>
        </div>
      ),
    },
    {
      header: 'Category',
      accessor: 'category',
      render: (row) => (
        <Badge variant="primary" size="sm" className="capitalize">
          {row.category}
        </Badge>
      ),
    },
    {
      header: 'Status',
      accessor: 'featured',
      render: (row) => (
        <button
          onClick={() => handleToggleFeatured(row.id || row._id)}
          className={`flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-medium transition-colors ${
            row.featured
              ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <FiStar size={14} className={row.featured ? 'fill-current' : ''} />
          <span>{row.featured ? 'Featured' : 'Regular'}</span>
        </button>
      ),
    },
    {
      header: 'Actions',
      accessor: 'id',
      render: (row) => (
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleOpenModal(row)}
            icon={<FiEdit2 size={16} />}
          />
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleDelete(row.id || row._id)}
            icon={<FiTrash2 size={16} />}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">News Management</h2>
          <p className="text-gray-600 mt-1">Manage news articles and announcements</p>
        </div>
        <Button
          variant="primary"
          icon={<FiPlus size={20} />}
          onClick={() => handleOpenModal()}
        >
          Add News
        </Button>
      </div>

      {/* Search */}
      <Card>
        <Input
          placeholder="Search news..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          fullWidth
        />
      </Card>

      {/* Table */}
      <Card>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <Alert type="error" message="Failed to load news articles" />
        ) : news.length === 0 ? (
          <EmptyState
            icon={<FiFileText size={48} />}
            title="No news articles found"
            description={search ? 'Try adjusting your search' : 'Get started by creating a new news article'}
            action={
              <Button variant="primary" onClick={() => handleOpenModal()}>
                Add News
              </Button>
            }
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table columns={columns} data={news} />
            </div>

            {pagination.totalPages > 1 && (
              <div className="mt-6">
                <Pagination
                  currentPage={pagination.page || page}
                  totalPages={pagination.totalPages}
                  onPageChange={setPage}
                  itemsPerPage={pagination.limit || limit}
                  totalItems={pagination.total}
                />
              </div>
            )}
          </>
        )}
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingNews ? 'Edit News' : 'Add News'}
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              loading={createMutation.isPending || updateMutation.isPending}
            >
              {editingNews ? 'Update' : 'Create'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            required
            fullWidth
          />

          <Textarea
            label="Excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            error={errors.excerpt}
            rows={3}
            helperText="A short summary of the news article"
            required
            fullWidth
          />

          <Textarea
            label="Content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            error={errors.content}
            rows={6}
            required
            fullWidth
          />

          <Select
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            options={categoryOptions}
            error={errors.category}
            required
            fullWidth
          />

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Featured Image
            </label>
            
            {imagePreview ? (
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <FiX size={16} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FiImage size={40} className="text-gray-400 mb-3" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 5MB)</p>
                </div>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
            
            {errors.image && (
              <p className="mt-1.5 text-sm text-red-600">{errors.image}</p>
            )}
          </div>

          {/* Featured Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="featured"
              id="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="h-4 w-4 border-gray-300 rounded" style={{ accentColor: '#C79C78' }}
            />
            <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
              Mark as featured
            </label>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default NewsManagement;
