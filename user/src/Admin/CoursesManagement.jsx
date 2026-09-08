import { useQuery } from '@tanstack/react-query';
import CrudManager from './components/CrudManager';
import { Badge } from '../components/ui';
import { coursesAPI, departmentsAPI, teachersAPI } from '../services/api';

const levelOptions = [
  { value: 'bachelor', label: 'Bachelor' },
  { value: 'master', label: 'Master' },
  { value: 'phd', label: 'PhD' },
];

const typeOptions = [
  { value: 'required', label: 'Required' },
  { value: 'elective', label: 'Elective' },
];

const CoursesManagement = () => {
  const { data: deptList } = useQuery({
    queryKey: ['departments-list-courses'],
    queryFn: () => departmentsAPI.getList(),
  });

  const { data: teachersList } = useQuery({
    queryKey: ['teachers-list-courses'],
    queryFn: () => teachersAPI.getAll({ limit: 100 }),
  });

  const departmentOptions = (deptList?.data || []).map((d) => ({ value: d.id, label: d.name }));
  const teacherOptions = (teachersList?.data || []).map((t) => ({ value: t.id, label: t.name }));

  return (
    <CrudManager
      title="Courses Management"
      subtitle="Manage academic courses"
      queryKey="admin-courses"
      fetchFn={(params) => coursesAPI.getAll(params)}
      createFn={(data) => coursesAPI.create(data)}
      updateFn={(id, data) => coursesAPI.update(id, data)}
      deleteFn={(id) => coursesAPI.delete(id)}
      addLabel="Add Course"
      modalSize="xl"
      initialForm={{
        name: '',
        code: '',
        description: '',
        details: '',
        level: '',
        semester: '',
        credits: '',
        type: '',
        departmentId: '',
        teacherId: '',
        time: '',
        isActive: true,
      }}
      mapItemToForm={(item) => ({
        name: item.name || '',
        code: item.code || '',
        description: item.description || '',
        details: item.details || '',
        level: item.level || '',
        semester: item.semester ?? '',
        credits: item.credits ?? '',
        type: item.type || '',
        departmentId: item.departmentId || item.department?.id || '',
        teacherId: item.teacherId || item.teacher?.id || '',
        time: item.time ?? '',
        isActive: item.isActive !== false,
      })}
      buildPayload={(form) => ({
        name: form.name,
        code: form.code || null,
        description: form.description || null,
        details: form.details || null,
        level: form.level || null,
        semester: form.semester ? parseInt(form.semester, 10) : null,
        credits: form.credits ? parseInt(form.credits, 10) : null,
        type: form.type || null,
        departmentId: form.departmentId || null,
        teacherId: form.teacherId || null,
        time: form.time ? parseInt(form.time, 10) : null,
        isActive: Boolean(form.isActive),
      })}
      formFields={[
        { name: 'name', label: 'Course Name', type: 'text', required: true },
        { name: 'code', label: 'Course Code', type: 'text', placeholder: 'e.g. JRN101' },
        { name: 'description', label: 'Description', type: 'textarea', rows: 2 },
        { name: 'details', label: 'Details', type: 'textarea', rows: 3 },
        { name: 'level', label: 'Level', type: 'select', options: levelOptions },
        { name: 'semester', label: 'Semester', type: 'number' },
        { name: 'credits', label: 'Credits', type: 'number' },
        { name: 'type', label: 'Type', type: 'select', options: typeOptions },
        { name: 'departmentId', label: 'Department', type: 'select', options: departmentOptions },
        { name: 'teacherId', label: 'Instructor', type: 'select', options: teacherOptions },
        { name: 'time', label: 'Duration (hours)', type: 'number' },
        { name: 'isActive', label: 'Active course', type: 'checkbox' },
      ]}
      columns={[
        { header: 'Course', accessor: 'name', render: (row) => (
          <div>
            <p className="font-medium">{row.name}</p>
            <p className="text-sm text-gray-500">{row.code || 'No code'}</p>
          </div>
        )},
        { header: 'Department', accessor: 'department', render: (row) => row.department?.name || '-' },
        { header: 'Instructor', accessor: 'teacher', render: (row) => row.teacher?.name || '-' },
        { header: 'Level', accessor: 'level', render: (row) => row.level ? <Badge className="capitalize">{row.level}</Badge> : '-' },
        { header: 'Status', accessor: 'isActive', render: (row) => (
          <Badge variant={row.isActive ? 'success' : 'danger'}>{row.isActive ? 'Active' : 'Inactive'}</Badge>
        )},
      ]}
      confirmDelete={(row) => window.confirm(`Delete course "${row.name}"?`)}
    />
  );
};

export default CoursesManagement;
