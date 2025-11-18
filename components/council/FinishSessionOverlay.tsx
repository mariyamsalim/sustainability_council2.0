
import React from 'react';
import Button from '../ui/Button';

const Tree: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
    <svg style={style} className="absolute bottom-0 w-8 h-16 animate-grow" viewBox="0 0 32 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 64V12" stroke="var(--primary)" strokeOpacity="0.6" strokeWidth="4" />
        <path d="M16 24C24.8366 24 32 18.8366 32 10C32 1.16344 24.8366 -4 16 -4C7.16344 -4 0 1.16344 0 10C0 18.8366 7.16344 24 16 24Z" fill="var(--primary)" />
    </svg>
);

const FinishSessionOverlay: React.FC<{
    onClose: () => void;
    onNewSession: () => void;
}> = ({ onClose, onNewSession }) => {

    const trees = [
        { left: '15%', animationDelay: '0.2s' },
        { left: '30%', animationDelay: '0.6s' },
        { left: '50%', animationDelay: '0.3s' },
        { left: '75%', animationDelay: '0.8s' },
        { left: '85%', animationDelay: '0.5s' },
    ];

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <style>
                {`
                @keyframes grow {
                    0% { transform: scaleY(0); opacity: 0; }
                    70% { transform: scaleY(1.1); opacity: 1; }
                    100% { transform: scaleY(1); opacity: 1; }
                }
                .animate-grow {
                    animation: grow 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
                    transform-origin: bottom;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fadeIn 0.8s ease-out 0.5s forwards;
                    opacity: 0;
                }
                `}
            </style>
            <div className="bg-[var(--bg-card)] rounded-[var(--radius-card)] max-w-lg w-full p-8 text-center relative overflow-hidden shadow-[var(--shadow-strong)]">
                <div className="absolute bottom-0 left-0 right-0 h-24">
                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gray-200 dark:bg-slate-700" />
                     {trees.map((tree, i) => <Tree key={i} style={tree} />)}
                </div>

                <div className="relative z-10 animate-fade-in">
                    <h2 className="text-3xl font-bold">Session Complete</h2>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">
                        You've just explored this decision from multiple sustainability angles. Every better-informed choice helps grow a greener future.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                        <Button onClick={onNewSession}>Start a New Scenario</Button>
                        <Button variant="secondary" onClick={onClose}>Back to Results</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinishSessionOverlay;