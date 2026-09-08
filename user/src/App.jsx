import { Route, Routes, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import './App.css';

import { lazy, Suspense } from 'react';

const HomePage = lazy(() => import('./Pages/HomePage'));
const About = lazy(() => import('./Pages/About'));
const Departments = lazy(() => import('./Pages/Departments'));
const DepartmentDetail = lazy(() => import('./Pages/DepartmentDetail'));
const Courses = lazy(() => import('./Pages/Courses'));
const CourseDetail = lazy(() => import('./Pages/CourseDetail'));
const Teachers = lazy(() => import('./Pages/Teachers'));
const TeacherProfile = lazy(() => import('./Pages/TeacherProfile'));
const News = lazy(() => import('./Pages/News'));
const NewsDetail = lazy(() => import('./Pages/NewsDetail'));
const Monographs = lazy(() => import('./Pages/Monographs'));
const Contact = lazy(() => import('./Pages/Contact'));
const NotFound = lazy(() => import('./Pages/NotFound'));

const AdminLogin = lazy(() => import('./Admin/Login'));
const AdminLayout = lazy(() => import('./Admin/AdminLayout'));
const Dashboard = lazy(() => import('./Admin/Dashboard'));
const AdminsManagement = lazy(() => import('./Admin/AdminsManagement'));
const DepartmentsManagement = lazy(() => import('./Admin/DepartmentsManagement'));
const CoursesManagement = lazy(() => import('./Admin/CoursesManagement'));
const TeachersManagement = lazy(() => import('./Admin/TeachersManagement'));
const NewsManagement = lazy(() => import('./Admin/NewsManagement'));
const MonographsManagement = lazy(() => import('./Admin/MonographsManagement'));
const AboutManagement = lazy(() => import('./Admin/AboutManagement'));
const ContactManagement = lazy(() => import('./Admin/ContactManagement'));
const Profile = lazy(() => import('./Admin/Profile'));
const Settings = lazy(() => import('./Admin/Settings'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const Loading = () => (
  <div className="min-h-screen flex items-center justify-center page-backdrop">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#C79C78' }} />
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen">
        <AuthProvider>
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<About />} />
              <Route path="/departments" element={<Departments />} />
              <Route path="/departments/:id" element={<DepartmentDetail />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:id" element={<CourseDetail />} />
              <Route path="/teachers" element={<Teachers />} />
              <Route path="/teachers/:id" element={<TeacherProfile />} />
              <Route path="/news" element={<News />} />
              <Route path="/news/:slug" element={<NewsDetail />} />
              <Route path="/monographs" element={<Monographs />} />
              <Route path="/contact" element={<Contact />} />

              <Route
                path="/admin/login"
                element={
                  <PublicRoute redirectIfAuthenticated>
                    <AdminLogin />
                  </PublicRoute>
                }
              />

              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="admins" element={<AdminsManagement />} />
                <Route path="departments" element={<DepartmentsManagement />} />
                <Route path="courses" element={<CoursesManagement />} />
                <Route path="teachers" element={<TeachersManagement />} />
                <Route path="news" element={<NewsManagement />} />
                <Route path="monographs" element={<MonographsManagement />} />
                <Route path="about" element={<AboutManagement />} />
                <Route path="contact" element={<ContactManagement />} />
                <Route path="profile" element={<Profile />} />
                <Route path="settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: { background: '#363636', color: '#fff' },
              success: { duration: 3000, iconTheme: { primary: '#10b981', secondary: '#fff' } },
              error: { duration: 4000, iconTheme: { primary: '#ef4444', secondary: '#fff' } },
            }}
          />
        </AuthProvider>
      </div>
    </QueryClientProvider>
  );
}

export default App;
