import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FiArrowLeft, FiMail, FiPhone, FiMapPin, FiUsers, FiBook } from 'react-icons/fi';
import Layout from '../components/Layout';
import PageHero from '../components/PageHero';
import TeacherAvatar from '../components/TeacherAvatar';
import { Card, Spinner, Alert } from '../components/ui';
import { departmentsAPI } from '../services/api';

const DepartmentDetail = () => {
  const { id } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ['department', id],
    queryFn: () => departmentsAPI.getById(id),
    enabled: Boolean(id),
  });

  const dept = data?.data;

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center py-24"><Spinner size="lg" /></div>
      </Layout>
    );
  }

  if (error || !dept) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-4 py-24">
          <Alert type="error" message="Department not found" />
          <Link to="/departments" className="inline-flex items-center gap-2 mt-6 text-[#C79C78] font-semibold">
            <FiArrowLeft /> Back to departments
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHero
        title={dept.name}
        subtitle={dept.code ? `Department Code: ${dept.code}` : dept.description?.slice(0, 120)}
        breadcrumbs={[
          { label: 'Departments', href: '/departments' },
          { label: dept.name },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <Link to="/departments" className="inline-flex items-center gap-2 text-sm font-semibold text-[#C79C78] hover:text-[#a8784e] mb-8">
          <FiArrowLeft size={16} /> Back to departments
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {dept.description && (
              <Card className="glass-panel !p-0 overflow-hidden">
                <div className="h-1.5 bg-[#C79C78]" />
                <div className="p-6 sm:p-8">
                  <h2 className="font-serif text-xl font-bold text-slate-900 mb-4">About the Department</h2>
                  <p className="text-slate-700 leading-relaxed">{dept.description}</p>
                </div>
              </Card>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              {dept.mission && (
                <Card className="glass-panel border-t-4 border-t-[#C79C78]">
                  <h3 className="font-serif font-bold text-slate-900 mb-2">Mission</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{dept.mission}</p>
                </Card>
              )}
              {dept.vision && (
                <Card className="glass-panel border-t-4 border-t-slate-400">
                  <h3 className="font-serif font-bold text-slate-900 mb-2">Vision</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{dept.vision}</p>
                </Card>
              )}
            </div>

            {Array.isArray(dept.objectives) && dept.objectives.length > 0 && (
              <Card className="glass-panel">
                <h3 className="font-serif font-bold text-slate-900 mb-4">Objectives</h3>
                <ul className="space-y-2">
                  {dept.objectives.map((obj, i) => (
                    <li key={i} className="flex gap-3 text-sm text-slate-700">
                      <span className="text-[#C79C78] font-bold">•</span>{obj}
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {Array.isArray(dept.teachers) && dept.teachers.length > 0 && (
              <Card className="glass-panel !p-0 overflow-hidden">
                <div className="h-1.5 bg-[#C79C78]" />
                <div className="p-6 sm:p-8">
                  <h3 className="font-serif text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <FiUsers className="text-[#C79C78]" /> Faculty Members
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {dept.teachers.map((teacher) => (
                      <Link
                        key={teacher.id}
                        to={`/teachers/${teacher.id}`}
                        className="flex items-center gap-3 p-4 rounded-lg glass-panel hover:border-[#C79C78]/40 transition-colors"
                      >
                        <TeacherAvatar teacher={teacher} name={teacher.name} size="sm" />
                        <div>
                          <p className="font-medium text-slate-900">{teacher.name}</p>
                          <p className="text-xs text-slate-500">{teacher.email}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card className="glass-panel-strong !p-0 overflow-hidden sticky top-28">
              <div className="h-2 bg-[#C79C78]" />
              <div className="p-6 space-y-5">
                <h3 className="font-serif font-bold text-slate-900">Contact & Info</h3>
                {dept.head && (
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Department Head</p>
                    <Link to={`/teachers/${dept.head.id}`} className="text-sm font-medium text-[#C79C78] hover:underline">
                      {dept.head.name}
                    </Link>
                  </div>
                )}
                {dept.email && (
                  <div className="flex items-start gap-2 text-sm text-slate-700">
                    <FiMail className="text-[#C79C78] mt-0.5 shrink-0" />
                    <a href={`mailto:${dept.email}`} className="hover:text-[#C79C78]">{dept.email}</a>
                  </div>
                )}
                {dept.phone && (
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <FiPhone className="text-[#C79C78] shrink-0" />{dept.phone}
                  </div>
                )}
                {dept.location && (
                  <div className="flex items-start gap-2 text-sm text-slate-700">
                    <FiMapPin className="text-[#C79C78] mt-0.5 shrink-0" />{dept.location}
                  </div>
                )}
                {dept.teacherCount > 0 && (
                  <div className="flex items-center gap-2 text-sm text-slate-700 pt-2 border-t border-slate-200/80">
                    <FiBook className="text-[#C79C78] shrink-0" />{dept.teacherCount} faculty members
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DepartmentDetail;
