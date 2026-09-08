import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  FiArrowRight, FiBook, FiUsers, FiFileText,
  FiBookOpen, FiInfo, FiMail,
} from 'react-icons/fi';
import Layout from '../components/Layout';
import SectionHeader from '../components/SectionHeader';
import { Spinner } from '../components/ui';
import { publicAPI } from '../services/api';
import { getImageUrl } from '../utils/image';
import TeacherAvatar from '../components/TeacherAvatar';

const quickLinks = [
  { title: 'About the Faculty', desc: 'Mission, vision & history', href: '/about', icon: FiInfo },
  { title: 'Academic Programs', desc: 'Departments & courses', href: '/departments', icon: FiBook },
  { title: 'Faculty Directory', desc: 'Meet our professors', href: '/teachers', icon: FiUsers },
  { title: 'Student Research', desc: 'Monographs & theses', href: '/monographs', icon: FiBookOpen },
];

const HomePage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['home-summary'],
    queryFn: () => publicAPI.getHomeSummary(),
    staleTime: 5 * 60 * 1000,
  });

  const about = data?.data?.about;
  const stats = data?.data?.stats;
  const newsItems = Array.isArray(data?.data?.featuredNews) ? data.data.featuredNews : [];
  const teacherItems = Array.isArray(data?.data?.featuredTeachers) ? data.data.featuredTeachers : [];

  const heroSubtitle = about?.facultyDescription
    ? about.facultyDescription.split('\n')[0].slice(0, 180)
    : null;

  const statCards = [
    { label: 'Departments', value: stats?.departments ?? '—' },
    { label: 'Faculty Members', value: stats?.teachers ?? '—' },
    { label: 'Courses Offered', value: stats?.courses ?? '—' },
    { label: 'News & Events', value: stats?.news ?? '—' },
  ];

  return (
    <Layout>
      <section className="relative min-h-[380px] sm:min-h-[420px] flex items-center glass-hero overflow-hidden border-b border-slate-200/80">
        <div className="absolute inset-0 hero-mesh opacity-50 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-[#C79C78]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
          <div className="max-w-3xl">
            <p className="text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-[#C79C78] mb-4">
              Kandahar University
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-slate-900">
              Journalism & Public Relations Faculty
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl">
              {heroSubtitle || (isLoading ? 'Loading faculty information...' : 'Welcome to our faculty.')}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link to="/about" className="btn-primary">
                Explore Programs <FiArrowRight />
              </Link>
              <Link to="/contact" className="btn-outline">
                Request Information
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className="group flex gap-4 p-5 border border-slate-200 rounded-sm hover:border-[#C79C78] hover:shadow-soft transition-colors bg-slate-50/50 hover:bg-white"
                >
                  <div className="shrink-0 w-11 h-11 flex items-center justify-center bg-[rgba(199,156,120,0.12)] text-[#C79C78] group-hover:bg-[#C79C78] group-hover:text-white transition-colors">
                    <Icon size={22} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 group-hover:text-[#a8784e] transition-colors">{link.title}</p>
                    <p className="text-sm text-slate-500 mt-0.5">{link.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {statCards.map((stat) => (
              <div key={stat.label} className="glass-panel-strong rounded-xl p-6 text-center lg:text-left border-l-4 border-l-[#C79C78]">
                <div className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">{stat.value}</div>
                <div className="mt-2 text-sm uppercase tracking-wider text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="News & Events"
            title="Latest from Our Faculty"
            description="Stay informed about academic announcements, research highlights, and community events."
            actionLabel="View all news"
            actionHref="/news"
          />

          {isLoading ? (
            <div className="flex justify-center py-16"><Spinner size="lg" /></div>
          ) : newsItems.length === 0 ? (
            <p className="text-center text-slate-500 py-12">No news articles yet. Add news from the admin panel.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {newsItems.map((item) => (
                <article key={item.id || item._id} className="uni-card overflow-hidden group bg-white">
                  <div className="aspect-[16/10] overflow-hidden bg-slate-200">
                    {item.image ? (
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                        <FiFileText size={48} />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#C79C78]">
                      {item.category || 'News'}
                    </span>
                    <h3 className="font-serif text-xl font-bold text-slate-900 mt-2 mb-3 line-clamp-2 group-hover:text-[#a8784e] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 text-sm line-clamp-3 mb-4">{item.excerpt || item.description}</p>
                    <Link
                      to={`/news/${item.slug}`}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-[#C79C78] hover:text-[#a8784e]"
                    >
                      Read article <FiArrowRight size={14} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Our People"
            title="Distinguished Faculty"
            description="Learn from experienced educators and practitioners committed to journalism excellence."
            actionLabel="Full directory"
            actionHref="/teachers"
          />

          {isLoading ? (
            <div className="flex justify-center py-16"><Spinner size="lg" /></div>
          ) : teacherItems.length === 0 ? (
            <p className="text-center text-slate-500 py-12">No faculty members yet. Add teachers from the admin panel.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {teacherItems.map((teacher) => (
                <Link
                  key={teacher.id || teacher._id}
                  to={`/teachers/${teacher.id}`}
                  className="uni-card text-center p-6 bg-white group hover:border-[#C79C78] transition-colors"
                >
                  <TeacherAvatar teacher={teacher} size="md" className="mx-auto mb-4 group-hover:ring-[#C79C78]" />
                  <h3 className="font-serif font-bold text-slate-900 group-hover:text-[#a8784e] transition-colors">{teacher.name}</h3>
                  <p className="text-sm text-[#C79C78] font-medium mt-1">
                    {teacher.academicRank?.name || 'Faculty Member'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{teacher.department?.name}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="relative py-16 sm:py-20 overflow-hidden bg-slate-50">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-panel-strong rounded-2xl p-10 sm:p-14 text-center">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Begin Your Journey in Journalism</h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto mb-8">
              Join a community dedicated to truth, ethics, and professional excellence in media and public relations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact" className="btn-primary">
                <FiMail size={18} /> Contact Admissions
              </Link>
              <Link to="/courses" className="btn-outline">
                Browse Courses
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
