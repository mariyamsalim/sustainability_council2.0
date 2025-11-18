import React, { useRef, useState } from 'react';
import { CouncilResult, Persona, ImprovementSuggestion, SimpleExplanation } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import { improvePlan, explainInSimpleWords, generateReport } from '../../services/geminiService';

const AnimatedSection: React.FC<{ children: React.ReactNode, className?: string, delay?: string }> = ({ children, className, delay = 'delay-0' }) => {
    const ref = useRef<HTMLDivElement>(null);
    const isVisible = useIntersectionObserver(ref, { threshold: 0.1, freezeOnceVisible: true });
    return (
        <div ref={ref} className={`transition-all duration-500 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} ${className} ${delay}`}>
            {children}
        </div>
    );
};

const PersonaCard: React.FC<{ persona: Persona }> = ({ persona }) => (
    <Card className="h-full">
        <h3 className="font-bold text-lg text-[var(--primary)]">{persona.title}</h3>
        <div className="flex flex-wrap gap-1 my-2">
            {persona.primary_concerns.map(concern => (
                <span key={concern} className="text-xs bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">{concern}</span>
            ))}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">{persona.statement}</p>
    </Card>
);

const ratingToValue = { 'Low': 1, 'Medium': 2, 'High': 3, 'Very High': 4 };
const maxRating = 4;

const CSRRadarChart: React.FC<{ assessment: CouncilResult['csr_assessment'] }> = ({ assessment }) => {
    const e = (ratingToValue[assessment.environmental.rating] / maxRating) * 100;
    const s = (ratingToValue[assessment.social.rating] / maxRating) * 100;
    const g = (ratingToValue[assessment.governance_economic.rating] / maxRating) * 100;
    
    // Points for the triangle (E, S, G)
    const e_x = 50;
    const e_y = 100 - e;
    const s_x = 50 + s * 0.866; // cos(30)
    const s_y = 100 - s * 0.5;   // sin(30)
    const g_x = 50 - g * 0.866;
    const g_y = 100 - g * 0.5;

    return (
        <div className="relative w-full aspect-square max-w-[200px] mx-auto">
            <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Background Grid */}
                {[25, 50, 75, 100].map(val => (
                     <polygon key={val} points={`${50},${100-val} ${50 + val * 0.866},${100-val*0.5} ${50 - val * 0.866},${100-val*0.5}`} fill="none" stroke="var(--border)" strokeWidth="0.5" />
                ))}
                <line x1="50" y1="0" x2="50" y2="100" stroke="var(--border)" strokeWidth="0.5" />
                <line x1="50" y1="100" x2={50 + 100 * 0.866} y2="50" stroke="var(--border)" strokeWidth="0.5" />
                <line x1="50" y1="100" x2={50 - 100 * 0.866} y2="50" stroke="var(--border)" strokeWidth="0.5" />
                
                {/* Data Polygon */}
                <polygon points={`${e_x},${e_y} ${s_x},${s_y} ${g_x},${g_y}`} fill="var(--primary)" fillOpacity="0.5" stroke="var(--primary)" strokeWidth="1.5" />
            </svg>
            <span className="absolute top-[-10px] left-1/2 -translate-x-1/2 text-xs font-bold">E</span>
            <span className="absolute bottom-[20px] right-[-10px] text-xs font-bold">S</span>
            <span className="absolute bottom-[20px] left-[-10px] text-xs font-bold">G</span>
        </div>
    );
};

