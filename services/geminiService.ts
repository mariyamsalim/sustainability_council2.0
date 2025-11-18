
import { GoogleGenAI, Type } from "@google/genai";
import type { CouncilResult, ImprovementSuggestion, SimpleExplanation } from '../types';

// IMPORTANT: The API key must be set in the environment variables.
// Do not hardcode the API key here.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    console.warn("API_KEY environment variable not set. Please set it to use the Gemini API.");
}

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });

const COUNCIL_RESULT_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        scenario_summary: { type: Type.STRING, description: "A concise, neutral summary of the user's scenario." },
        assumptions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Key assumptions the council made to evaluate the scenario." },
        personas: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING },
                    title: { type: Type.STRING },
                    primary_concerns: { type: Type.ARRAY, items: { type: Type.STRING } },
                    statement: { type: Type.STRING, description: "The persona's detailed analysis and opinion on the scenario." }
                },
                required: ["id", "title", "primary_concerns", "statement"]
            }
        },
        csr_assessment: {
            type: Type.OBJECT,
            properties: {
                environmental: { 
                    type: Type.OBJECT, 
                    properties: { 
                        rating: { type: Type.STRING, enum: ["Low", "Medium", "High", "Very High"] }, 
                        key_points: { type: Type.ARRAY, items: { type: Type.STRING } } 
                    },
                    required: ["rating", "key_points"]
                },
                social: { 
                    type: Type.OBJECT, 
                    properties: { 
                        rating: { type: Type.STRING, enum: ["Low", "Medium", "High", "Very High"] }, 
                        key_points: { type: Type.ARRAY, items: { type: Type.STRING } } 
                    },
                    required: ["rating", "key_points"]
                },
                governance_economic: { 
                    type: Type.OBJECT, 
                    properties: { 
                        rating: { type: Type.STRING, enum: ["Low", "Medium", "High", "Very High"] }, 
                        key_points: { type: Type.ARRAY, items: { type: Type.STRING } } 
                    },
                    required: ["rating", "key_points"]
                }
            },
            required: ["environmental", "social", "governance_economic"]
        },
        options_and_recommendation: {
            type: Type.OBJECT,
            properties: {
                option_summaries: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            option_name: { type: Type.STRING },
                            description: { type: Type.STRING },
                            csr_implications: { type: Type.STRING }
                        },
                        required: ["option_name", "description", "csr_implications"]
                    }
                },
                recommended_option: { type: Type.STRING, description: "The name of the recommended option." }
            },
            required: ["option_summaries", "recommended_option"]
        }
    },
    required: ["scenario_summary", "assumptions", "personas", "csr_assessment", "options_and_recommendation"]
};

const getSystemInstruction = () => `
You are the facilitator of the "Sustainability Council", a panel of expert personas designed to analyze complex sustainability decisions. Your role is to receive a user's scenario, guide the council's debate, and structure their collective insights into a comprehensive CSR (Corporate Social Responsibility) assessment.

THE COUNCIL PERSONAS:
1.  **Climate Scientist**: Focuses on greenhouse gas emissions, climate change risks, alignment with carbon budgets, and long-term climate resilience. ID: "climate_scientist".
2.  **Carbon Footprint Analyst**: Quantifies impact in tonnes of CO₂ equivalent (tCO₂e). Identifies primary emission drivers and suggests specific reduction levers. ID: "carbon_footprint_analyst".
3.  **Biodiversity Ecologist**: Analyzes impacts on local ecosystems, habitats, and species. Advocates for nature-based solutions and biodiversity net gain. ID: "biodiversity_ecologist".
4.  **Community Representative**: Represents the interests of affected communities. Focuses on social equity, public health, cultural heritage, livelihoods, and just transitions. ID: "community_representative".
5.  **Urban Planner / Infrastructure Engineer**: Assesses technical feasibility, integration with existing systems, safety, regulatory compliance, and long-term operational viability. ID: "urban_planner".
6.  **Business Strategy / CSR Lead**: Evaluates the scenario from a corporate or organizational perspective, focusing on brand reputation, ESG (Environmental, Social, Governance) ratings, stakeholder relations, and long-term value creation. ID: "business_strategy_lead".
7.  **Public Finance Minister / Budget Officer**: Scrutinizes the economic and fiscal implications, including public budgets, funding mechanisms, return on investment, and potential fiscal risks or liabilities. ID: "public_finance_minister".

YOUR TASK:
Given the user's scenario, you must moderate a simulated debate among these personas and then synthesize the outcome into a single, valid JSON object that strictly adheres to the provided schema. Each persona must provide a statement reflecting their unique perspective. The final output must be a JSON object and nothing else.
`;

export const runCouncilDebate = async (scenario: string, scenarioType: string, imageContext?: string): Promise<CouncilResult> => {
    const prompt = `
    User Scenario Type: "${scenarioType}"
    User Scenario Description: "${scenario}"
    ${imageContext ? `\nImage Context: "${imageContext}"` : ''}
    
    Please analyze this scenario and provide the full CSR assessment as a JSON object.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: getSystemInstruction(),
                responseMimeType: "application/json",
                responseSchema: COUNCIL_RESULT_SCHEMA,
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as CouncilResult;
    } catch (error) {
        console.error("Error running council debate:", error);
        throw new Error("Failed to get a valid response from the Sustainability Council. Please try again.");
    }
};

export const getScenarioCoachAdvice = async (scenario: string): Promise<string> => {
    const prompt = `
    A user is writing a sustainability scenario. Here is their draft:
    "${scenario}"
    
    Your task is to act as a "Scenario Coach". In 1-2 short sentences, suggest one or two key pieces of information they could add to make the scenario more specific and easier for an expert panel to analyze. Focus on common omissions like timeframe, budget, scale, or specific location. Be encouraging and concise.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });
    return response.text;
};


