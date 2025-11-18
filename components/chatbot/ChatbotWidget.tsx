
import React, { useState, useRef, useEffect } from 'react';
import Card from '../ui/Card';
import { ChatIcon, CloseIcon, SendIcon } from '../../constants';
import { chatbotQuery } from '../../services/geminiService';
import Spinner from '../ui/Spinner';

interface Message {
    sender: 'user' | 'bot';
    text: string;
}

const ChatbotWidget: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { sender: 'bot', text: "Hi! I'm your CSR Coach. How can I help you understand your results or prepare a new scenario?" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;
        
        const userMessage: Message = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const chatHistory = messages.map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }]
            }));
            const botResponseText = await chatbotQuery(chatHistory, input);
            const botMessage: Message = { sender: 'bot', text: botResponseText };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error("Chatbot error:", error);
            const errorMessage: Message = { sender: 'bot', text: "Sorry, I'm having trouble connecting right now." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-6 right-6 w-16 h-16 rounded-full bg-[var(--primary)] text-white shadow-[var(--shadow-strong)] flex items-center justify-center transition-transform duration-300 hover:scale-110 ${isOpen ? 'scale-0' : 'scale-100'}`}
                aria-label="Open CSR Coach"
            >
                <ChatIcon className="w-8 h-8" />
            </button>

            <div className={`fixed bottom-6 right-6 transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
                <Card className="w-80 h-[28rem] flex flex-col">
                    <div className="flex justify-between items-center mb-4 pb-2 border-b border-[var(--border)]">
                        <h3 className="font-bold">CSR Coach</h3>
                        <button onClick={() => setIsOpen(false)} aria-label="Close CSR Coach">
                            <CloseIcon className="w-6 h-6 text-gray-500 hover:text-[var(--text)]" />
                        </button>
                    </div>
                    <div className="flex-grow overflow-y-auto pr-2 space-y-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`px-4 py-2 rounded-2xl max-w-[80%] ${msg.sender === 'user' ? 'bg-[var(--primary)] text-white rounded-br-none' : 'bg-gray-200 dark:bg-slate-700 text-[var(--text)] rounded-bl-none'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                         {isLoading && (
                            <div className="flex justify-start">
                                <div className="px-4 py-2 rounded-2xl bg-gray-200 dark:bg-slate-700 text-[var(--text)] rounded-bl-none">
                                    <Spinner />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="mt-4 pt-2 border-t border-[var(--border)] flex items-center">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask a question..."
                            className="flex-grow bg-transparent focus:outline-none"
                            disabled={isLoading}
                        />
                        <button onClick={handleSend} disabled={isLoading || !input.trim()} className="text-[var(--primary)] disabled:text-gray-400">
                            <SendIcon className="w-6 h-6" />
                        </button>
                    </div>
                </Card>
            </div>
        </>
    );
};

export default ChatbotWidget;
