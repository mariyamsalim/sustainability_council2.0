import React from 'react';

export const LogoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16 29.3333C23.364 29.3333 29.3333 23.364 29.3333 16C29.3333 8.63604 23.364 2.66667 16 2.66667C8.63604 2.66667 2.66667 8.63604 2.66667 16C2.66667 23.364 8.63604 29.3333 16 29.3333Z"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path 
      d="M13.3333,8 C13.3333,8 9.3333,10 9.3333,14.6667 C9.3333,19.3333 13.3333,21.3333 13.3333,21.3333 C13.3333,21.3333 15.3333,18.6667 15.3333,14.6667 C15.3333,10.6667 13.3333,8 13.3333,8 Z"
      fill="currentColor"
    />
    <path d="M18.6667 22V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M21.3333 22V13.3333" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M24 22V18.6667" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);


export const LeafIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66C7.23 18.05 9 13 17 11V8m-5-2a2 2 0 0 1-2-2c0-1.11.89-2 2-2s2 .89 2 2a2 2 0 0 1-2 2M2 2v2h2V2H2m4 0v2h2V2H6m4 0v2h2V2h-2z" />
    </svg>
);

export const SunIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM12 9c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zM3.55 19.09l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8zM11 1h2v3h-2V1zm9.04 4.49l1.41-1.41-1.8-1.79-1.41 1.41 1.8 1.79zM19.09 17.28l1.41 1.41 1.8-1.79-1.41-1.41-1.8 1.79zM1 11v2h3v-2H1zm17.28-1.41l1.41-1.41 1.79 1.8-1.41 1.41-1.79-1.8zM4.95 6.36l1.41-1.41 1.79 1.8-1.41 1.41-1.79-1.8zM13 23h-2v-3h2v3z" />
    </svg>
);

export const MoonIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4-4.54A5.5 5.5 0 0 1 12 3z" />
    </svg>
);

export const ChatIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
    </svg>
);

export const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
    </svg>
);

export const SendIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
    </svg>
);

export const PERSONA_DETAILS = [
    { id: 'climate_scientist', title: 'Climate Scientist', description: 'Cares about emissions, climate risk, carbon budgets.' },
    { id: 'carbon_footprint_analyst', title: 'Carbon Footprint Analyst', description: 'Cares about tonnes CO₂e, emission drivers, reduction levers.' },
    { id: 'biodiversity_ecologist', title: 'Biodiversity Ecologist', description: 'Cares about habitats, species, nature-based solutions.' },
    { id: 'community_representative', title: 'Community Representative', description: 'Cares about livelihoods, equity, culture, health.' },
    { id: 'urban_planner', title: 'Urban Planner / Infrastructure Engineer', description: 'Cares about feasibility, safety, integration.' },
    { id: 'business_strategy_lead', title: 'Business Strategy / CSR Lead', description: 'Cares about brand, ESG, long-term value.' },
    { id: 'public_finance_minister', title: 'Public Finance Minister / Budget Officer', description: 'Cares about public budgets and fiscal risk.' },
];