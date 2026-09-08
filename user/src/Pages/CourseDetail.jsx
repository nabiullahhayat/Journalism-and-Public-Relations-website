import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FiArrowLeft, FiBook, FiClock, FiUsers } from 'react-icons/fi';
import Layout from '../components/Layout';
import PageHero from '../components/PageHero';
import { Card, Spinner, Alert } from '../components/ui';
import { coursesAPI } from '../services/api';

const CourseDetail = () => {
  const { id } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ['course', id],
    queryFn: () => coursesAPI.getById(id),
    enabled: Boolean(id),
  });

  const course = data?.data;

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center py-24"><Spinner size="lg" /></div>
      </Layout>
    );
  }

  if (error || !course) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-4 py-24">
          <Alert type="error" message="Course not found" />
          <Link to="/courses" className="inline-flex items-center gap-2 mt-6 text-[#C79C78] font-semibold">
            <FiArrowLeft /> Back to course catalog
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHero
        title={course.name}
        subtitle={[course.code, course.level, course.department?.name].filter(Boolean).join(' · ')}
        breadcrumbs={[
          { label: 'Courses', href: '/courses' },
          { label: course.code || course.name },
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <Link to="/courses" className="inline-flex items-center gap-2 text-sm font-semibold text-[#C79C78] hover:text-[#a8784e] mb-8">
          <FiArrowLeft size={16} /> Back to course catalog
        </Link>

        <div className="space-y-6">
          <Card className="glass-panel-strong !p-0 overflow-hidden">
            <div className="h-2 bg-[#C79C78]" />
            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap gap-3 mb-6">
                {course.code && (
                  <span className="text-xs font-bold px-3 py-1 bg-[rgba(199,156,120,0.15)] text-[#C79C78] uppercase tracking-wide rounded-md">
                    {course.code}
                  </span>
                )}
                {course.level && (
                  <span className="text-xs font-semibold px-3 py-1 glass-panel text-slate-700 uppercase rounded-md">
                    {course.level}
                  </span>
                )}
                {course.credits && (
                  <span className="text-xs font-semibold px-3 py-1 glass-panel text-slate-700 rounded-md">
                    {course.credits} Credits
                  </span>
                )}
                {course.semester && (
                  <span className="text-xs font-semibold px-3 py-1 glass-panel text-slate-700 rounded-md">
                    Semester {course.semester}
                  </span>
                )}
              </div>

              {course.description && (
                <div className="mb-6">
                  <h2 className="font-serif text-xl font-bold text-slate-900 mb-3">Course Description</h2>
                  <p className="text-slate-700 leading-relaxed">{course.description}</p>
                </div>
              )}

              {course.details && (
                <div className="mb-6">
                  <h2 className="font-serif text-xl font-bold text-slate-900 mb-3">Details</h2>
                  <p className="text-slate-700 leading-relaxed whitespace-pre-line">{course.details}</p>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4 pt-6 border-t border-slate-200/80">
                {course.department && (
                  <Link
                    to={`/departments/${course.department.id || course.departmentId}`}
                    className="flex items-center gap-3 p-4 rounded-lg glass-panel hover:border-[#C79C78]/40 transition-colors"
                  >
                    <FiBook className="text-[#C79C78]" size={20} />
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide">Department</p>
                      <p className="font-medium text-slate-900">{course.department.name}</p>
                    </div>
                  </Link>
                )}
                {course.teacher && (
                  <Link
                    to={`/teachers/${course.teacher.id || course.teacherId}`}
                    className="flex items-center gap-3 p-4 rounded-lg glass-panel hover:border-[#C79C78]/40 transition-colors"
                  >
                    <FiUsers className="text-[#C79C78]" size={20} />
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide">Instructor</p>
                      <p className="font-medium text-slate-900">{course.teacher.name}</p>
                    </div>
                  </Link>
                )}
                {course.credits && (
                  <div className="flex items-center gap-3 p-4 rounded-lg glass-panel">
                    <FiClock className="text-[#C79C78]" size={20} />
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide">Credits</p>
                      <p className="font-medium text-slate-900">{course.credits}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default CourseDetail;