const CouncilResults: React.FC<{ result: CouncilResult; onFinish: () => void; }> = ({ result, onFinish }) => {
    type Tool = 'improve' | 'explain' | 'report';
    const [loadingTool, setLoadingTool] = useState<Tool | null>(null);
    const [improvement, setImprovement] = useState<ImprovementSuggestion | null>(null);
    const [explanation, setExplanation] = useState<SimpleExplanation | null>(null);
    const [report, setReport] = useState<string | null>(null);

    const handleToolClick = async (tool: Tool) => {
        setLoadingTool(tool);
        try {
            if (tool === 'improve') {
                const res = await improvePlan(result);
                setImprovement(res);
            } else if (tool === 'explain') {
                const res = await explainInSimpleWords(result);
                setExplanation(res);
            } else if (tool === 'report') {
                const res = await generateReport(result);
                setReport(res);
            }
        } catch (error) {
            console.error(`Error with tool ${tool}:`, error);
        } finally {
            setLoadingTool(null);
        }
    };

    return (
        <div className="space-y-12">
             <AnimatedSection>
                <p className="text-center mb-4 text-gray-500">Step 3: Review the personas’ views and the CSR assessment.</p>
                <Card>
                    <h2 className="text-2xl font-bold mb-2">Scenario Summary</h2>
                    <p className="mb-4">{result.scenario_summary}</p>
                    <h3 className="font-semibold mb-2">Key Assumptions Made by the Council:</h3>
                    <div className="flex flex-wrap gap-2">
                        {result.assumptions.map((assumption, i) => (
                            <span key={i} className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300 text-sm rounded-full">{assumption}</span>
                        ))}
                    </div>
                </Card>
            </AnimatedSection>
            
            <AnimatedSection>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {result.personas.map((persona, index) => (
                        <AnimatedSection key={persona.id} delay={`delay-${index * 100}`}>
                            <PersonaCard persona={persona} />
                        </AnimatedSection>
                    ))}
                </div>
            </AnimatedSection>

            <div className="grid lg:grid-cols-3 gap-8 items-start">
                <AnimatedSection className="lg:col-span-2">
                    <Card>
                        <h2 className="text-2xl font-bold mb-4">CSR Assessment</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {(Object.keys(result.csr_assessment) as Array<keyof typeof result.csr_assessment>).map((key) => {
                                const value = result.csr_assessment[key];
                                return (
                                    <div key={key}>
                                        {/* FIX: Explicitly cast `key` to a string to use the `replace` method, as TypeScript may incorrectly infer its type as `string | number | symbol`. */}
                                        <h3 className="font-bold text-lg capitalize">{String(key).replace('_', ' / ')}</h3>
                                        <p className="font-semibold text-[var(--primary)]">{value.rating} Impact</p>
                                        <ul className="list-disc list-inside text-sm mt-2 space-y-1 text-gray-600 dark:text-gray-400">
                                            {value.key_points.map(point => <li key={point}>{point}</li>)}
                                        </ul>
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                </AnimatedSection>
                <AnimatedSection>
                     <Card>
                        <h2 className="text-xl font-bold text-center mb-2">Impact Radar</h2>
                        <CSRRadarChart assessment={result.csr_assessment} />
                    </Card>
                </AnimatedSection>
            </div>

            <AnimatedSection>
                <Card>
                    <h2 className="text-2xl font-bold mb-4">Options & Recommendation</h2>
                    <div className="space-y-4">
                        {result.options_and_recommendation.option_summaries.map(opt => (
                            <div key={opt.option_name} className="p-4 border border-[var(--border)] rounded-md">
                                <h3 className="font-bold">{opt.option_name}</h3>
                                <p className="text-sm">{opt.description}</p>
                                <p className="text-xs mt-1 text-gray-500"><strong>CSR Implications:</strong> {opt.csr_implications}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 p-4 bg-teal-50 dark:bg-teal-900/30 border-l-4 border-teal-500 rounded-r-md">
                        <h3 className="font-bold text-teal-800 dark:text-teal-200">
                            <span className="text-xs bg-teal-500 text-white font-bold px-2 py-1 rounded-full mr-2">RECOMMENDED</span>
                            {result.options_and_recommendation.recommended_option}
                        </h3>
                    </div>
                </Card>
            </AnimatedSection>

            <AnimatedSection>
                <h2 className="text-2xl font-bold text-center">Step 4: Improve, Simplify, or Export</h2>
                <div className="mt-6 flex flex-wrap justify-center gap-4">
                    <Button variant="secondary" onClick={() => handleToolClick('improve')} isLoading={loadingTool === 'improve'}>Improve this Plan</Button>
                    <Button variant="secondary" onClick={() => handleToolClick('explain')} isLoading={loadingTool === 'explain'}>Explain in Simple Words</Button>
                    <Button variant="secondary" onClick={() => handleToolClick('report')} isLoading={loadingTool === 'report'}>Generate Report</Button>
                    <Button onClick={onFinish}>Finish Session</Button>
                </div>
            </AnimatedSection>

            {improvement && <AnimatedSection><Card><h3 className="text-xl font-bold mb-2">Improvement Suggestions</h3><ul className="list-disc pl-5 space-y-1">{improvement.suggested_changes.map(c => <li key={c}>{c}</li>)}</ul><p className="mt-3 text-sm italic">{improvement.impact_shift_comment}</p></Card></AnimatedSection>}
            {explanation && <AnimatedSection><Card><h3 className="text-xl font-bold mb-2">Simple Explanation</h3><div className="space-y-3">{explanation.summary_paragraphs.map((p, i) => <p key={i}>{p}</p>)}</div><p className="mt-4 p-3 bg-gray-100 dark:bg-slate-700 rounded-md">{explanation.guidance}</p></Card></AnimatedSection>}
            {report && <AnimatedSection><Card><h3 className="text-xl font-bold mb-2">One-Page Report</h3><pre className="whitespace-pre-wrap font-sans bg-gray-50 dark:bg-slate-800 p-4 rounded-md overflow-x-auto">{report}</pre><Button onClick={() => navigator.clipboard.writeText(report)} className="mt-4">Copy Report</Button></Card></AnimatedSection>}

        </div>
    );
};

export default CouncilResults;