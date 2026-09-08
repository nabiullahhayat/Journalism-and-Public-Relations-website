import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import {
  Card,
  Button,
  Input,
  Textarea,
  Select,
  Modal,
  Table,
  Pagination,
  Spinner,
  EmptyState,
  Alert,
} from '../../components/ui';

const getRowId = (row) => row?.id || row?._id;

const CrudManager = ({
  title,
  subtitle,
  queryKey,
  fetchFn,
  createFn,
  updateFn,
  deleteFn,
  columns,
  formFields = [],
  initialForm = {},
  mapItemToForm,
  buildPayload,
  modalSize = 'lg',
  addLabel = 'Add New',
  emptyTitle = 'No records found',
  emptyDescription = 'Create your first record to get started.',
  confirmDelete = (item) => window.confirm('Are you sure you want to delete this record?'),
  hideAdd = false,
  hideEdit = false,
  hideDelete = false,
  extraRowActions,
}) => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const limit = 10;

  const { data, isLoading, error } = useQuery({
    queryKey: [queryKey, page, search],
    queryFn: () => fetchFn({ page, limit, search }),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: [queryKey] });

  const getErrorMessage = (err, fallback) => {
    const fieldErrors = err?.data?.errors;
    if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
      return fieldErrors.map((e) => e.message).join(', ');
    }
    return err?.message || fallback;
  };

  const createMutation = useMutation({
    mutationFn: createFn,
    onSuccess: () => {
      invalidate();
      toast.success('Created successfully');
      handleCloseModal();
    },
    onError: (err) => toast.error(getErrorMessage(err, 'Failed to create')),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateFn(id, payload),
    onSuccess: () => {
      invalidate();
      toast.success('Updated successfully');
      handleCloseModal();
    },
    onError: (err) => toast.error(getErrorMessage(err, 'Failed to update')),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFn,
    onSuccess: () => {
      invalidate();
      toast.success('Deleted successfully');
    },
    onError: (err) => toast.error(getErrorMessage(err, 'Failed to delete')),
  });

  const items = Array.isArray(data?.data) ? data.data : [];
  const pagination = data?.meta?.pagination || {};

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData(mapItemToForm ? mapItemToForm(item) : { ...initialForm, ...item });
    } else {
      setEditingItem(null);
      setFormData(initialForm);
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData(initialForm);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files?.[0] || null : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const nextErrors = {};
    formFields.forEach((field) => {
      if (!field.required) return;
      if (field.showOn === 'create' && editingItem) return;
      if (field.showOn === 'edit' && !editingItem) return;
      const value = formData[field.name];
      if (field.type === 'checkbox') return;
      if (value === undefined || value === null || String(value).trim() === '') {
        nextErrors[field.name] = `${field.label} is required`;
      }
    });
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const payload = buildPayload ? buildPayload(formData, editingItem) : formData;
    if (editingItem) {
      updateMutation.mutate({ id: getRowId(editingItem), payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = (item) => {
    if (!confirmDelete(item)) return;
    deleteMutation.mutate(getRowId(item));
  };

  const actionColumn = {
    header: 'Actions',
    accessor: 'actions',
    render: (row) => (
      <div className="flex items-center space-x-2">
        {extraRowActions?.(row, { handleOpenModal, handleDelete })}
        {!hideEdit && (
          <Button size="sm" variant="ghost" onClick={() => handleOpenModal(row)} icon={<FiEdit2 size={16} />} />
        )}
        {!hideDelete && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleDelete(row)}
            icon={<FiTrash2 size={16} />}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          />
        )}
      </div>
    ),
  };

  const tableColumns = [...columns, ...(hideEdit && hideDelete && !extraRowActions ? [] : [actionColumn])];

  const renderField = (field) => {
    if (field.showOn === 'create' && editingItem) return null;
    if (field.showOn === 'edit' && !editingItem) return null;

    const common = {
      name: field.name,
      label: field.label,
      value: formData[field.name] ?? '',
      onChange: handleChange,
      error: errors[field.name],
      required: field.required,
      fullWidth: true,
      placeholder: field.placeholder,
      disabled: field.disabled,
    };

    if (field.type === 'textarea') {
      return <Textarea key={field.name} {...common} rows={field.rows || 3} helperText={field.helperText} />;
    }
    if (field.type === 'select') {
      return (
        <Select
          key={field.name}
          {...common}
          options={field.options || []}
          placeholder={field.placeholder || 'Select an option'}
        />
      );
    }
    if (field.type === 'checkbox') {
      return (
        <div key={field.name} className="flex items-center">
          <input
            type="checkbox"
            name={field.name}
            id={field.name}
            checked={Boolean(formData[field.name])}
            onChange={handleChange}
            className="h-4 w-4 border-gray-300 rounded"
            style={{ accentColor: '#C79C78' }}
          />
          <label htmlFor={field.name} className="ml-2 text-sm text-gray-700">{field.label}</label>
        </div>
      );
    }
    if (field.type === 'file') {
      return (
        <div key={field.name}>
          <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
          <input type="file" name={field.name} accept={field.accept || '*'} onChange={handleChange} className="block w-full text-sm" />
          {errors[field.name] && <p className="mt-1 text-sm text-red-600">{errors[field.name]}</p>}
        </div>
      );
    }

    return (
      <Input
        key={field.name}
        {...common}
        type={field.type || 'text'}
        helperText={field.helperText}
      />
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
        </div>
        {!hideAdd && (
          <Button variant="primary" icon={<FiPlus size={20} />} onClick={() => handleOpenModal()}>
            {addLabel}
          </Button>
        )}
      </div>

      <Card>
        <Input
          placeholder={`Search ${title.toLowerCase()}...`}
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          fullWidth
        />
      </Card>

      <Card>
        {isLoading ? (
          <div className="flex justify-center py-12"><Spinner size="lg" /></div>
        ) : error ? (
          <Alert type="error" message={`Failed to load ${title.toLowerCase()}`} />
        ) : items.length === 0 ? (
          <EmptyState
            title={emptyTitle}
            description={search ? 'Try adjusting your search' : emptyDescription}
            action={!hideAdd && <Button variant="primary" onClick={() => handleOpenModal()}>{addLabel}</Button>}
          />
        ) : (
          <>
            <Table columns={tableColumns} data={items} />
            {pagination.totalPages > 1 && (
              <div className="mt-6">
                <Pagination
                  currentPage={pagination.page || page}
                  totalPages={pagination.totalPages}
                  onPageChange={setPage}
                  itemsPerPage={pagination.limit || limit}
                  totalItems={pagination.total || items.length}
                />
              </div>
            )}
          </>
        )}
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingItem ? `Edit ${title.replace(/ Management$/, '')}` : addLabel}
        size={modalSize}
        footer={
          <>
            <Button variant="ghost" onClick={handleCloseModal}>Cancel</Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              loading={createMutation.isPending || updateMutation.isPending}
            >
              {editingItem ? 'Update' : 'Create'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formFields.map(renderField)}
        </form>
      </Modal>
    </div>
  );
};

export default CrudManager;
export { getRowId };
