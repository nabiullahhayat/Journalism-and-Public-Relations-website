import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FiMail, FiPhone, FiMapPin, FiUsers, FiBook, FiArrowRight } from 'react-icons/fi';
import Layout from '../components/Layout';
import PageHero from '../components/PageHero';
import FilterBar from '../components/FilterBar';
import { Card, Spinner, Alert, EmptyState, Input } from '../components/ui';
import { departmentsAPI } from '../services/api';

const Departments = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['departments'],
    queryFn: () => departmentsAPI.getAll({ limit: 100 }),
  });

  const departments = data?.data || [];

  const filteredDepartments = (Array.isArray(departments) ? departments : []).filter(
    (dept) =>
      dept.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <PageHero
        title="Academic Departments"
        subtitle="Explore our departments, programs, and areas of specialization."
        breadcrumbs={[{ label: 'Departments' }]}
      />

      <FilterBar>
        <div className="max-w-xl">
          <Input placeholder="Search departments..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} fullWidth />
        </div>
      </FilterBar>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {isLoading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : error ? (
          <Alert type="error" message="Failed to load departments" />
        ) : filteredDepartments.length === 0 ? (
          <EmptyState icon={<FiUsers size={48} />} title="No departments found" description="Try adjusting your search" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredDepartments.map((dept) => (
              <Card key={dept.id || dept._id} hover className="flex flex-col h-full !p-0 overflow-hidden group">
                <div className="h-1.5 bg-[#C79C78]" />
                <div className="p-6 flex flex-col flex-1">
                  <Link to={`/departments/${dept.id}`} className="hover:text-[#a8784e]">
                    <h3 className="font-serif text-xl font-bold text-slate-900 mb-1">{dept.name}</h3>
                  </Link>
                  {dept.code && <p className="text-sm font-semibold text-[#C79C78] mb-3">Code: {dept.code}</p>}
                  {dept.description && <p className="text-slate-600 text-sm flex-1 line-clamp-4 mb-4">{dept.description}</p>}
                  <div className="space-y-2 text-sm text-slate-600 pt-4 border-t border-slate-100">
                    {dept.head && (
                      <div className="flex items-center gap-2"><FiUsers size={16} className="text-slate-400 shrink-0" /> Head: {dept.head.name}</div>
                    )}
                    {dept.email && (
                      <div className="flex items-center gap-2"><FiMail size={16} className="text-slate-400 shrink-0" /><a href={`mailto:${dept.email}`} className="text-[#C79C78] hover:underline truncate">{dept.email}</a></div>
                    )}
                    {dept.phone && (
                      <div className="flex items-center gap-2"><FiPhone size={16} className="text-slate-400 shrink-0" />{dept.phone}</div>
                    )}
                    {dept.location && (
                      <div className="flex items-center gap-2"><FiMapPin size={16} className="text-slate-400 shrink-0" />{dept.location}</div>
                    )}
                    {dept.teacherCount > 0 && (
                      <div className="flex items-center gap-2"><FiBook size={16} className="text-slate-400 shrink-0" />{dept.teacherCount} Faculty</div>
                    )}
                  </div>
                  <Link
                    to={`/departments/${dept.id}`}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#C79C78] hover:text-[#a8784e]"
                  >
                    View department <FiArrowRight size={14} />
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

export default Departments;
