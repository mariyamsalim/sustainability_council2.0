
import React, { useState, useRef } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { getScenarioCoachAdvice } from '../../services/geminiService';

interface ScenarioInputPanelProps {
  onRunCouncil: (scenario: string, scenarioType: string, imageFile?: File) => void;
  isLoading: boolean;
  scenario: string;
  setScenario: (value: string) => void;
  scenarioType: string;
  setScenarioType: (value: string) => void;
  imageFile: File | undefined;
  setImageFile: (file: File | undefined) => void;
  imagePreview: string | undefined;
  setImagePreview: (preview: string | undefined) => void;
}

const PRESET_SCENARIOS = [
    { 
        name: "Urban Cooling District",
        type: "Cities & Transport",
        scenario: "We are planning to redevelop a 5-block, car-centric downtown district into a 'cool island'. The plan involves replacing asphalt with permeable green paving, planting over 200 mature trees, installing green roofs on municipal buildings, and creating a new public park with a water feature. The goal is to reduce the urban heat island effect, improve air quality, and create a more pedestrian-friendly environment. The project is estimated to cost $25 million and will be completed over 3 years.",
        isDemo: true
    },
    { 
        name: "Coastal Wind Farm",
        type: "Energy & Renewables",
        scenario: "Proposal to construct a 50-turbine offshore wind farm 10 miles off the coast of a major port city. The project aims to generate 200 MW of clean energy, enough to power 150,000 homes. Concerns have been raised about the impact on marine ecosystems, fishing routes, and the visual impact from the shoreline.",
    },
    {
        name: "Factory Water Recycling",
        type: "Water & Drought",
        scenario: "A large manufacturing plant in a water-scarce region plans to invest in a closed-loop water recycling system. The system would reduce its freshwater intake from the local river by 90%, but it is energy-intensive to operate and produces a concentrated brine waste product that needs disposal.",
    }
];

const ScenarioInputPanel: React.FC<ScenarioInputPanelProps> = ({ 
    onRunCouncil, 
    isLoading,
    scenario,
    setScenario,
    scenarioType,
    setScenarioType,
    imageFile,
    setImageFile,
    imagePreview,
    setImagePreview
}) => {
    const [error, setError] = useState('');
    const [coachAdvice, setCoachAdvice] = useState('');
    const [isCoachLoading, setCoachLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleRunClick = () => {
        if (!scenario.trim()) {
            setError('Please describe your scenario before running the council.');
            return;
        }
        setError('');
        onRunCouncil(scenario, scenarioType, imageFile);
    };

    const handlePresetClick = (preset: typeof PRESET_SCENARIOS[0]) => {
        setScenario(preset.scenario);
        setScenarioType(preset.type);
        setImageFile(undefined);
        setImagePreview(undefined);
        setCoachAdvice('');
        setError('');
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImageFile(file);
            // Free up memory when the component unmounts
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
            setImagePreview(URL.createObjectURL(file));
        }
    };
    
    const handleGetCoachAdvice = async () => {
        if (!scenario.trim()) return;
        setCoachLoading(true);
        try {
            const advice = await getScenarioCoachAdvice(scenario);
            setCoachAdvice(advice);
        } catch (e) {
            setCoachAdvice("Sorry, the coach is unavailable right now.");
        } finally {
            setCoachLoading(false);
        }
    };

    return (
        <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
                <Card>
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="scenario" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Step 1: Describe your sustainability scenario
                            </label>
                            <textarea
                                id="scenario"
                                rows={10}
                                className="w-full p-3 bg-white dark:bg-slate-800 text-[var(--text)] border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] placeholder-gray-400 dark:placeholder-gray-500"
                                placeholder="e.g., Describe a plan to build a new solar farm, redevelop a city district, or change a corporate policy. Include details like location, scale, and who might be affected."
                                value={scenario}
                                onChange={(e) => {
                                    setScenario(e.target.value);
                                    if (error) setError('');
                                }}
                                disabled={isLoading}
                            />
                            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
                        </div>

                        <div className="grid sm:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="scenarioType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Scenario Type
                                </label>
                                <select
                                    id="scenarioType"
                                    className="w-full p-3 bg-white dark:bg-slate-800 text-[var(--text)] border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                                    value={scenarioType}
                                    onChange={(e) => setScenarioType(e.target.value)}
                                    disabled={isLoading}
                                >
                                    <option>Energy & Renewables</option>
                                    <option>Water & Drought</option>
                                    <option>Cities & Transport</option>
                                    <option>Buildings & Cooling</option>
                                    <option>Waste & Materials</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Optional: Upload an image
                                </label>
                                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" disabled={isLoading} />
                                <button onClick={() => fileInputRef.current?.click()} disabled={isLoading} className="w-full p-3 text-left bg-white dark:bg-slate-800 text-gray-500 border border-[var(--border)] rounded-md hover:border-[var(--primary)] truncate">
                                    {imageFile ? imageFile.name : 'Choose image for context...'}
                                </button>
                                {imagePreview && <img src={imagePreview} alt="Scenario preview" className="mt-2 rounded-md max-h-32"/>}
                            </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4 items-center pt-4 border-t border-[var(--border)]">
                            <Button onClick={handleRunClick} isLoading={isLoading} className="w-full sm:w-auto">
                                Step 2: Run Council Debate
                            </Button>
                            <div className="flex-grow">
                                {coachAdvice && (
                                    <div className="p-3 bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 rounded-md text-sm">
                                        <strong>Scenario Coach:</strong> {coachAdvice}
                                    </div>
                                )}
                            </div>
                            <Button variant="secondary" onClick={handleGetCoachAdvice} isLoading={isCoachLoading} disabled={isLoading || !scenario.trim()}>
                                Get Coach Advice
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
            <div className="space-y-4">
                <h3 className="font-semibold">Or start with a preset scenario:</h3>
                {PRESET_SCENARIOS.map(preset => (
                    <Card key={preset.name} onClick={() => handlePresetClick(preset)} className="cursor-pointer hover:border-[var(--primary)] hover:shadow-md relative">
                        {preset.isDemo && <span className="absolute top-2 right-2 text-xs font-bold bg-[var(--accent)] text-black px-2 py-0.5 rounded-full">Recommended Demo</span>}
                        <h4 className="font-bold">{preset.name}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{preset.type}</p>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ScenarioInputPanel;