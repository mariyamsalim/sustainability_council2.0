
export enum Page {
    HOME = 'HOME',
    ABOUT = 'ABOUT',
    COUNCIL = 'COUNCIL',
}

export interface Persona {
    id: string;
    title: string;
    primary_concerns: string[];
    statement: string;
}

export interface CSRAssessmentItem {
    rating: 'Low' | 'Medium' | 'High' | 'Very High';
    key_points: string[];
}

export interface CSRAssessment {
    environmental: CSRAssessmentItem;
    social: CSRAssessmentItem;
    governance_economic: CSRAssessmentItem;
}

export interface OptionSummary {
    option_name: string;
    description: string;
    csr_implications: string;
}

export interface CouncilResult {
    scenario_summary: string;
    assumptions: string[];
    personas: Persona[];
    csr_assessment: CSRAssessment;
    options_and_recommendation: {
        option_summaries: OptionSummary[];
        recommended_option: string;
    };
}

export interface SimpleExplanation {
    summary_paragraphs: string[];
    guidance: string;
}

export interface ImprovementSuggestion {
    suggested_changes: string[];
    impact_shift_comment: string;
}
