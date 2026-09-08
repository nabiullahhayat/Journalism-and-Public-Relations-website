import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { 
  FiUsers, 
  FiBook, 
  FiFileText, 
  FiBookOpen,
  FiTrendingUp,
  FiArrowRight
} from 'react-icons/fi';
import { Card, Spinner, Badge } from '../components/ui';
import { 
  departmentsAPI, 
  coursesAPI, 
  teachersAPI, 
  newsAPI,
  monographsAPI
} from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  // Fetch statistics
  const { data: deptData, isLoading: deptLoading } = useQuery({
    queryKey: ['departments-count'],
    queryFn: () => departmentsAPI.getAll({ limit: 1 }),
  });

  const { data: coursesData, isLoading: coursesLoading } = useQuery({
    queryKey: ['courses-count'],
    queryFn: () => coursesAPI.getAll({ limit: 1 }),
  });

  const { data: teachersData, isLoading: teachersLoading } = useQuery({
    queryKey: ['teachers-count'],
    queryFn: () => teachersAPI.getAll({ limit: 1 }),
  });

  const { data: newsData, isLoading: newsLoading } = useQuery({
    queryKey: ['news-count'],
    queryFn: () => newsAPI.getAll({ limit: 1 }),
  });

  const { data: monoData, isLoading: monoLoading } = useQuery({
    queryKey: ['monographs-count'],
    queryFn: () => monographsAPI.getAll({ limit: 1 }),
  });

  const { data: latestNews } = useQuery({
    queryKey: ['latest-news-admin'],
    queryFn: () => newsAPI.getLatest(5),
  });

  const stats = [
    {
      name: 'Departments',
      value: deptData?.meta?.pagination?.total ?? 0,
      icon: FiUsers,
      color: 'bg-[#C79C78]',
      link: '/admin/departments',
      loading: deptLoading,
    },
    {
      name: 'Courses',
      value: coursesData?.meta?.pagination?.total ?? 0,
      icon: FiBook,
      color: 'bg-green-500',
      link: '/admin/courses',
      loading: coursesLoading,
    },
    {
      name: 'Faculty',
      value: teachersData?.meta?.pagination?.total ?? 0,
      icon: FiUsers,
      color: 'bg-purple-500',
      link: '/admin/teachers',
      loading: teachersLoading,
    },
    {
      name: 'News',
      value: newsData?.meta?.pagination?.total ?? 0,
      icon: FiFileText,
      color: 'bg-orange-500',
      link: '/admin/news',
      loading: newsLoading,
    },
    {
      name: 'Monographs',
      value: monoData?.meta?.pagination?.total ?? 0,
      icon: FiBookOpen,
      color: 'bg-[#a8784e]',
      link: '/admin/monographs',
      loading: monoLoading,
    },
  ];

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Section */}
      <div className="rounded-2xl p-6 sm:p-8 glass-panel-strong border border-white/90">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-slate-900 font-serif">
          Welcome back, {user?.fullName || user?.username}!
        </h2>
        <p className="text-base sm:text-lg text-slate-600">
          Here's what's happening with your faculty management system today.
        </p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.name} to={stat.link}>
              <Card hover className="h-full">
                <div className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                      <Icon size={24} className="text-white" />
                    </div>
                    <FiTrendingUp className="text-green-500" size={20} />
                  </div>
                  
                  {stat.loading ? (
                    <div className="flex items-center justify-center py-2">
                      <Spinner size="sm" />
                    </div>
                  ) : (
                    <>
                      <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-600">{stat.name}</div>
                    </>
                  )}
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Latest News */}
        <Card title="Latest News" subtitle="Recent news articles">
          <div className="space-y-4">
            {latestNews?.data?.slice(0, 5).map((item) => (
              <div
                key={item.id || item._id}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="text-sm sm:text-base font-medium text-gray-900 line-clamp-2">
                      {item.title}
                    </h4>
                    {item.featured && (
                      <Badge variant="warning" size="sm" className="flex-shrink-0">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {formatDate(item.publishedAt || item.createdAt)}
                  </p>
                </div>
              </div>
            ))}
            
            {(!latestNews?.data || latestNews.data.length === 0) && (
              <p className="text-center text-gray-500 py-8">No news articles yet</p>
            )}
            
            <Link
              to="/admin/news"
              className="flex items-center justify-center space-x-2 font-medium text-sm pt-2 hover:opacity-75 transition-opacity"
              style={{ color: '#C79C78' }}
            >
              <span>View All News</span>
              <FiArrowRight size={16} />
            </Link>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card title="Quick Actions" subtitle="Common tasks">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <Link
              to="/admin/news"
              className="flex items-center space-x-3 p-4 rounded-lg border-2 border-gray-200 transition-all hover:border-[#C79C78] hover:bg-[rgba(199,156,120,0.06)]"
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(199,156,120,0.15)' }}>
                <FiFileText size={20} style={{ color: '#C79C78' }} />
              </div>
              <div>
                <div className="font-medium text-gray-900 text-sm sm:text-base">Add News</div>
                <div className="text-xs text-gray-500">Create article</div>
              </div>
            </Link>

            <Link
              to="/admin/teachers"
              className="flex items-center space-x-3 p-4 rounded-lg border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all"
            >
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FiUsers size={20} className="text-green-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900 text-sm sm:text-base">Add Teacher</div>
                <div className="text-xs text-gray-500">New faculty</div>
              </div>
            </Link>

            <Link
              to="/admin/courses"
              className="flex items-center space-x-3 p-4 rounded-lg border-2 border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all"
            >
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <FiBook size={20} className="text-purple-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900 text-sm sm:text-base">Add Course</div>
                <div className="text-xs text-gray-500">Create course</div>
              </div>
            </Link>

            <Link
              to="/admin/monographs"
              className="flex items-center space-x-3 p-4 rounded-lg border-2 border-gray-200 transition-all hover:border-[#a8784e] hover:bg-[rgba(168,120,78,0.06)]"
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(168,120,78,0.15)' }}>
                <FiBookOpen size={20} style={{ color: '#a8784e' }} />
              </div>
              <div>
                <div className="font-medium text-gray-900 text-sm sm:text-base">Add Monograph</div>
                <div className="text-xs text-gray-500">New publication</div>
              </div>
            </Link>
          </div>
        </Card>
      </div>

      {/* System Info */}
      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center">
          <div>
            <div className="text-xs sm:text-sm text-gray-500 mb-1">Your Role</div>
            <Badge variant="primary" size="md" className="capitalize">
              {user?.role}
            </Badge>
          </div>
          <div>
            <div className="text-xs sm:text-sm text-gray-500 mb-1">Email</div>
            <div className="text-sm font-medium text-gray-900 truncate">
              {user?.email}
            </div>
          </div>
          <div>
            <div className="text-xs sm:text-sm text-gray-500 mb-1">Department</div>
            <div className="text-sm font-medium text-gray-900 truncate">
              {user?.department || 'Not assigned'}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
