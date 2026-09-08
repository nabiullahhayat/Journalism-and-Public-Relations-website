import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card } from '../components/ui';

const NotFound = () => (
  <Layout>
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <Card className="glass-panel-strong p-10">
        <p className="text-6xl font-serif font-bold text-[#C79C78] mb-4">404</p>
        <h1 className="font-serif text-2xl font-bold text-slate-900 mb-2">Page not found</h1>
        <p className="text-slate-600 mb-8">The page you are looking for does not exist or has been moved.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="btn-primary">Go Home</Link>
          <Link to="/contact" className="btn-outline">Contact Us</Link>
        </div>
      </Card>
    </div>
  </Layout>
);

export default NotFound;