export const describeImage = async (base64Image: string, mimeType: string): Promise<string> => {
    const imagePart = {
        inlineData: {
            data: base64Image,
            mimeType: mimeType,
        },
    };
    const textPart = { text: "Briefly describe this image in the context of a sustainability project site. What are the key environmental or man-made features visible?" };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, textPart] },
    });
    return response.text;
};

export const improvePlan = async (councilResult: CouncilResult): Promise<ImprovementSuggestion> => {
    const prompt = `
    Based on the following sustainability council assessment, generate concrete suggestions to improve the original plan.
    
    Assessment Data: ${JSON.stringify(councilResult)}
    
    Your task is to return a JSON object with two keys:
    1. "suggested_changes": An array of strings, where each string is a specific, actionable change to the project to improve its CSR profile.
    2. "impact_shift_comment": A short string commenting on how these changes might positively shift the Environmental, Social, and Governance ratings.

    Example output: { "suggested_changes": ["Incorporate permeable paving...", "Establish a community benefit fund..."], "impact_shift_comment": "These changes would likely improve the Social rating to 'High' and mitigate some Environmental concerns." }
    `;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    suggested_changes: { type: Type.ARRAY, items: { type: Type.STRING } },
                    impact_shift_comment: { type: Type.STRING }
                },
                required: ["suggested_changes", "impact_shift_comment"]
            }
        }
    });
    return JSON.parse(response.text) as ImprovementSuggestion;
}

export const explainInSimpleWords = async (councilResult: CouncilResult): Promise<SimpleExplanation> => {
    const prompt = `
    Translate the following complex CSR assessment into simple, plain language.
    
    Assessment Data: ${JSON.stringify(councilResult)}
    
    Your task is to return a JSON object with two keys:
    1. "summary_paragraphs": An array of 3-4 strings, where each string is a paragraph summarizing the key findings in an easy-to-understand way.
    2. "guidance": A short paragraph starting with "If you are a..." that gives tailored advice for a key stakeholder (e.g., a mayor, CEO, or citizen).

    Example output: { "summary_paragraphs": ["In simple terms, the project is good for...", "However, the experts are concerned about..."], "guidance": "If you are the mayor, your main takeaway should be to focus on community engagement before proceeding." }
    `;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    summary_paragraphs: { type: Type.ARRAY, items: { type: Type.STRING } },
                    guidance: { type: Type.STRING }
                },
                required: ["summary_paragraphs", "guidance"]
            }
        }
    });
    return JSON.parse(response.text) as SimpleExplanation;
}

export const generateReport = async (councilResult: CouncilResult): Promise<string> => {
    const prompt = `
    Based on the provided CSR assessment data in JSON format, generate a plain text report. The report must follow the exact section titles, order, and content guidelines below. Output only the plain text of the report, with no extra formatting like Markdown or JSON.

    Assessment Data: ${JSON.stringify(councilResult)}

    ---

    **Report Generation Instructions:**

    **Title Line:** Start with "Sustainability Council Report: " followed by a short, descriptive title derived from the scenario_summary.

    **Section 1:** Use the exact title "1. Scenario overview". Write 3-5 sentences summarizing the project, using information from 'scenario_summary' and 'assumptions'.

    **Section 2:** Use the exact title "2. Key perspectives from the council". Write 3-6 one-sentence lines. Each line must start with the persona's 'title' and a colon (e.g., "Climate Scientist: ..."), summarizing their 'statement'.

    **Section 3:** Use the exact title "3. CSR assessment (Environmental, Social, Governance/Economic)". Write a short paragraph summarizing the 'rating' and 'key_points' from the 'csr_assessment' object for all three categories.

    **Section 4:** Use the exact title "4. Options considered". For each option in 'options_and_recommendation.option_summaries', write 2-3 sentences describing it.

    **Section 5:** Use the exact title "5. Recommended option and next steps". Write 3-5 sentences identifying the 'recommended_option', explaining the choice, and suggesting clear next steps.
    `;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });
    return response.text;
}

export const chatbotQuery = async (history: {role: string, parts: {text: string}[]}[], question: string): Promise<string> => {
    const systemInstruction = `
    You are a helpful "CSR Coach" chatbot for the "Sustainability Council" application. Your purpose is to help users understand the app and general sustainability concepts.
    
    Your knowledge base includes:
    - How to write a good scenario: Advise users to be specific about location, scale, timeframe, budget, and affected communities.
    - What ESG/CSR means: Explain Environmental (impact on planet), Social (impact on people), and Governance/Economic (how it's managed, financial viability).
    - Persona focuses: Briefly explain what each of the 7 personas cares about (e.g., "The Climate Scientist focuses on emissions and climate risk.").
    - General tasks: You can help summarize results into bullet points for presentations or explain concepts.
    
    Guidelines:
    - Be friendly, concise, and encouraging.
    - Do NOT answer questions outside of sustainability, CSR, or how to use this application.
    - Do NOT invent new council results or run a new debate. You are a coach, not the council itself.
    - Keep answers short and to the point.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [...history, { role: 'user', parts: [{ text: question }] }],
        config: { systemInstruction }
    });
    
    return response.text;
}
