import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FiCalendar, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import PageHero from '../components/PageHero';
import FilterBar from '../components/FilterBar';
import { Card, Spinner, Alert, EmptyState, Input, Pagination } from '../components/ui';
import { newsAPI } from '../services/api';
import { getImageUrl } from '../utils/image';

const News = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const limit = 9;

  const { data, isLoading, error } = useQuery({
    queryKey: ['news', page, searchTerm],
    queryFn: () => newsAPI.getAll({ page, limit, search: searchTerm, status: 'published' }),
  });

  const news = data?.data || [];
  const pagination = data?.meta?.pagination || {};

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <Layout>
      <PageHero
        title="News & Updates"
        subtitle="Announcements, events, and stories from across the faculty."
        breadcrumbs={[{ label: 'News' }]}
      />

      <FilterBar>
        <div className="max-w-xl">
          <Input
            placeholder="Search news articles..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
            fullWidth
          />
        </div>
      </FilterBar>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {isLoading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : error ? (
          <Alert type="error" message="Failed to load news" />
        ) : news.length === 0 ? (
          <EmptyState title="No news found" description={searchTerm ? 'Try different search terms' : 'No articles published yet'} />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {news.map((item) => (
                <article key={item.id || item._id} className="uni-card overflow-hidden flex flex-col bg-white group">
                  <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                    {item.image ? (
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-200" />
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {item.category && (
                        <span className="text-xs font-semibold uppercase tracking-wider text-[#C79C78]">{item.category}</span>
                      )}
                      {item.featured && (
                        <span className="text-xs font-semibold px-2 py-0.5 bg-amber-100 text-amber-800 rounded">Featured</span>
                      )}
                    </div>
                    <h3 className="font-serif text-xl font-bold text-slate-900 mb-2 line-clamp-2">{item.title}</h3>
                    {item.excerpt && <p className="text-slate-600 text-sm line-clamp-3 flex-1 mb-4">{item.excerpt}</p>}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                      <span className="flex items-center text-xs text-slate-500">
                        <FiCalendar className="mr-1.5" size={14} />
                        {formatDate(item.publishedAt || item.createdAt)}
                      </span>
                      {item.slug && (
                        <Link to={`/news/${item.slug}`} className="text-sm font-semibold text-[#C79C78] inline-flex items-center gap-1 hover:text-[#a8784e]">
                          Read <FiArrowRight size={14} />
                        </Link>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <div className="mt-12">
                <Pagination
                  currentPage={pagination.page || page}
                  totalPages={pagination.totalPages}
                  onPageChange={setPage}
                  itemsPerPage={pagination.limit || limit}
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

export default News;
