import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  FiArrowLeft, FiMail, FiPhone, FiBook, FiAward, FiMapPin, FiMessageCircle, FiArrowRight,
} from 'react-icons/fi';
import Layout from '../components/Layout';
import PageHero from '../components/PageHero';
import TeacherAvatar from '../components/TeacherAvatar';
import { Card, Spinner, Alert } from '../components/ui';
import { teachersAPI, coursesAPI } from '../services/api';

const InfoBlock = ({ label, children }) => (
  <div>
    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">{label}</p>
    <div className="text-sm text-slate-700">{children}</div>
  </div>
);

const TeacherProfile = () => {
  const { id } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ['teacher', id],
    queryFn: () => teachersAPI.getById(id),
    enabled: Boolean(id),
  });

  const { data: coursesData } = useQuery({
    queryKey: ['teacher-courses', id],
    queryFn: () => coursesAPI.getAll({ limit: 100 }),
    enabled: Boolean(id),
  });

  const teacher = data?.data;
  const courses = (coursesData?.data || []).filter(
    (c) => c.teacherId === id || c.teacher?.id === id
  );

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center py-24"><Spinner size="lg" /></div>
      </Layout>
    );
  }

  if (error || !teacher) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-4 py-24">
          <Alert type="error" message="Faculty member not found" />
          <Link to="/teachers" className="inline-flex items-center gap-2 mt-6 text-[#C79C78] font-semibold">
            <FiArrowLeft /> Back to faculty directory
          </Link>
        </div>
      </Layout>
    );
  }

  const rank = teacher.academicRank?.name || teacher.position || 'Faculty Member';

  return (
    <Layout>
      <PageHero
        title={teacher.name}
        subtitle={[rank, teacher.department?.name].filter(Boolean).join(' · ')}
        breadcrumbs={[
          { label: 'Faculty', href: '/teachers' },
          { label: teacher.name.split(' ').slice(-1)[0] || teacher.name },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <Link
          to="/teachers"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#C79C78] hover:text-[#a8784e] mb-8"
        >
          <FiArrowLeft size={16} /> Back to faculty directory
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="glass-panel-strong !p-0 overflow-hidden sticky top-28">
              <div className="h-2 bg-[#C79C78]" />
              <div className="p-8 flex flex-col items-center text-center">
                <TeacherAvatar teacher={teacher} size="xl" className="mb-6" />
                <h2 className="font-serif text-2xl font-bold text-slate-900">{teacher.name}</h2>
                <p className="text-[#C79C78] font-semibold mt-1">{rank}</p>
                {teacher.department && (
                  <Link
                    to={`/departments/${teacher.department.id || teacher.departmentId}`}
                    className="text-sm text-[#C79C78] hover:underline mt-1 inline-block"
                  >
                    {teacher.department.name}
                  </Link>
                )}
                {teacher.city && (
                  <p className="flex items-center justify-center gap-1 text-sm text-slate-500 mt-3">
                    <FiMapPin size={14} /> {teacher.city}
                  </p>
                )}

                <div className="w-full mt-6 pt-6 border-t border-slate-100 space-y-3">
                  {teacher.email && (
                    <a
                      href={`mailto:${teacher.email}`}
                      className="flex items-center justify-center gap-2 text-sm text-[#C79C78] hover:underline"
                    >
                      <FiMail size={16} /> {teacher.email}
                    </a>
                  )}
                  {teacher.phone && (
                    <a
                      href={`tel:${teacher.phone}`}
                      className="flex items-center justify-center gap-2 text-sm text-slate-700"
                    >
                      <FiPhone size={16} /> {teacher.phone}
                    </a>
                  )}
                  {teacher.whatsapp && (
                    <a
                      href={`https://wa.me/${teacher.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 text-sm text-slate-700 hover:text-[#C79C78]"
                    >
                      <FiMessageCircle size={16} /> WhatsApp
                    </a>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {teacher.bio && (
              <Card className="glass-panel !p-0 overflow-hidden">
                <div className="h-1.5 bg-[#C79C78]" />
                <div className="p-6 sm:p-8">
                  <h3 className="font-serif text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                    <span className="w-1 h-6 bg-[#C79C78] inline-block" />
                    Biography
                  </h3>
                  <p className="text-slate-700 leading-relaxed">{teacher.bio}</p>
                </div>
              </Card>
            )}

            <Card className="glass-panel !p-0 overflow-hidden">
              <div className="h-1.5 bg-[#C79C78]" />
              <div className="p-6 sm:p-8">
                <h3 className="font-serif text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <span className="w-1 h-6 bg-[#C79C78] inline-block" />
                  Education
                </h3>
                <div className="grid sm:grid-cols-2 gap-6">
                  <InfoBlock label="High School">
                    {teacher.schoolName}
                    {teacher.schoolGraduationYear ? ` (${teacher.schoolGraduationYear})` : ''}
                  </InfoBlock>
                  <InfoBlock label="Bachelor's Degree">
                    {teacher.bachelorUniversity}
                    {teacher.bachelorGraduationYear ? ` (${teacher.bachelorGraduationYear})` : ''}
                  </InfoBlock>
                  {teacher.masterUniversity && (
                    <InfoBlock label="Master's Degree">
                      {teacher.masterUniversity}
                      {teacher.masterCountry ? `, ${teacher.masterCountry}` : ''}
                      {teacher.masterGraduationYear ? ` (${teacher.masterGraduationYear})` : ''}
                      {teacher.masterThesis && (
                        <p className="mt-1 text-slate-500 italic">Thesis: {teacher.masterThesis}</p>
                      )}
                    </InfoBlock>
                  )}
                  {teacher.phdUniversity && (
                    <InfoBlock label="PhD">
                      {teacher.phdUniversity}
                      {teacher.phdCountry ? `, ${teacher.phdCountry}` : ''}
                      {teacher.phdGraduationYear ? ` (${teacher.phdGraduationYear})` : ''}
                      {teacher.phdThesis && (
                        <p className="mt-1 text-slate-500 italic">Dissertation: {teacher.phdThesis}</p>
                      )}
                    </InfoBlock>
                  )}
                </div>
              </div>
            </Card>

            {teacher.researchPapers?.length > 0 && (
              <Card className="glass-panel !p-0 overflow-hidden">
                <div className="h-1.5 bg-[#C79C78]" />
                <div className="p-6 sm:p-8">
                  <h3 className="font-serif text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                    <FiAward className="text-[#C79C78]" />
                    Research & Publications
                  </h3>
                  <ul className="space-y-4">
                    {teacher.researchPapers.map((paper, i) => (
                      <li key={i} className="pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                        <p className="font-medium text-slate-900">{paper.title || paper.name}</p>
                        <p className="text-sm text-slate-500 mt-1">
                          {[paper.journal, paper.year].filter(Boolean).join(' · ')}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            )}

            {teacher.professionalCertificates?.length > 0 && (
              <Card className="glass-panel !p-0 overflow-hidden">
                <div className="h-1.5 bg-[#C79C78]" />
                <div className="p-6 sm:p-8">
                  <h3 className="font-serif text-xl font-bold text-slate-900 mb-6">Professional Certificates</h3>
                  <ul className="space-y-3">
                    {teacher.professionalCertificates.map((cert, i) => (
                      <li key={i} className="text-sm text-slate-700">
                        {cert.name || cert.title}
                        {cert.year ? ` (${cert.year})` : ''}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            )}

            {courses.length > 0 && (
              <Card className="glass-panel !p-0 overflow-hidden">
                <div className="h-1.5 bg-[#C79C78]" />
                <div className="p-6 sm:p-8">
                  <h3 className="font-serif text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                    <FiBook className="text-[#C79C78]" />
                    Courses Taught
                  </h3>
                  <div className="space-y-3">
                    {courses.map((course) => (
                      <Link
                        key={course.id}
                        to={`/courses/${course.id}`}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-3 border-b border-slate-100 last:border-0 hover:bg-white/40 -mx-2 px-2 rounded-lg transition-colors group"
                      >
                        <div>
                          <p className="font-medium text-slate-900 group-hover:text-[#a8784e]">{course.name}</p>
                          {course.code && (
                            <p className="text-xs text-[#C79C78] font-semibold uppercase mt-0.5">{course.code}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {course.level && (
                            <span className="text-xs font-semibold px-2 py-1 glass-panel text-slate-600 uppercase">
                              {course.level}
                            </span>
                          )}
                          <FiArrowRight size={14} className="text-[#C79C78] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TeacherProfile;
