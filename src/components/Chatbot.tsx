import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Loader2, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { projects } from '@/data/projects';
import { photographerInfo } from '@/data/photographer';
import { techStack } from '@/data/techStack';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const GEMINI_API_KEY = 'AIzaSyBQZM0VDCri6LrWwrUuSAwUG1h5ttare4c';

// Common Q&A for instant offline answers
const COMMON_QA: Record<string, string> = {
  'hello': "Hello! 👋 I'm Anshul's portfolio assistant. How can I help you today?",
  'hi': "Hi there! 👋 Welcome to Anshul's portfolio. What would you like to know?",
  'hey': "Hey! 👋 I'm here to help you learn about Anshul's work. Ask me anything!",
  'who are you': "I'm Anshul Rathod's AI portfolio assistant. I can answer questions about his projects, skills, tech stack, and availability. Ask away!",
  'what do you do': "I help visitors learn about Anshul Rathod — his ML/AI projects, technical skills, work experience, and how to get in touch with him.",
  'contact': `You can reach Anshul at **${photographerInfo.email}**. You can also visit the [Contact page](/contact) to send a message directly, or connect on [LinkedIn](${photographerInfo.socialLinks.linkedin}) and [GitHub](${photographerInfo.socialLinks.github}).`,
  'email': `Anshul's email is **${photographerInfo.email}**. Feel free to reach out!`,
  'hire': `Great news — Anshul is currently **${photographerInfo.status}**! You can reach him at ${photographerInfo.email} or use the Contact page to send a message.`,
  'available': `Yes! Anshul is currently **${photographerInfo.status}**. Feel free to reach out via the Contact page or email him at ${photographerInfo.email}.`,
  'resume': "You can download Anshul's resume by clicking the **Resume** button on the homepage, or visiting the About page. The resume is also available as a PDF download.",
  'skills': `Anshul's core skills include:\n- **Languages:** Python, C++, TypeScript\n- **ML/AI:** PyTorch, Scikit-learn, NumPy, Pandas, MLflow\n- **Web:** FastAPI, React, Node.js\n- **Cloud:** AWS, Docker, PostgreSQL\n- **Tools:** Git, GitHub`,
  'projects': `Anshul has built 4 major projects:\n1. **AegisPay** — Fraud Detection with real-time risk scoring\n2. **Neuro-VX** — Cognitive health analysis\n3. **Customer Retention** — Churn prediction analytics\n4. **Intelligent CCTV** — Computer vision monitoring\n\nClick on any project card to learn more!`,
  'thank you': "You're welcome! 😊 Feel free to ask if you have more questions. Happy to help!",
  'thanks': "You're welcome! Let me know if there's anything else I can help with! 🙌",
  'bye': "Goodbye! 👋 Thanks for visiting Anshul's portfolio. Have a great day!",
};

function findCommonAnswer(text: string): string | null {
  const lower = text.toLowerCase().trim();
  // Exact match first
  if (COMMON_QA[lower]) return COMMON_QA[lower];
  // Partial match
  for (const [key, answer] of Object.entries(COMMON_QA)) {
    if (lower.includes(key) || key.includes(lower)) return answer;
  }
  return null;
}

function buildSystemPrompt(projectSlug?: string) {
  const projectsInfo = projects.map(p => 
    `- ${p.title} (${p.category}, ${p.year}): ${p.description} Technologies: ${p.technologies?.join(', ')}. ${p.detailedDescription ? `Overview: ${p.detailedDescription.overview} Core Concept: ${p.detailedDescription.coreConcept} Technical Approach: ${p.detailedDescription.technicalApproach}` : ''}`
  ).join('\n');

  const techInfo = techStack.map(c => `${c.name}: ${c.items.join(', ')}`).join('\n');

  const currentProject = projectSlug ? projects.find(p => p.slug === projectSlug) : null;
  const projectContext = currentProject ? `\n\nThe user is currently viewing the project "${currentProject.title}". Prioritize answering questions about this project, but you can also answer about other projects and Anshul's skills.` : '';

  return `You are Anshul Rathod's portfolio assistant. You help visitors learn about Anshul's projects, skills, and experience. Be professional, friendly, and concise.

About Anshul:
- Name: ${photographerInfo.name}
- Role: ${photographerInfo.tagline}
- Email: ${photographerInfo.email}
- Status: ${photographerInfo.status}
- Bio: ${photographerInfo.biography}

Tech Stack:
${techInfo}

Projects:
${projectsInfo}
${projectContext}

Guidelines:
- Answer questions about Anshul's projects, skills, tech stack, and experience accurately.
- If asked about something you don't know about Anshul, say so politely.
- Keep responses concise but informative. Use markdown formatting when helpful.
- For contact inquiries, direct them to the contact page or email.
- Do not make up information that isn't provided above.
- Be enthusiastic about the work but stay grounded and factual.`;
}

