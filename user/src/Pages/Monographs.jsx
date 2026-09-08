import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FiCalendar, FiUser, FiBook } from 'react-icons/fi';
import Layout from '../components/Layout';
import PageHero from '../components/PageHero';
import FilterBar from '../components/FilterBar';
import { Card, Spinner, Alert, EmptyState, Input, Select, Pagination } from '../components/ui';
import { monographsAPI } from '../services/api';

const Monographs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [page, setPage] = useState(1);
  const limit = 12;

  const { data, isLoading, error } = useQuery({
    queryKey: ['monographs', page, searchTerm, selectedYear],
    queryFn: () => monographsAPI.getAll({ page, limit, search: searchTerm, year: selectedYear }),
  });

  const monographs = data?.data || [];
  const pagination = data?.meta?.pagination || data?.data?.pagination || {};

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 11 }, (_, i) => ({
    value: (currentYear - i).toString(),
    label: (currentYear - i).toString(),
  }));

  return (
    <Layout>
      <PageHero
        title="Research Monographs"
        subtitle="Explore academic monographs and student research publications from our faculty."
        breadcrumbs={[{ label: 'Monographs' }]}
      />

      <FilterBar>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
          <Input
            placeholder="Search monographs..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
            fullWidth
          />
          <Select
            placeholder="All Years"
            options={yearOptions}
            value={selectedYear}
            onChange={(e) => { setSelectedYear(e.target.value); setPage(1); }}
            fullWidth
          />
        </div>
      </FilterBar>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {isLoading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : error ? (
          <Alert type="error" message="Failed to load monographs" />
        ) : (Array.isArray(monographs) ? monographs : []).length === 0 ? (
          <EmptyState
            icon={<FiBook size={48} />}
            title="No monographs found"
            description={searchTerm || selectedYear ? 'Try adjusting your search or filter criteria' : 'No monographs are available at this time'}
          />
        ) : (
          <>
            <div className="space-y-4">
              {(Array.isArray(monographs) ? monographs : []).map((mono) => (
                <Card key={mono._id || mono.id} hover className="!p-0 overflow-hidden">
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-2 bg-[#C79C78] shrink-0" />
                    <div className="p-6 flex flex-col sm:flex-row gap-4 flex-1">
                      <div className="shrink-0">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center bg-[rgba(199,156,120,0.12)]">
                          <FiBook size={32} className="text-[#C79C78]" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-serif text-xl font-bold text-slate-900 mb-2">
                          {mono.title || mono.issue}
                        </h3>
                        {mono.abstract && (
                          <p className="text-sm text-slate-600 mb-3 line-clamp-3">{mono.abstract}</p>
                        )}
                        <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                          {mono.studentName && (
                            <span className="flex items-center gap-2"><FiUser size={16} className="text-slate-400" />{mono.studentName}</span>
                          )}
                          {mono.supervisor && (
                            <span className="flex items-center gap-2"><FiUser size={16} className="text-slate-400" />Supervisor: {mono.supervisor}</span>
                          )}
                          {mono.year && (
                            <span className="flex items-center gap-2"><FiCalendar size={16} className="text-slate-400" />{mono.year}</span>
                          )}
                          {mono.department?.name && (
                            <span className="flex items-center gap-2"><FiBook size={16} className="text-slate-400" />{mono.department.name}</span>
                          )}
                        </div>
                        {mono.grade && (
                          <div className="mt-4 pt-4 border-t border-slate-100">
                            <span className="text-xs font-bold px-2 py-1 bg-[rgba(199,156,120,0.12)] text-[#C79C78] uppercase tracking-wide">
                              Grade: {mono.grade}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <div className="mt-12">
                <Pagination
                  currentPage={pagination.currentPage || pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={setPage}
                  itemsPerPage={pagination.limit}
                  totalItems={pagination.total}
                />
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Monographs;
