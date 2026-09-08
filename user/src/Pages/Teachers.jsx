import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FiMail, FiPhone, FiUsers, FiAward, FiArrowRight } from 'react-icons/fi';
import Layout from '../components/Layout';
import PageHero from '../components/PageHero';
import FilterBar from '../components/FilterBar';
import TeacherAvatar from '../components/TeacherAvatar';
import { Card, Spinner, Alert, EmptyState, Input, Select } from '../components/ui';
import { teachersAPI, departmentsAPI } from '../services/api';

const Teachers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');

  const { data: teachersData, isLoading, error } = useQuery({
    queryKey: ['teachers'],
    queryFn: () => teachersAPI.getAll({ limit: 100 }),
  });

  const { data: departmentsData } = useQuery({
    queryKey: ['departments-list'],
    queryFn: () => departmentsAPI.getList(),
  });

  const teachers = teachersData?.data || [];
  const departments = departmentsData?.data || [];

  const filteredTeachers = (Array.isArray(teachers) ? teachers : []).filter((teacher) => {
    const matchesSearch =
      teacher.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.academicRank?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.position?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      !selectedDepartment ||
      teacher.department?.id === selectedDepartment ||
      teacher.departmentId === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const departmentOptions = (Array.isArray(departments) ? departments : []).map((d) => ({
    value: d.id,
    label: d.name,
  }));

  return (
    <Layout>
      <PageHero
        title="Faculty Directory"
        subtitle="Meet the educators and researchers shaping the next generation of journalists."
        breadcrumbs={[{ label: 'Faculty' }]}
      />

      <FilterBar>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
          <Input placeholder="Search by name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} fullWidth />
          <Select placeholder="All Departments" options={departmentOptions} value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)} fullWidth />
        </div>
      </FilterBar>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {isLoading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : error ? (
          <Alert type="error" message="Failed to load faculty members" />
        ) : filteredTeachers.length === 0 ? (
          <EmptyState icon={<FiUsers size={48} />} title="No faculty found" description="Try adjusting your search or filters" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTeachers.map((teacher) => (
              <Card key={teacher.id || teacher._id} hover className="flex flex-col h-full !p-0 overflow-hidden group">
                <div className="h-2 bg-[#C79C78]" />
                <div className="p-6 flex flex-col items-center text-center flex-1">
                  <Link to={`/teachers/${teacher.id}`} className="block mb-4">
                    <TeacherAvatar teacher={teacher} size="md" className="group-hover:ring-[#C79C78] transition-all" />
                  </Link>
                  <Link to={`/teachers/${teacher.id}`} className="hover:text-[#a8784e] transition-colors">
                    <h3 className="font-serif text-lg font-bold text-slate-900">{teacher.name}</h3>
                  </Link>
                  <p className="text-sm font-medium text-[#C79C78] mt-1">
                    {teacher.academicRank?.name || teacher.position || 'Faculty Member'}
                  </p>
                  {teacher.department && <p className="text-xs text-slate-500 mt-1">{teacher.department.name}</p>}
                  {teacher.bio && <p className="text-sm text-slate-600 mt-3 line-clamp-3">{teacher.bio}</p>}
                  <div className="space-y-2 text-xs text-slate-600 pt-4 border-t border-slate-100 w-full mt-4">
                    {teacher.email && (
                      <a href={`mailto:${teacher.email}`} className="flex items-center justify-center gap-2 text-[#C79C78] hover:underline">
                        <FiMail size={14} /> Email
                      </a>
                    )}
                    {teacher.phone && (
                      <div className="flex items-center justify-center gap-2">
                        <FiPhone size={14} /> {teacher.phone}
                      </div>
                    )}
                    {teacher.researchPapers?.length > 0 && (
                      <div className="flex items-center justify-center gap-2">
                        <FiAward size={14} /> {teacher.researchPapers.length} Publications
                      </div>
                    )}
                  </div>
                  <Link
                    to={`/teachers/${teacher.id}`}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#C79C78] hover:text-[#a8784e]"
                  >
                    View profile <FiArrowRight size={14} />
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Teachers;
