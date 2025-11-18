import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import ScenarioInputPanel from '../council/ScenarioInputPanel';
import CouncilResults from '../council/CouncilResults';
import FinishSessionOverlay from '../council/FinishSessionOverlay';
import { CouncilResult } from '../../types';
import { runCouncilDebate, describeImage } from '../../services/geminiService';
import Spinner from '../ui/Spinner';

type CouncilStatus = 'idle' | 'loading' | 'success' | 'error';

const NotLoggedInView: React.FC = () => (
    <div className="text-center">
        <h2 className="text-2xl font-bold">Access Denied</h2>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Please log in to access the Council.</p>
    </div>
);

const CouncilPage: React.FC = () => {
    const { loggedIn } = useAuth();
    const [status, setStatus] = useState<CouncilStatus>('idle');
    const [councilResult, setCouncilResult] = useState<CouncilResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isFinishOverlayVisible, setFinishOverlayVisible] = useState(false);

    // State lifted from ScenarioInputPanel
    const [scenario, setScenario] = useState('');
    const [scenarioType, setScenarioType] = useState('Cities & Transport');
    const [imageFile, setImageFile] = useState<File | undefined>();
    const [imagePreview, setImagePreview] = useState<string | undefined>();


    const handleRunCouncil = async (currentScenario: string, currentScenarioType: string, currentImageFile?: File) => {
        setStatus('loading');
        setError(null);
        setCouncilResult(null);

        try {
            let imageContext: string | undefined;
            if (currentImageFile) {
                const reader = new FileReader();
                const base64String = await new Promise<string>((resolve, reject) => {
                    reader.onload = () => resolve((reader.result as string).split(',')[1]);
                    reader.onerror = error => reject(error);
                    reader.readAsDataURL(currentImageFile);
                });
                imageContext = await describeImage(base64String, currentImageFile.type);
            }
            
            const result = await runCouncilDebate(currentScenario, currentScenarioType, imageContext);
            setCouncilResult(result);
            setStatus('success');
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred.');
            setStatus('error');
        }
    };
    
    const startNewSession = () => {
        setStatus('idle');
        setCouncilResult(null);
        setError(null);
        setFinishOverlayVisible(false);
        // Clear scenario inputs
        setScenario('');
        setScenarioType('Cities & Transport');
        setImageFile(undefined);
        setImagePreview(undefined);
    }
    
    if (!loggedIn) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] pt-16">
                <NotLoggedInView />
            </div>
        );
    }

    const showInputPanel = status === 'idle' || status === 'loading' || status === 'error';

    return (
        <div className="pt-24 pb-16 bg-[var(--bg)] min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <header className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold tracking-tight">Run a Sustainability Council Session</h1>
                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                        Describe your scenario and let the council evaluate it through a CSR lens.
                    </p>
                </header>

                {showInputPanel && (
                    <ScenarioInputPanel
                        onRunCouncil={handleRunCouncil}
                        isLoading={status === 'loading'}
                        scenario={scenario}
                        setScenario={setScenario}
                        scenarioType={scenarioType}
                        setScenarioType={setScenarioType}
                        imageFile={imageFile}
                        setImageFile={setImageFile}
                        imagePreview={imagePreview}
                        setImagePreview={setImagePreview}
                    />
                )}
                
                {status === 'loading' && (
                     <div className="mt-12 text-center p-8 border-2 border-dashed border-[var(--border)] rounded-[var(--radius-card)]">
                        <Spinner className="mx-auto !w-12 !h-12 text-[var(--primary)]" />
                        <p className="mt-4 text-lg font-semibold animate-pulse">The council is debating your scenario...</p>
                        <p className="text-gray-500 mt-2">This may take a moment.</p>
                    </div>
                )}

                {status === 'error' && (
                    <div className="mt-12 text-center p-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-[var(--radius-card)]">
                        <h3 className="text-xl font-bold text-red-700 dark:text-red-300">An Error Occurred</h3>
                        <p className="mt-2 text-red-600 dark:text-red-400">{error}</p>
                        <button onClick={() => setStatus('idle')} className="mt-6 px-4 py-2 bg-[var(--primary)] text-white font-semibold rounded-md hover:bg-[var(--primary-hover)] transition-colors">
                            Try Again
                        </button>
                    </div>
                )}
                
                {status === 'success' && councilResult && (
                    <CouncilResults result={councilResult} onFinish={() => setFinishOverlayVisible(true)} />
                )}

                {isFinishOverlayVisible && (
                    <FinishSessionOverlay 
                        onClose={() => setFinishOverlayVisible(false)} 
                        onNewSession={startNewSession} 
                    />
                )}
            </div>
        </div>
    );
};

export default CouncilPage;