import { useQuery } from '@tanstack/react-query';
import CrudManager from './components/CrudManager';
import { Badge } from '../components/ui';
import { monographsAPI, departmentsAPI } from '../services/api';

const degreeOptions = [
  { value: 'bachelor', label: 'Bachelor' },
  { value: 'master', label: 'Master' },
  { value: 'phd', label: 'PhD' },
];

const gradeOptions = [
  { value: 'A', label: 'A' },
  { value: 'B', label: 'B' },
  { value: 'C', label: 'C' },
  { value: 'D', label: 'D' },
  { value: 'F', label: 'F' },
];

const MonographsManagement = () => {
  const { data: deptList } = useQuery({
    queryKey: ['departments-list-monographs'],
    queryFn: () => departmentsAPI.getList(),
  });

  const departmentOptions = (deptList?.data || []).map((d) => ({ value: d.id, label: d.name }));

  return (
    <CrudManager
      title="Monographs Management"
      subtitle="Manage student research monographs"
      queryKey="admin-monographs"
      fetchFn={(params) => monographsAPI.getAll(params)}
      createFn={(data) => monographsAPI.create(data)}
      updateFn={(id, data) => monographsAPI.update(id, data)}
      deleteFn={(id) => monographsAPI.delete(id)}
      addLabel="Add Monograph"
      modalSize="xl"
      initialForm={{
        studentName: '',
        supervisor: '',
        year: new Date().getFullYear(),
        issue: '',
        title: '',
        abstract: '',
        documentUrl: '',
        pages: '',
        grade: '',
        degree: '',
        departmentId: '',
        isPublished: true,
      }}
      mapItemToForm={(item) => ({
        studentName: item.studentName || '',
        supervisor: item.supervisor || '',
        year: item.year ?? new Date().getFullYear(),
        issue: item.issue || '',
        title: item.title || '',
        abstract: item.abstract || '',
        documentUrl: item.documentUrl || '',
        pages: item.pages ?? '',
        grade: item.grade || '',
        degree: item.degree || '',
        departmentId: item.departmentId || item.department?.id || '',
        isPublished: item.isPublished !== false,
      })}
      buildPayload={(form) => ({
        studentName: form.studentName,
        supervisor: form.supervisor,
        year: parseInt(form.year, 10),
        issue: form.issue,
        title: form.title || null,
        abstract: form.abstract || null,
        documentUrl: form.documentUrl || null,
        pages: form.pages ? parseInt(form.pages, 10) : null,
        grade: form.grade || null,
        degree: form.degree || null,
        departmentId: form.departmentId || null,
        isPublished: Boolean(form.isPublished),
      })}
      formFields={[
        { name: 'studentName', label: 'Student Name', type: 'text', required: true },
        { name: 'supervisor', label: 'Supervisor', type: 'text', required: true },
        { name: 'year', label: 'Year', type: 'number', required: true },
        { name: 'issue', label: 'Issue / Topic', type: 'textarea', rows: 2, required: true },
        { name: 'title', label: 'Title', type: 'text' },
        { name: 'abstract', label: 'Abstract', type: 'textarea', rows: 3 },
        { name: 'departmentId', label: 'Department', type: 'select', options: departmentOptions },
        { name: 'degree', label: 'Degree', type: 'select', options: degreeOptions },
        { name: 'grade', label: 'Grade', type: 'select', options: gradeOptions },
        { name: 'pages', label: 'Pages', type: 'number' },
        { name: 'documentUrl', label: 'Document URL', type: 'text' },
        { name: 'isPublished', label: 'Published', type: 'checkbox' },
      ]}
      columns={[
        { header: 'Student', accessor: 'studentName', render: (row) => (
          <div>
            <p className="font-medium">{row.studentName}</p>
            <p className="text-sm text-gray-500 line-clamp-1">{row.title || row.issue}</p>
          </div>
        )},
        { header: 'Supervisor', accessor: 'supervisor' },
        { header: 'Year', accessor: 'year' },
        { header: 'Department', accessor: 'department', render: (row) => row.department?.name || '-' },
        { header: 'Status', accessor: 'isPublished', render: (row) => (
          <Badge variant={row.isPublished ? 'success' : 'warning'}>{row.isPublished ? 'Published' : 'Draft'}</Badge>
        )},
      ]}
      confirmDelete={(row) => window.confirm(`Delete monograph by "${row.studentName}"?`)}
    />
  );
};

export default MonographsManagement;
