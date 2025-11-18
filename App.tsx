
import React, { useState, useCallback, useMemo } from 'react';
import { Page } from './types';
import { AuthProvider, useAuth } from './context/AuthContext';
import useLocalStorage from './hooks/useLocalStorage';
import Navbar from './components/layout/Navbar';
import HomePage from './components/pages/HomePage';
import AboutPage from './components/pages/AboutPage';
import CouncilPage from './components/pages/CouncilPage';
import ChatbotWidget from './components/chatbot/ChatbotWidget';

const AppContent: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<Page>(Page.HOME);
    const { loggedIn } = useAuth();
    const [theme, setTheme] = useLocalStorage<string>('theme', 'dark');

    const toggleTheme = useCallback(() => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    }, [theme, setTheme]);
    
    React.useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const renderPage = useMemo(() => {
        switch (currentPage) {
            case Page.HOME:
                return <HomePage setCurrentPage={setCurrentPage} />;
            case Page.ABOUT:
                return <AboutPage />;
            case Page.COUNCIL:
                return <CouncilPage />;
            default:
                return <HomePage setCurrentPage={setCurrentPage} />;
        }
    }, [currentPage, setCurrentPage]);

    return (
        <div className="bg-[var(--bg)] text-[var(--text)] min-h-screen transition-colors duration-300">
            <Navbar
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                theme={theme}
                toggleTheme={toggleTheme}
            />
            <main>
                {renderPage}
            </main>
            {loggedIn && <ChatbotWidget />}
        </div>
    );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
        <AppContent />
    </AuthProvider>
  );
};

export default App;