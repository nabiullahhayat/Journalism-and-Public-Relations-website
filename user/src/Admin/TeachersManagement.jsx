import { useQuery } from '@tanstack/react-query';
import CrudManager from './components/CrudManager';
import { Badge } from '../components/ui';
import { teachersAPI, departmentsAPI } from '../services/api';
import { getImageUrl } from '../utils/image';

const TeachersManagement = () => {
  const { data: deptList } = useQuery({
    queryKey: ['departments-list-teachers'],
    queryFn: () => departmentsAPI.getList(),
  });

  const departmentOptions = (deptList?.data || []).map((d) => ({ value: d.id, label: d.name }));

  const buildTeacherPayload = (form) => {
    const fd = new FormData();
    const fields = [
      'name', 'phone', 'email', 'city', 'schoolName', 'bachelorUniversity',
      'masterCountry', 'masterUniversity', 'masterThesis', 'phdCountry', 'phdUniversity', 'phdThesis',
      'bio', 'whatsapp',
    ];
    fields.forEach((f) => { if (form[f]) fd.append(f, form[f]); });

    ['schoolGraduationYear', 'bachelorGraduationYear', 'masterGraduationYear', 'phdGraduationYear'].forEach((f) => {
      if (form[f]) fd.append(f, String(form[f]));
    });

    if (form.departmentId) fd.append('departmentId', form.departmentId);
    fd.append('isActive', String(Boolean(form.isActive)));
    if (form.profileImage instanceof File) fd.append('image', form.profileImage);

    return fd;
  };

  return (
    <CrudManager
      title="Teachers Management"
      subtitle="Manage faculty members"
      queryKey="admin-teachers"
      fetchFn={(params) => teachersAPI.getAll(params)}
      createFn={(data) => teachersAPI.create(data)}
      updateFn={(id, data) => teachersAPI.update(id, data)}
      deleteFn={(id) => teachersAPI.delete(id)}
      addLabel="Add Teacher"
      modalSize="xl"
      initialForm={{
        name: '',
        email: '',
        phone: '',
        whatsapp: '',
        city: '',
        schoolName: '',
        schoolGraduationYear: '',
        bachelorUniversity: '',
        bachelorGraduationYear: '',
        masterCountry: '',
        masterUniversity: '',
        masterGraduationYear: '',
        phdCountry: '',
        phdUniversity: '',
        phdGraduationYear: '',
        bio: '',
        departmentId: '',
        profileImage: null,
        isActive: true,
      }}
      mapItemToForm={(item) => ({
        name: item.name || '',
        email: item.email || '',
        phone: item.phone || '',
        whatsapp: item.whatsapp || '',
        city: item.city || '',
        schoolName: item.schoolName || '',
        schoolGraduationYear: item.schoolGraduationYear ?? '',
        bachelorUniversity: item.bachelorUniversity || '',
        bachelorGraduationYear: item.bachelorGraduationYear ?? '',
        masterCountry: item.masterCountry || '',
        masterUniversity: item.masterUniversity || '',
        masterGraduationYear: item.masterGraduationYear ?? '',
        phdCountry: item.phdCountry || '',
        phdUniversity: item.phdUniversity || '',
        phdGraduationYear: item.phdGraduationYear ?? '',
        bio: item.bio || '',
        departmentId: item.departmentId || item.department?.id || '',
        profileImage: null,
        isActive: item.isActive !== false,
      })}
      buildPayload={buildTeacherPayload}
      formFields={[
        { name: 'name', label: 'Full Name', type: 'text', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true },
        { name: 'phone', label: 'Phone', type: 'text', required: true },
        { name: 'whatsapp', label: 'WhatsApp', type: 'text' },
        { name: 'city', label: 'City', type: 'text', required: true },
        { name: 'departmentId', label: 'Department', type: 'select', options: departmentOptions },
        { name: 'schoolName', label: 'School Name', type: 'text', required: true },
        { name: 'schoolGraduationYear', label: 'School Graduation Year', type: 'number', required: true },
        { name: 'bachelorUniversity', label: 'Bachelor University', type: 'text', required: true },
        { name: 'bachelorGraduationYear', label: 'Bachelor Graduation Year', type: 'number', required: true },
        { name: 'masterUniversity', label: 'Master University', type: 'text' },
        { name: 'masterCountry', label: 'Master Country', type: 'text' },
        { name: 'masterGraduationYear', label: 'Master Graduation Year', type: 'number' },
        { name: 'phdUniversity', label: 'PhD University', type: 'text' },
        { name: 'phdCountry', label: 'PhD Country', type: 'text' },
        { name: 'phdGraduationYear', label: 'PhD Graduation Year', type: 'number' },
        { name: 'bio', label: 'Bio', type: 'textarea', rows: 3 },
        { name: 'profileImage', label: 'Profile Photo', type: 'file', accept: 'image/*' },
        { name: 'isActive', label: 'Active teacher', type: 'checkbox' },
      ]}
      columns={[
        {
          header: 'Teacher',
          accessor: 'name',
          render: (row) => (
            <div className="flex items-center gap-3">
              {row.profileImage ? (
                <img src={getImageUrl(row.profileImage)} alt={row.name} className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200" />
              )}
              <div>
                <p className="font-medium">{row.name}</p>
                <p className="text-sm text-gray-500">{row.email}</p>
              </div>
            </div>
          ),
        },
        { header: 'Department', accessor: 'department', render: (row) => row.department?.name || '-' },
        { header: 'City', accessor: 'city' },
        { header: 'Status', accessor: 'isActive', render: (row) => (
          <Badge variant={row.isActive ? 'success' : 'danger'}>{row.isActive ? 'Active' : 'Inactive'}</Badge>
        )},
      ]}
      confirmDelete={(row) => window.confirm(`Delete teacher "${row.name}"?`)}
    />
  );
};

export default TeachersManagement;
