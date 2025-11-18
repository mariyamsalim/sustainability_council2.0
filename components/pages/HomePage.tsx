
import React, { useRef } from 'react';
import { Page } from '../../types';
import Button from '../ui/Button';
import Card from '../ui/Card';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import { useAuth } from '../../context/AuthContext';

interface HomePageProps {
  setCurrentPage: (page: Page) => void;
}

const AnimatedSection: React.FC<{children: React.ReactNode, className?: string}> = ({ children, className }) => {
    const ref = useRef<HTMLDivElement>(null);
    const isVisible = useIntersectionObserver(ref, { threshold: 0.2, freezeOnceVisible: true });

    return (
        <div ref={ref} className={`transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}>
            {children}
        </div>
    );
};

const HomePage: React.FC<HomePageProps> = ({ setCurrentPage }) => {
  const { loggedIn } = useAuth();
  
  const handleStartSession = () => {
    setCurrentPage(Page.COUNCIL);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://picsum.photos/seed/sustainability/1920/1080')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-900/70 to-teal-900/80"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-white">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <AnimatedSection>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
                Sustainability Council
              </h1>
              <p className="mt-4 text-lg md:text-xl text-slate-300 max-w-2xl">
                An AI-powered CSR panel that debates your sustainability decisions from multiple expert perspectives.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button onClick={handleStartSession}>
                  Start a Council Session
                </Button>
                <Button variant="secondary" onClick={() => setCurrentPage(Page.ABOUT)}>
                  Learn More
                </Button>
              </div>
            </AnimatedSection>
            <div>
                {/* Placeholder for illustration */}
            </div>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white animate-bounce">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[var(--bg)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="text-center">
                <h2 className="text-3xl font-bold">Decision Support for a Sustainable Future</h2>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Achieve clarity on complex challenges with our unique approach.</p>
            </AnimatedSection>
            <div className="mt-12 grid md:grid-cols-3 gap-8">
                <AnimatedSection>
                    <Card className="hover:-translate-y-2 hover:shadow-[var(--shadow-strong)]">
                        <h3 className="text-xl font-semibold">Multiple Expert Personas</h3>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">Gain a 360-degree view by consulting a simulated panel of diverse experts, from climate scientists to community representatives.</p>
                    </Card>
                </AnimatedSection>
                <AnimatedSection>
                    <Card className="hover:-translate-y-2 hover:shadow-[var(--shadow-strong)]">
                        <h3 className="text-xl font-semibold">CSR-Style Assessment</h3>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">Receive a structured analysis of your scenario's Environmental, Social, and Governance/Economic (ESG/CSR) impacts.</p>
                    </Card>
                </AnimatedSection>
                <AnimatedSection>
                    <Card className="hover:-translate-y-2 hover:shadow-[var(--shadow-strong)]">
                        <h3 className="text-xl font-semibold">Support, Not Just Answers</h3>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">Explore options, understand trade-offs, and get actionable recommendations to improve your sustainability plans.</p>
                    </Card>
                </AnimatedSection>
            </div>
        </div>
      </section>

      {/* How it Works Section */}
        <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <AnimatedSection className="text-center mb-12">
                    <h2 className="text-3xl font-bold">A Simple Three-Step Process</h2>
                </AnimatedSection>
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <AnimatedSection className="text-center max-w-xs">
                        <div className="mx-auto w-16 h-16 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-2xl font-bold mb-4">1</div>
                        <h3 className="text-xl font-semibold">Describe Your Scenario</h3>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">Clearly outline your project, plan, or sustainability challenge.</p>
                    </AnimatedSection>
                    <div className="hidden md:block flex-grow border-t-2 border-dashed border-[var(--border)]"></div>
                    <AnimatedSection className="text-center max-w-xs">
                        <div className="mx-auto w-16 h-16 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-2xl font-bold mb-4">2</div>
                        <h3 className="text-xl font-semibold">Run the Council</h3>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">Our AI panel debates the scenario from their unique perspectives.</p>
                    </AnimatedSection>
                    <div className="hidden md:block flex-grow border-t-2 border-dashed border-[var(--border)]"></div>
                    <AnimatedSection className="text-center max-w-xs">
                        <div className="mx-auto w-16 h-16 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-2xl font-bold mb-4">3</div>
                        <h3 className="text-xl font-semibold">Review and Export</h3>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">Receive a full CSR assessment, explore options, and export your report.</p>
                    </AnimatedSection>
                </div>
            </div>
        </section>

    </div>
  );
};

export default HomePage;
