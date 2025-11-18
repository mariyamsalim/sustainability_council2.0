
import React, { useRef } from 'react';
import Card from '../ui/Card';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import { PERSONA_DETAILS } from '../../constants';

const AnimatedSection: React.FC<{children: React.ReactNode, className?: string}> = ({ children, className }) => {
    const ref = useRef<HTMLDivElement>(null);
    const isVisible = useIntersectionObserver(ref, { threshold: 0.1, freezeOnceVisible: true });

    return (
        <div ref={ref} className={`transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}>
            {children}
        </div>
    );
};

const AboutPage: React.FC = () => {
  return (
    <div className="pt-24 pb-16 bg-[var(--bg)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            <AnimatedSection className="text-center">
                <h1 className="text-4xl font-extrabold tracking-tight">About Sustainability Council</h1>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                    Empowering better decisions through multi-dimensional thinking.
                </p>
            </AnimatedSection>

            <AnimatedSection>
                <Card>
                    <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        Sustainability challenges are rarely simple. A decision that looks good from a purely financial or environmental perspective might have unintended social consequences. The Sustainability Council was built to address this complexity.
                    </p>
                    <p className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                        Our mission is to provide a decision-support tool that encourages users to think through problems from multiple angles—Environmental, Social, and Governance/Economic (ESG/CSR). By simulating a panel of diverse experts, we help you uncover hidden risks, identify new opportunities, and make more balanced, resilient, and responsible choices.
                    </p>
                </Card>
            </AnimatedSection>

            <AnimatedSection>
                <h2 className="text-3xl font-bold text-center mb-8">Meet the Council Personas</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {PERSONA_DETAILS.map((persona, index) => (
                        <Card key={persona.id} className="text-center transition-transform duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-strong)]">
                            <h3 className="text-lg font-semibold text-[var(--primary)]">{persona.title}</h3>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">"{persona.description}"</p>
                        </Card>
                    ))}
                </div>
            </AnimatedSection>

            <AnimatedSection>
                <Card>
                    <h2 className="text-2xl font-bold mb-4">How the AI Works</h2>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        The Sustainability Council is powered by Google's Gemini API. When you submit a scenario, we use a detailed system prompt that instructs the AI to act as a facilitator for a panel of expert personas. The AI orchestrates a "debate" where each persona analyzes your scenario from its unique viewpoint. The final output is a structured JSON object containing the synthesized insights, which we then render as the comprehensive CSR assessment you see on the results page.
                    </p>
                </Card>
            </AnimatedSection>
            
            <AnimatedSection>
                <Card className="border-[var(--accent)] border-2">
                    <h2 className="text-2xl font-bold mb-4">Limitations & Responsible Use</h2>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        <strong>This is a decision-support tool, not a decision-maker.</strong> The insights provided by the AI are based on the data it was trained on and the scenario you provide. It is not a substitute for professional, legal, or financial advice. Always combine the council's assessment with real-world data, local context, and the judgment of human experts.
                    </p>
                </Card>
            </AnimatedSection>
        </div>
    </div>
  );
};

export default AboutPage;
