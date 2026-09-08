import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FiBook, FiClock, FiArrowRight } from 'react-icons/fi';
import Layout from '../components/Layout';
import PageHero from '../components/PageHero';
import FilterBar from '../components/FilterBar';
import { Card, Spinner, Alert, EmptyState, Input, Select } from '../components/ui';
import { coursesAPI, departmentsAPI } from '../services/api';

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');

  const { data: coursesData, isLoading, error } = useQuery({
    queryKey: ['courses'],
    queryFn: () => coursesAPI.getAll({ limit: 100 }),
  });

  const { data: departmentsData } = useQuery({
    queryKey: ['departments-list'],
    queryFn: () => departmentsAPI.getList(),
  });

  const courses = coursesData?.data || [];
  const departments = departmentsData?.data || [];

  const filteredCourses = (Array.isArray(courses) ? courses : []).filter((course) => {
    const matchesSearch =
      course.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      !selectedDepartment ||
      course.department?.id === selectedDepartment ||
      course.departmentId === selectedDepartment;
    const matchesLevel = !selectedLevel || course.level === selectedLevel;
    return matchesSearch && matchesDepartment && matchesLevel;
  });

  const levelOptions = [
    { value: 'bachelor', label: 'Bachelor' },
    { value: 'master', label: 'Master' },
    { value: 'phd', label: 'PhD' },
  ];

  const departmentOptions = (Array.isArray(departments) ? departments : []).map((d) => ({
    value: d.id,
    label: d.name,
  }));

  return (
    <Layout>
      <PageHero
        title="Course Catalog"
        subtitle="Browse our comprehensive curriculum in journalism and public relations."
        breadcrumbs={[{ label: 'Courses' }]}
      />

      <FilterBar>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input placeholder="Search courses..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} fullWidth />
          <Select placeholder="All Departments" options={departmentOptions} value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)} fullWidth />
          <Select placeholder="All Levels" options={levelOptions} value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)} fullWidth />
        </div>
      </FilterBar>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {isLoading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : error ? (
          <Alert type="error" message="Failed to load courses" />
        ) : filteredCourses.length === 0 ? (
          <EmptyState icon={<FiBook size={48} />} title="No courses found" description="Try adjusting your filters" />
        ) : (
          <div className="space-y-4">
            {filteredCourses.map((course) => (
              <Card key={course.id || course._id} hover className="!p-0 overflow-hidden group">
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-2 bg-[#C79C78] shrink-0" />
                  <div className="p-6 flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <Link to={`/courses/${course.id}`} className="hover:text-[#a8784e]">
                            <h3 className="font-serif text-xl font-bold text-slate-900">{course.name}</h3>
                          </Link>
                          {course.code && (
                            <span className="text-xs font-bold px-2 py-1 bg-[rgba(199,156,120,0.12)] text-[#C79C78] uppercase tracking-wide">
                              {course.code}
                            </span>
                          )}
                        </div>
                        {course.description && <p className="text-slate-600 text-sm">{course.description}</p>}
                      </div>
                      {course.level && (
                        <span className="text-xs font-semibold px-3 py-1 border border-slate-200 text-slate-700 uppercase self-start">
                          {course.level}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                      {course.department && (
                        <span className="flex items-center gap-2"><FiBook size={16} className="text-slate-400" />{course.department.name}</span>
                      )}
                      {course.credits && (
                        <span className="flex items-center gap-2"><FiClock size={16} className="text-slate-400" />{course.credits} Credits</span>
                      )}
                      {course.semester && <span>Semester {course.semester}</span>}
                      {course.teacher && (
                        <span>
                          Instructor:{' '}
                          <Link to={`/teachers/${course.teacher.id || course.teacherId}`} className="text-[#C79C78] hover:underline">
                            {course.teacher.name}
                          </Link>
                        </span>
                      )}
                    </div>
                    <Link
                      to={`/courses/${course.id}`}
                      className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#C79C78] hover:text-[#a8784e]"
                    >
                      View course <FiArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Courses;
