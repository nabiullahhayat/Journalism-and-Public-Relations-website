import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FiArrowLeft, FiCalendar, FiUser } from 'react-icons/fi';
import Layout from '../components/Layout';
import PageHero from '../components/PageHero';
import { Card, Spinner, Alert } from '../components/ui';
import { newsAPI } from '../services/api';
import { getImageUrl } from '../utils/image';

const NewsDetail = () => {
  const { slug } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ['news-article', slug],
    queryFn: () => newsAPI.getBySlug(slug),
    enabled: Boolean(slug),
  });

  const article = data?.data;

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center py-24"><Spinner size="lg" /></div>
      </Layout>
    );
  }

  if (error || !article) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-4 py-24">
          <Alert type="error" message="Article not found" />
          <Link to="/news" className="inline-flex items-center gap-2 mt-6 text-[#C79C78] font-semibold">
            <FiArrowLeft /> Back to news
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHero
        title={article.title}
        subtitle={article.excerpt || article.description}
        breadcrumbs={[
          { label: 'News', href: '/news' },
          { label: article.category || 'Article' },
        ]}
      />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <Link to="/news" className="inline-flex items-center gap-2 text-sm font-semibold text-[#C79C78] hover:text-[#a8784e] mb-8">
          <FiArrowLeft size={16} /> Back to news
        </Link>

        <Card className="glass-panel-strong !p-0 overflow-hidden">
          {article.image && (
            <div className="aspect-[21/9] overflow-hidden">
              <img
                src={getImageUrl(article.image)}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="p-6 sm:p-10">
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-6 pb-6 border-b border-slate-200/80">
              {article.category && (
                <span className="text-xs font-bold uppercase tracking-wider text-[#C79C78]">{article.category}</span>
              )}
              <span className="flex items-center gap-1.5">
                <FiCalendar size={14} />
                {formatDate(article.publishedAt || article.createdAt)}
              </span>
              {article.author && (
                <span className="flex items-center gap-1.5">
                  <FiUser size={14} />{article.author}
                </span>
              )}
            </div>

            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-slate-700 leading-relaxed mb-6 font-medium">
                {article.description}
              </p>
              {(article.content || article.description)?.split('\n').map((para, i) => (
                para.trim() && <p key={i} className="text-slate-700 leading-relaxed mb-4">{para}</p>
              ))}
            </div>

            {Array.isArray(article.tags) && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-slate-200/80">
                {article.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-1 rounded-md glass-panel text-slate-600">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Card>
      </article>
    </Layout>
  );
};

export default NewsDetail;
