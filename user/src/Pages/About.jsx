import { useQuery } from '@tanstack/react-query';
import Layout from '../components/Layout';
import PageHero from '../components/PageHero';
import { Card, Spinner, Alert } from '../components/ui';
import { aboutAPI } from '../services/api';

const About = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['about'],
    queryFn: aboutAPI.get,
  });

  const about = data?.data;

  return (
    <Layout>
      <PageHero
        title="About Our Faculty"
        subtitle="Discover our commitment to journalism education, ethical practice, and public service."
        breadcrumbs={[{ label: 'About' }]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        {isLoading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : error ? (
          <Alert type="error" message="Failed to load about information" />
        ) : about ? (
          <div className="space-y-8">
            {(about.facultyDescription || about.description) && (
              <Card>
                <h2 className="font-serif text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                  <span className="w-1 h-8 bg-[#C79C78] inline-block" />
                  Who We Are
                </h2>
                <div className="text-slate-700 leading-relaxed space-y-4">
                  {(about.facultyDescription || about.description).split('\n').map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </Card>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              {(about.facultyMission || about.mission) && (
                <Card className="border-t-4 border-t-[#C79C78]">
                  <h2 className="font-serif text-xl font-bold text-slate-900 mb-3">Our Mission</h2>
                  <p className="text-slate-700 leading-relaxed">{about.facultyMission || about.mission}</p>
                </Card>
              )}
              {(about.facultyVision || about.vision) && (
                <Card className="border-t-4 border-t-slate-800">
                  <h2 className="font-serif text-xl font-bold text-slate-900 mb-3">Our Vision</h2>
                  <p className="text-slate-700 leading-relaxed">{about.facultyVision || about.vision}</p>
                </Card>
              )}
            </div>

            {Array.isArray(about.requirements) && about.requirements.length > 0 && (
              <Card>
                <h2 className="font-serif text-2xl font-bold text-slate-900 mb-4">Program Requirements</h2>
                <ul className="space-y-3">
                  {about.requirements.map((req, i) => (
                    <li key={i} className="flex gap-3 text-slate-700">
                      <span className="text-[#C79C78] font-bold">{i + 1}.</span>
                      {req}
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>
        ) : (
          <Alert type="info" message="No about information available" />
        )}
      </div>
    </Layout>
  );
};

export default About;
