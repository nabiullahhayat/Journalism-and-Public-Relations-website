import CrudManager from './components/CrudManager';
import { Badge } from '../components/ui';
import { departmentsAPI } from '../services/api';

const DepartmentsManagement = () => (
  <CrudManager
    title="Departments Management"
    subtitle="Manage faculty departments"
    queryKey="admin-departments"
    fetchFn={(params) => departmentsAPI.getAll(params)}
    createFn={(data) => departmentsAPI.create(data)}
    updateFn={(id, data) => departmentsAPI.update(id, data)}
    deleteFn={(id) => departmentsAPI.delete(id)}
    addLabel="Add Department"
    modalSize="xl"
    initialForm={{
      name: '',
      code: '',
      description: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      vision: '',
      mission: '',
      isActive: true,
    }}
    mapItemToForm={(item) => ({
      name: item.name || '',
      code: item.code || '',
      description: item.description || '',
      email: item.email || '',
      phone: item.phone || '',
      location: item.location || '',
      website: item.website || '',
      vision: item.vision || '',
      mission: item.mission || '',
      isActive: item.isActive !== false,
    })}
    buildPayload={(form) => ({
      name: form.name,
      code: form.code || null,
      description: form.description || null,
      email: form.email || null,
      phone: form.phone || null,
      location: form.location || null,
      website: form.website || null,
      vision: form.vision || null,
      mission: form.mission || null,
      isActive: Boolean(form.isActive),
    })}
    formFields={[
      { name: 'name', label: 'Department Name', type: 'text', required: true },
      { name: 'code', label: 'Code', type: 'text', placeholder: 'e.g. JRN' },
      { name: 'description', label: 'Description', type: 'textarea', rows: 3 },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'phone', label: 'Phone', type: 'text' },
      { name: 'location', label: 'Location', type: 'text' },
      { name: 'website', label: 'Website', type: 'text' },
      { name: 'vision', label: 'Vision', type: 'textarea', rows: 2 },
      { name: 'mission', label: 'Mission', type: 'textarea', rows: 2 },
      { name: 'isActive', label: 'Active department', type: 'checkbox' },
    ]}
    columns={[
      { header: 'Name', accessor: 'name', render: (row) => <span className="font-medium">{row.name}</span> },
      { header: 'Code', accessor: 'code', render: (row) => row.code || '-' },
      {
        header: 'Teachers',
        accessor: 'teacherCount',
        render: (row) => row.teacherCount ?? 0,
      },
      {
        header: 'Status',
        accessor: 'isActive',
        render: (row) => (
          <Badge variant={row.isActive ? 'success' : 'danger'}>
            {row.isActive ? 'Active' : 'Inactive'}
          </Badge>
        ),
      },
    ]}
    confirmDelete={(row) => window.confirm(`Delete department "${row.name}"?`)}
  />
);

export default DepartmentsManagement;