function getSuggestedQuestions(projectSlug?: string): string[] {
  if (projectSlug) {
    const questionMap: Record<string, string[]> = {
      'aegispay-fraud-detection': [
        'How does the risk scoring work?',
        'What ML models are used?',
        'How does it handle real-time transactions?',
      ],
      'neuro-vx-cognitive-health': [
        'What cognitive metrics does it measure?',
        'How does the predictive scoring work?',
        'What micro-assessments are included?',
      ],
      'churn-prediction': [
        'How is churn probability calculated?',
        'What behavioral signals does it track?',
        'How does it help with retention?',
      ],
      'visionguard-cctv': [
        'What object detection model is used?',
        'How does real-time processing work?',
        'What anomalies can it detect?',
      ],
    };
    return questionMap[projectSlug] || ['Tell me about this project'];
  }
  return [
    "What projects has Anshul built?",
    "What's Anshul's tech stack?",
    "Is Anshul available for work?",
    "How can I contact Anshul?",
  ];
}

interface ChatbotProps {
  projectSlug?: string;
  autoOpen?: boolean;
  onClose?: () => void;
}

export function Chatbot({ projectSlug, autoOpen = false, onClose }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(autoOpen);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! 👋 I'm Anshul's portfolio assistant. How can I help you today?\n\nYou can ask me about:\n- 🚀 **Projects** — AegisPay, Neuro-VX, and more\n- 🛠️ **Skills & Tech Stack**\n- 📧 **Contact & Availability**\n- 📄 **Resume**" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  useEffect(() => {
    if (autoOpen) setIsOpen(true);
  }, [autoOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: text.trim() };
    const allMessages = [...messages, userMsg];
    setMessages(allMessages);
    setInput('');

    // Check common Q&A first for instant response
    const commonAnswer = findCommonAnswer(text.trim());
    if (commonAnswer) {
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'assistant', content: commonAnswer }]);
      }, 300);
      return;
    }

    setIsLoading(true);

    try {
      // Build contents - only user/model messages for Gemini
      const apiMessages = allMessages.slice(1); // skip initial greeting
      const contents = apiMessages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      // Ensure first message is user role
      while (contents.length > 0 && contents[0].role === 'model') {
        contents.shift();
      }

      if (contents.length === 0) {
        contents.push({ role: 'user', parts: [{ text: text.trim() }] });
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: buildSystemPrompt(projectSlug) }] },
            contents,
            generationConfig: { temperature: 0.7, maxOutputTokens: 1024 }
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini API error:', response.status, errorText);
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't process that. Please try again.";
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      console.error('Chatbot error:', err);
      // Fallback to a helpful message
      setMessages(prev => [...prev, { role: 'assistant', content: `I'm having trouble connecting right now. In the meantime, here are some quick answers:\n\n- **Email:** ${photographerInfo.email}\n- **Status:** ${photographerInfo.status}\n- **Projects:** AegisPay, Neuro-VX, Customer Retention, Intelligent CCTV\n\nPlease try again in a moment!` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  const suggestedQuestions = getSuggestedQuestions(projectSlug);

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-foreground text-background flex items-center justify-center shadow-2xl hover:scale-110 transition-transform vibrant-hover"
            aria-label="Open chatbot"
          >
            <Bot className="size-7" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Full-screen backdrop + chat window */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-background/80 backdrop-blur-sm"
              onClick={handleClose}
            />

            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed z-[70] inset-4 sm:inset-auto sm:bottom-8 sm:right-8 sm:w-[400px] sm:h-[600px] sm:max-h-[calc(100vh-4rem)] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden gradient-border"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border bg-accent/50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-foreground text-background flex items-center justify-center">
                    <Bot className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Portfolio Assistant</p>
                    <p className="text-xs text-muted-foreground">Powered by AI</p>
                  </div>
                </div>
                <button onClick={handleClose} className="p-2 rounded-full hover:bg-accent transition-colors">
                  <X className="size-5" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 hide-scrollbar">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm ${
                      msg.role === 'user'
                        ? 'bg-foreground text-background rounded-br-md'
                        : 'bg-accent text-foreground rounded-bl-md'
                    }`}>
                      {msg.role === 'assistant' ? (
                        <div className="prose prose-sm dark:prose-invert max-w-none [&>p]:m-0 [&>ul]:m-0 [&>ol]:m-0 [&>p]:mb-2 [&>ul]:mb-2">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      ) : msg.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-accent px-4 py-3 rounded-2xl rounded-bl-md flex items-center gap-2">
                      <Loader2 className="size-4 animate-spin text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Thinking...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Suggested questions */}
              {messages.length <= 1 && (
                <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                  {suggestedQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(q)}
                      className="text-xs px-3 py-1.5 rounded-full border border-border hover:bg-accent transition-colors text-muted-foreground vibrant-hover"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <div className="p-3 border-t border-border">
                <form
                  onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
                  className="flex items-center gap-2"
                >
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-accent/50 border border-border rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center disabled:opacity-50 hover:opacity-90 transition-opacity"
                  >
                    <Send className="size-4" />
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
