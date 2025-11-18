import React, { useState, useRef, useEffect } from 'react';
import { Page } from '../../types';
import { useAuth } from '../../context/AuthContext';
import Modal from '../ui/Modal';
import { LogoIcon, SunIcon, MoonIcon } from '../../constants';

interface NavbarProps {
    currentPage: Page;
    setCurrentPage: (page: Page) => void;
    theme: string;
    toggleTheme: () => void;
}

const NavLink: React.FC<{
    page: Page;
    currentPage: Page;
    setCurrentPage: (page: Page) => void;
    children: React.ReactNode;
}> = ({ page, currentPage, setCurrentPage, children }) => {
    const isActive = currentPage === page;
    return (
        <button
            onClick={() => setCurrentPage(page)}
            className={`px-4 py-2 text-sm font-medium rounded-[var(--radius-pill)] transition-all duration-300 ${isActive ? 'bg-[var(--primary)] text-white' : 'text-slate-300 hover:bg-slate-700/50'}`}
        >
            {children}
        </button>
    );
};

const LoginModal: React.FC<{ isOpen: boolean; onClose: () => void; onLogin: (name: string) => void }> = ({ isOpen, onClose, onLogin }) => {
    const [name, setName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onLogin(name.trim());
        }
    };
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Login to Sustainability Council">
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-2 bg-white dark:bg-[var(--bg-card)] text-[var(--text)] border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    autoFocus
                />
                <button type="submit" className="w-full px-4 py-2 bg-[var(--primary)] text-white font-semibold rounded-md hover:bg-[var(--primary-hover)] transition-colors">
                    Continue
                </button>
            </form>
        </Modal>
    );
};


const Navbar: React.FC<NavbarProps> = ({ currentPage, setCurrentPage, theme, toggleTheme }) => {
    const { loggedIn, userName, login, logout } = useAuth();
    const [isLoginModalOpen, setLoginModalOpen] = useState(false);
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const isHomePage = currentPage === Page.HOME;

    const handleLogin = (name: string) => {
        login(name);
        setLoginModalOpen(false);
        setCurrentPage(Page.COUNCIL);
    };

    const handleLogout = () => {
        logout();
        setDropdownOpen(false);
        setCurrentPage(Page.HOME);
    };

    const getInitials = (name: string | null) => {
        if (!name) return '';
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <>
            <header className={`fixed top-0 left-0 right-0 z-40 h-16 transition-all duration-300 ${isHomePage ? 'bg-slate-900/80 backdrop-blur-sm' : 'bg-slate-900 shadow-md'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                    <div className="flex items-center justify-between h-full">
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage(Page.HOME)}>
                            <LogoIcon className="w-8 h-8 text-[var(--primary)]" />
                            <span className="text-white text-xl font-bold">Sustainability Council</span>
                        </div>
                        <nav className="hidden md:flex items-center gap-2">
                            <NavLink page={Page.HOME} currentPage={currentPage} setCurrentPage={setCurrentPage}>Home</NavLink>
                            <button
                                onClick={() => {
                                    if (loggedIn) {
                                        setCurrentPage(Page.COUNCIL);
                                    } else {
                                        setLoginModalOpen(true);
                                    }
                                }}
                                className={`px-4 py-2 text-sm font-medium rounded-[var(--radius-pill)] transition-all duration-300 ${currentPage === Page.COUNCIL ? 'bg-[var(--primary)] text-white' : 'text-slate-300 hover:bg-slate-700/50'}`}
                            >
                                Council
                            </button>
                            <NavLink page={Page.ABOUT} currentPage={currentPage} setCurrentPage={setCurrentPage}>About</NavLink>
                        </nav>
                        <div className="flex items-center gap-4">
                            <button onClick={toggleTheme} className="text-slate-300 hover:text-white transition-colors">
                                {theme === 'light' ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
                            </button>
                            <div className="relative" ref={dropdownRef}>
                                {loggedIn ? (
                                    <>
                                        <button onClick={() => setDropdownOpen(prev => !prev)} className="w-9 h-9 bg-[var(--primary)] rounded-full flex items-center justify-center text-white font-bold text-sm">
                                            {getInitials(userName)}
                                        </button>
                                        {isDropdownOpen && (
                                            <div className="absolute right-0 mt-2 w-48 bg-[var(--bg-card)] rounded-md shadow-[var(--shadow-strong)] border border-[var(--border)] py-1">
                                                <button
                                                    onClick={handleLogout}
                                                    className="block w-full text-left px-4 py-2 text-sm text-[var(--text)] hover:bg-slate-100 dark:hover:bg-slate-700"
                                                >
                                                    Logout
                                                </button>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <button
                                        onClick={() => setLoginModalOpen(true)}
                                        className="px-4 py-2 text-sm font-medium rounded-[var(--radius-pill)] bg-slate-700/50 text-slate-300 hover:bg-slate-700"
                                    >
                                        Login
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <LoginModal isOpen={isLoginModalOpen} onClose={() => setLoginModalOpen(false)} onLogin={handleLogin} />
        </>
    );
};

export default Navbar;