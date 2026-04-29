import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { ArrowRight, Zap, Users, TrendingUp, Award } from "lucide-react";

const colors = {
  deepBlack: '#0A0A0A',
  softBlack: '#121212',
  surfaceGray: '#1A1A1A',
  borderGray: '#2A2A2A',
  primaryWhite: '#F5F5F5',
  mutedWhite: '#B8B8B8',
  gold: '#D4AF37',
};

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.deepBlack, color: colors.primaryWhite, overflow: 'hidden' }}>
      {/* Navigation */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        borderBottom: `1px solid rgba(42, 42, 42, 0.3)`,
        backgroundColor: 'rgba(10, 10, 10, 0.8)',
        backdropFilter: 'blur(8px)',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '1.125rem', fontWeight: 'bold', letterSpacing: '-0.5px' }}>ANIMATION STUDIO OS</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {isAuthenticated ? (
              <a href="/dashboard" style={{
                padding: '0.5rem 1rem',
                backgroundColor: 'transparent',
                color: colors.primaryWhite,
                border: `1px solid ${colors.primaryWhite}`,
                borderRadius: '0.375rem',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'all 300ms',
              }}>
                Dashboard
              </a>
            ) : (
              <a href={getLoginUrl()} style={{
                padding: '0.5rem 1rem',
                backgroundColor: colors.gold,
                color: colors.deepBlack,
                border: 'none',
                borderRadius: '0.375rem',
                textDecoration: 'none',
                cursor: 'pointer',
                fontWeight: '500',
                transition: 'all 300ms',
              }}>
                Sign In
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ paddingTop: '8rem', paddingBottom: '6rem', paddingLeft: '1rem', paddingRight: '1rem' }}>
        <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
          {/* Main headline */}
          <div style={{ marginBottom: '3rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h1 style={{
              fontSize: '3.75rem',
              fontWeight: 'bold',
              lineHeight: 1.2,
              letterSpacing: '-1px',
              marginBottom: '0.5rem',
              fontFamily: "'Space Grotesk', system-ui, sans-serif",
            }}>
              The Complete Animation Studio Operating System
            </h1>
            <p style={{
              fontSize: '1.25rem',
              color: colors.mutedWhite,
              lineHeight: 1.6,
              maxWidth: '32rem',
            }}>
              Recruit talented animators, evaluate their skills, provide personalized training, and manage production—all in one unified creative workspace.
            </p>
          </div>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '5rem', flexWrap: 'wrap' }}>
            <a href={getLoginUrl()} style={{
              padding: '0.5rem 1rem',
              backgroundColor: colors.gold,
              color: colors.deepBlack,
              border: 'none',
              borderRadius: '0.375rem',
              textDecoration: 'none',
              cursor: 'pointer',
              fontWeight: '500',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              width: 'fit-content',
              transition: 'all 300ms',
            }}>
              Apply Now
              <ArrowRight style={{ width: '1rem', height: '1rem' }} />
            </a>
            <a href="#features" style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'transparent',
              color: colors.primaryWhite,
              border: `1px solid ${colors.primaryWhite}`,
              borderRadius: '0.375rem',
              textDecoration: 'none',
              cursor: 'pointer',
              width: 'fit-content',
              transition: 'all 300ms',
            }}>
              Learn More
            </a>
          </div>

          {/* Stat cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {[
              { label: "Applicants Processed", value: "500+" },
              { label: "Artists Trained", value: "150+" },
              { label: "Projects Completed", value: "1200+" },
            ].map((stat, i) => (
              <div key={i} style={{
                backgroundColor: colors.softBlack,
                border: `1px solid rgba(42, 42, 42, 0.5)`,
                borderRadius: '0.5rem',
                padding: '1.5rem',
                transition: 'all 300ms',
              }}>
                <div style={{ fontSize: '1.875rem', fontWeight: 'bold', color: colors.gold, marginBottom: '0.5rem' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '0.875rem', color: colors.mutedWhite }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{
        paddingTop: '6rem',
        paddingBottom: '6rem',
        paddingLeft: '1rem',
        paddingRight: '1rem',
        borderTop: `1px solid rgba(42, 42, 42, 0.3)`,
      }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2.25rem',
            fontWeight: 'bold',
            marginBottom: '4rem',
            textAlign: 'center',
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
          }}>
            Platform Features
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {[
              {
                icon: Users,
                title: "Talent Recruitment",
                description: "Streamlined application portal with portfolio review and skill assessment",
              },
              {
                icon: Zap,
                title: "Skill Evaluation",
                description: "Timed animation challenges with AI-powered scoring and detailed feedback",
              },
              {
                icon: TrendingUp,
                title: "Personalized Learning",
                description: "Interactive lesson modules with progress tracking and skill progression",
              },
              {
                icon: Award,
                title: "Gamified Growth",
                description: "Level system, badges, and achievement tracking to motivate artists",
              },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} style={{
                  backgroundColor: colors.softBlack,
                  border: `1px solid rgba(42, 42, 42, 0.5)`,
                  borderRadius: '0.5rem',
                  padding: '2rem',
                  transition: 'all 300ms',
                }}>
                  <Icon style={{ width: '2rem', height: '2rem', color: colors.gold, marginBottom: '1rem' }} />
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem', fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
                    {feature.title}
                  </h3>
                  <p style={{ color: colors.mutedWhite, fontSize: '0.875rem', lineHeight: 1.6 }}>
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section style={{
        paddingTop: '6rem',
        paddingBottom: '6rem',
        paddingLeft: '1rem',
        paddingRight: '1rem',
        backgroundColor: 'rgba(18, 18, 18, 0.5)',
        borderTop: `1px solid rgba(42, 42, 42, 0.3)`,
      }}>
        <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2.25rem',
            fontWeight: 'bold',
            marginBottom: '4rem',
            textAlign: 'center',
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
          }}>
            How It Works
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {[
              {
                step: "01",
                title: "Apply",
                description: "Submit your portfolio, resume, and motivation statement",
              },
              {
                step: "02",
                title: "Assess",
                description: "Complete timed animation challenges to showcase your skills",
              },
              {
                step: "03",
                title: "Learn",
                description: "Access personalized training modules matched to your level",
              },
              {
                step: "04",
                title: "Grow",
                description: "Complete production tasks, earn badges, and advance through levels",
              },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                <div style={{
                  width: '3rem',
                  height: '3rem',
                  flexShrink: 0,
                  border: `2px solid rgba(212, 175, 55, 0.5)`,
                  borderRadius: '0.375rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: "'JetBrains Mono', monospace",
                  color: colors.gold,
                  fontWeight: 'bold',
                }}>
                  {item.step}
                </div>
                <div style={{ flexGrow: 1 }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem', fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
                    {item.title}
                  </h3>
                  <p style={{ color: colors.mutedWhite }}>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        paddingTop: '6rem',
        paddingBottom: '6rem',
        paddingLeft: '1rem',
        paddingRight: '1rem',
        borderTop: `1px solid rgba(42, 42, 42, 0.3)`,
      }}>
        <div style={{ maxWidth: '48rem', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontSize: '2.25rem',
            fontWeight: 'bold',
            marginBottom: '1.5rem',
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
          }}>
            Ready to Join?
          </h2>
          <p style={{
            fontSize: '1.125rem',
            color: colors.mutedWhite,
            marginBottom: '2rem',
          }}>
            Start your journey as an animator or manage your studio's talent pipeline.
          </p>
          <a href={getLoginUrl()} style={{
            padding: '0.5rem 1rem',
            backgroundColor: colors.gold,
            color: colors.deepBlack,
            border: 'none',
            borderRadius: '0.375rem',
            textDecoration: 'none',
            cursor: 'pointer',
            fontWeight: '500',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 300ms',
          }}>
            Get Started
            <ArrowRight style={{ width: '1rem', height: '1rem' }} />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: `1px solid rgba(42, 42, 42, 0.3)`,
        paddingTop: '2rem',
        paddingBottom: '2rem',
        paddingLeft: '1rem',
        paddingRight: '1rem',
        textAlign: 'center',
        color: colors.mutedWhite,
        fontSize: '0.875rem',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <p>© 2026 Animation Studio OS. A professional creative workspace.</p>
        </div>
      </footer>
    </div>
  );
}
