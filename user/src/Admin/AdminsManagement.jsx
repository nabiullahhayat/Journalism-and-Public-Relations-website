import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import CrudManager, { getRowId } from './components/CrudManager';
import { Badge, Button } from '../components/ui';
import { adminsAPI, departmentsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const roleOptions = [
  { value: 'admin', label: 'Admin' },
  { value: 'editor', label: 'Editor' },
  { value: 'viewer', label: 'Viewer' },
  { value: 'superadmin', label: 'Super Admin' },
];

const AdminsManagement = () => {
  const { isSuperAdmin } = useAuth();
  const queryClient = useQueryClient();

  const { data: deptList } = useQuery({
    queryKey: ['departments-list-admin'],
    queryFn: () => departmentsAPI.getList(),
  });

  const departmentOptions = (deptList?.data || []).map((d) => ({
    value: d.id,
    label: d.name,
  }));

  if (!isSuperAdmin()) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-amber-800">
        Only super administrators can manage admin accounts.
      </div>
    );
  }

  return (
    <CrudManager
      title="Admins Management"
      subtitle="Manage admin users and roles"
      queryKey="admin-admins"
      fetchFn={(params) => adminsAPI.getAll(params)}
      createFn={(data) => adminsAPI.create(data)}
      updateFn={(id, data) => adminsAPI.update(id, data)}
      deleteFn={(id) => adminsAPI.delete(id)}
      addLabel="Add Admin"
      initialForm={{
        username: '',
        email: '',
        password: '',
        fullName: '',
        phone: '',
        role: 'admin',
        departmentId: '',
        isActive: true,
      }}
      mapItemToForm={(item) => ({
        username: item.username || '',
        email: item.email || '',
        password: '',
        fullName: item.fullName || '',
        phone: item.phone || '',
        role: item.role || 'admin',
        departmentId: item.departmentId || item.department?.id || '',
        isActive: item.isActive !== false,
      })}
      buildPayload={(form, editing) => {
        const payload = {
          username: form.username,
          email: form.email,
          fullName: form.fullName || undefined,
          phone: form.phone || undefined,
          role: form.role,
          departmentId: form.departmentId || null,
          isActive: form.isActive,
        };
        if (!editing && form.password) payload.password = form.password;
        return payload;
      }}
      formFields={[
        { name: 'username', label: 'Username', type: 'text', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true },
        { name: 'password', label: 'Password', type: 'password', required: true, showOn: 'create' },
        { name: 'fullName', label: 'Full Name', type: 'text' },
        { name: 'phone', label: 'Phone', type: 'text' },
        { name: 'role', label: 'Role', type: 'select', required: true, options: roleOptions },
        { name: 'departmentId', label: 'Department', type: 'select', options: departmentOptions },
        { name: 'isActive', label: 'Active account', type: 'checkbox' },
      ]}
      columns={[
        {
          header: 'User',
          accessor: 'username',
          render: (row) => (
            <div>
              <p className="font-medium text-gray-900">{row.fullName || row.username}</p>
              <p className="text-sm text-gray-500">{row.email}</p>
            </div>
          ),
        },
        {
          header: 'Role',
          accessor: 'role',
          render: (row) => <Badge variant="primary" className="capitalize">{row.role}</Badge>,
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
      extraRowActions={(row) => (
        <Button
          size="sm"
          variant="ghost"
          onClick={async () => {
            try {
              await adminsAPI.toggleStatus(getRowId(row));
              toast.success('Status updated');
              queryClient.invalidateQueries({ queryKey: ['admin-admins'] });
            } catch (err) {
              toast.error(err.message || 'Failed to update status');
            }
          }}
        >
          Toggle
        </Button>
      )}
      confirmDelete={(row) => window.confirm(`Delete admin "${row.username}"?`)}
    />
  );
};

export default AdminsManagement;
