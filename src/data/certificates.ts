import ibmBadge from '@/assets/certificates/ibm-ai-badge.jpg';
import ibmCert from '@/assets/certificates/ibm-ai-certificate.jpg';
import googleAdkAgents from '@/assets/certificates/google-adk-agents.jpg';
import googleAdkFirst from '@/assets/certificates/google-adk-first-agent.jpg';
import googleAdkEngineer from '@/assets/certificates/google-adk-engineer.png';
import googleGenAiChatbot from '@/assets/certificates/google-genai-chatbot.png';
import googleOptimizeAgent from '@/assets/certificates/google-optimize-agent.png';
import googleGenAiConcepts from '@/assets/certificates/google-genai-concepts.png';
import googleAgentTools from '@/assets/certificates/google-agent-tools.png';
import nxtwaveGenai from '@/assets/certificates/nxtwave-genai.jpg';
import sihHackathon from '@/assets/certificates/sih-hackathon.jpg';

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issuerLogo?: string;
  date: string;
  image: string;
  badgeImage?: string;
  category: 'badge' | 'certificate' | 'hackathon';
  verifyUrl?: string;
  credlyProfile?: string;
  highlights: string[];
  description: string;
}

export const certificates: Certificate[] = [
  {
    id: 'ibm-ai-fundamentals',
    title: 'AI Fundamentals: Foundations for Understanding AI',
    issuer: 'IBM SkillsBuild',
    date: '21 February 2026',
    image: ibmCert,
    badgeImage: ibmBadge,
    category: 'badge',
    verifyUrl: 'https://www.credly.com/go/F1cWvV8x',
    credlyProfile: 'https://www.credly.com/users/anshul-rathod.37fcdcf5',
    highlights: [
      'Machine Learning & Deep Learning',
      'Neural Networks & Generative AI',
      'NLP & Computer Vision',
      'AI Ethics & Responsible AI',
    ],
    description:
      'Comprehensive program covering the technical and practical foundations of artificial intelligence — from Machine Learning algorithms and Neural Networks to Generative AI mechanics and AI Ethics. Covers NLP, Computer Vision, and responsible AI development practices.',
  },
  {
    id: 'google-adk-engineer',
    title: 'Engineer AI Agents with Agent Development Kit (ADK)',
    issuer: 'Google Cloud · Skill Badge',
    date: '2026',
    image: googleAdkEngineer,
    category: 'badge',
    credlyProfile: 'https://www.credly.com/users/anshul-rathod.37fcdcf5',
    highlights: [
      'Intermediate Skill Badge',
      'Advanced agent orchestration',
      'Production-scale AI agents',
      'Model optimization for agents',
    ],
    description:
      'Intermediate-level Google Cloud Skill Badge for engineering advanced AI agents. Focuses on architecting autonomous workflows, handling complex goals, and optimizing agent behavior for production environments using the ADK.',
  },
  {
    id: 'google-genai-chatbot',
    title: 'Gen AI: Beyond the Chatbot',
    issuer: 'Google Cloud · Completion Badge',
    date: 'March 2026',
    image: googleGenAiChatbot,
    category: 'badge',
    credlyProfile: 'https://www.credly.com/users/anshul-rathod.37fcdcf5',
    highlights: [
      'Generative AI system design',
      'Agentic workflow integration',
      'Stateful conversation management',
      'Real-world GenAI deployment',
    ],
    description:
      'Google Cloud completion badge focused on building Generative AI applications that extend beyond simple chatbots to complex, agentic systems capable of executing multi-step business logic.',
  },
  {
    id: 'google-optimize-agent',
    title: 'Optimize Agent Behavior',
    issuer: 'Google Cloud · Completion Badge',
    date: 'March 2026',
    image: googleOptimizeAgent,
    category: 'badge',
    credlyProfile: 'https://www.credly.com/users/anshul-rathod.37fcdcf5',
    highlights: [
      'Agent performance tuning',
      'Instruction-following calibration',
      'Cost and latency optimization',
      'Agent behavior evaluation',
    ],
    description:
      'Google Cloud completion badge for specialists in agent behavior optimization. Covers advanced techniques for improving instruction following, reducing cognitive overhead, and balancing performance with system constraints.',
  },
  {
    id: 'google-genai-foundational',
    title: 'Gen AI: Unlock Foundational Concepts',
    issuer: 'Google Cloud · Completion Badge',
    date: 'March 2026',
    image: googleGenAiConcepts,
    category: 'badge',
    credlyProfile: 'https://www.credly.com/users/anshul-rathod.37fcdcf5',
    highlights: [
      'Transformer architecture fundamentals',
      'Tokenization and attention mechanisms',
      'Model pre-training paradigms',
      'Foundational LLM concepts',
    ],
    description:
      'Foundational Google Cloud badge validating deep understanding of the underlying principles of Generative AI, from attention mechanisms in Transformers to the mechanics of large-scale model training.',
  },
  {
    id: 'google-agent-tools',
    title: 'Add Agent Capabilities with Tools',
    issuer: 'Google Cloud · Completion Badge',
    date: 'March 2026',
    image: googleAgentTools,
    category: 'badge',
    credlyProfile: 'https://www.credly.com/users/anshul-rathod.37fcdcf5',
    highlights: [
      'Tool-calling & Function-calling',
      'API-agent integration',
      'External data source access',
      'Secure tool execution environments',
    ],
    description:
      'Google Cloud badge for mastering tool integration with AI agents. Covers implementing robust tool-calling interfaces, enabling agents to interact with external APIs, and managing data retrieval for augmented reasoning.',
  },
  {
    id: 'google-adk-agents',
    title: 'Build Agents with Agent Development Kit (ADK)',
    issuer: 'Google Cloud',
    date: '2026',
    image: googleAdkAgents,
    category: 'badge',
    credlyProfile: 'https://www.credly.com/users/anshul-rathod.37fcdcf5',
    highlights: [
      'Designing intelligent AI agents',
      'Scalable agent architectures',
      'Google Cloud ecosystem integration',
      'Autonomous workflow orchestration',
    ],
    description:
      'Hands-on completion badge from Google Cloud for designing, building, and deploying intelligent agents using the Agent Development Kit. Covers scalable agent architectures and integration with Google Cloud services for next-gen automation.',
  },
  {
    id: 'google-adk-first-agent',
    title: 'Build Your First Agent with ADK',
    issuer: 'Google Cloud',
    date: '2026',
    image: googleAdkFirst,
    category: 'badge',
    credlyProfile: 'https://www.credly.com/users/anshul-rathod.37fcdcf5',
    highlights: [
      'Agent Development Kit fundamentals',
      'Goal-oriented AI agents',
      'Cloud-powered automation',
      'Practical agent deployment',
    ],
    description:
      'Foundational completion badge for building a first autonomous agent with Google Cloud\'s ADK. Covers agent design principles, goal-oriented planning, and deployment on Google Cloud infrastructure.',
  },
  {
    id: 'nxtwave-genai',
    title: 'AI for Students: Build Your Own Generative AI Model',
    issuer: 'NxtWave',
    date: '11 October 2024',
    image: nxtwaveGenai,
    category: 'certificate',
    highlights: [
      'Generative model architecture',
      'LLM internals & fine-tuning',
      'Hands-on model building',
      'Strategic AI problem-solving',
    ],
    description:
      'Workshop led by Abhinav Devaguptapu covering generative model architecture, LLM internals, and practical implementation of custom AI solutions. Focuses on moving beyond theory to build intelligent, adaptive systems from scratch.',
  },
  {
    id: 'sih-2025',
    title: 'Smart India Internal Hackathon 2025',
    issuer: 'G H Raisoni University & IIC',
    date: '25 September 2025',
    image: sihHackathon,
    category: 'hackathon',
    highlights: [
      'Blockchain-based Blue Carbon Registry',
      'Digital MRV framework',
      'Immutable carbon-credit ledger',
      'Climate data modelling',
    ],
    description:
      'Participation certificate for developing a Blockchain-based Blue Carbon Registry and MRV System at the national-level Smart India Hackathon. The solution brought transparency to coastal carbon markets through decentralized registries, automated MRV, and immutable environmental auditing.',
  },
];
