import type { Project } from '@/types';
import projectChurn from '@/assets/project-churn.jpg';

import aegisLanding from '@/assets/aegispay/01-landing.jpg';
import aegisLogin from '@/assets/aegispay/02-login.jpg';
import aegisDashboard from '@/assets/aegispay/03-dashboard.jpg';
import aegisServices from '@/assets/aegispay/04-services.jpg';
import aegisQR from '@/assets/aegispay/05-qrcode.jpg';
import aegisPayment from '@/assets/aegispay/06-payment.jpg';
import aegisSuccess from '@/assets/aegispay/07-success.jpg';
import aegisProfile from '@/assets/aegispay/08-profile.jpg';
import aegisMLLayers from '@/assets/aegispay/09-ml-layers.jpg';
import aegisAccuracy from '@/assets/aegispay/10-accuracy.jpg';

import churnHero from '@/assets/churn/01-hero.png';
import churnHeroMobile from '@/assets/churn/02-hero-mobile.jpg';
import churnDashboard from '@/assets/churn/03-dashboard.jpg';
import churnUsecases from '@/assets/churn/04-usecases.jpg';
import churnCta from '@/assets/churn/05-cta.jpg';
import churnPredictor from '@/assets/churn/06-predictor.jpg';
import churnServices from '@/assets/churn/07-services.jpg';
import churnResults from '@/assets/churn/08-results.jpg';
import churnHistory from '@/assets/churn/09-history.jpg';

export const projects: Project[] = [
  {
    id: '1',
    title: 'AegisPay – Fraud Detection Prototype',
    category: 'machine-learning',
    year: '2024',
    slug: 'aegispay-fraud-detection',
    coverImage: aegisLanding,
    description: 'A simulated digital payment environment demonstrating real-time fraud detection through behavioral analytics and dynamic risk scoring.',
    technologies: ['Python', 'Scikit-learn', 'PyTorch', 'FastAPI', 'PostgreSQL', 'Docker'],
    images: [],
    flowImages: [
      { src: aegisLanding, alt: 'AegisPay Landing Page', caption: 'Landing page with AI-Powered Fraud Detection hero, Login & Register buttons, and real-time stats including <100ms latency, 89.2% accuracy.' },
      { src: aegisMLLayers, alt: 'Five Layers of ML Protection', caption: 'Five specialized detection layers — Rule Engine, Anomaly Detection, Supervised Learning, Sequence Model, and Graph Neural Network — working in concert.' },
      { src: aegisAccuracy, alt: 'Ensemble Model Accuracy', caption: 'Layer performance overview showing individual model accuracies (85-99%) combining into 99.9% ensemble accuracy through multi-model fusion.' },
      { src: aegisLogin, alt: 'AegisPay Login Screen', caption: 'Secure login with email, password, and 4-digit PIN authentication for multi-factor security.' },
      { src: aegisDashboard, alt: 'AegisPay Dashboard', caption: 'User dashboard showing ₹1,00,000 virtual balance, verified user status, and money transfer options including mobile, wallet, and QR payments.' },
      { src: aegisServices, alt: 'AegisPay Services', caption: 'Extended services including bill payments, loans, insurance, gold & silver investment, travel bookings, and rewards & referral programs.' },
      { src: aegisQR, alt: 'AegisPay QR Code', caption: 'UPI QR code for receiving payments with download and share functionality — each user gets a unique payment address.' },
      { src: aegisPayment, alt: 'AegisPay Payment Form', caption: 'Payment form with UPI ID, amount entry, merchant category selection, and AI-powered tip explaining how category data improves fraud prediction.' },
      { src: aegisSuccess, alt: 'Payment Successful', caption: 'Transaction confirmation showing ₹10,000 payment with full details — Transaction ID, payment method, bank, category, and description.' },
      { src: aegisProfile, alt: 'AegisPay User Profile', caption: 'Account management with personal info, bank details, transaction stats, security settings, and document uploads — full KYC simulation.' },
    ],
    detailedDescription: {
      overview: 'AegisPay is a simulated digital payment environment designed to demonstrate how fraud detection systems operate in real time. Rather than building a production payment gateway, the project creates a controlled sandbox where users can observe how financial risk intelligence works under the hood.',
      coreConcept: 'Each user is assigned ₹1,00,000 in virtual currency upon registration and can transfer funds to other AegisPay users. The platform intentionally allows users to perform suspicious activities — rapid transactions, unusually high-value transfers, activity from new devices, or multiple transfers in short time intervals. The objective is educational and analytical: instead of silently blocking fraud, the system calculates and displays a dynamic Risk Score for every transaction based on behavioral deviation.',
      technicalApproach: 'The backend processes transaction features and runs a scoring model that evaluates the probability of fraud. Risk is computed using behavioral signals such as transaction velocity, unusual spending patterns, device inconsistency, and account history. This approach demonstrates how real-world fraud detection combines behavioral analytics and probabilistic risk scoring, rather than relying on simple rule-based blocking.',
      prototype: 'The working prototype allows users to visually observe how risk increases when they behave abnormally. It simulates financial risk intelligence in a controlled environment, making complex fraud detection concepts tangible and understandable.',
      learningOutcomes: 'This project demonstrates how fraud scoring works in practice, how risk-based transaction monitoring operates, why behavioral patterns matter more than static rules, and how anomaly detection directly influences decision-making in financial systems.'
    }
  },
  {
    id: '2',
    title: 'Neuro-VX – Cognitive Risk Intelligence',
    category: 'data-science',
    year: '2024',
    slug: 'neuro-vx-cognitive-health',
    coverImage: '',
    description: 'A prototype system demonstrating predictive cognitive health analysis using behavioral and response-based micro-assessments.',
    technologies: ['Python', 'OpenCV', 'PyTorch', 'MediaPipe', 'NumPy', 'Flask'],
    images: [],
    detailedDescription: {
      overview: 'Neuro-VX is a prototype system that demonstrates predictive cognitive health analysis using behavioral and response-based tests. The project explores how raw human interaction data can be transformed into measurable psychological indicators, offering a window into cognitive performance trends.',
      coreConcept: 'The concept behind Neuro-VX is that cognitive decline and burnout develop gradually and can be detected through measurable behavioral shifts. Instead of diagnosing medical conditions, the system models risk trends using statistical normalization and predictive scoring. The focus is on early risk anticipation rather than medical claims.',
      technicalApproach: 'The demo includes structured micro-assessments such as reaction time tests, attention tracking tasks, emotional response indicators, and simple physiological inputs. Based on user responses, the system calculates cognitive performance indicators including focus stability, stress index, fatigue probability, and neural response efficiency. The backend processes test metrics, standardizes values, and runs a predictive model that produces structured cognitive insights.',
      prototype: 'The prototype allows users to complete assessments and instantly see a cognitive profile generated from their responses. It demonstrates how behavioral signals can become predictive health intelligence without requiring invasive medical procedures.',
      learningOutcomes: 'This project illustrates how behavioral data can be systematically collected, normalized, and transformed into actionable cognitive insights. It highlights the potential of predictive analytics in health monitoring and the importance of non-invasive assessment methodologies.'
    }
  },
  {
    id: '3',
    title: 'Customer Retention Intelligence',
    category: 'data-science',
    year: '2024',
    slug: 'churn-prediction',
    coverImage: projectChurn,
    liveUrl: 'https://customer-churn-predictor-eta.vercel.app/',
    description: 'A behavioral analytics prototype demonstrating how businesses predict customer churn before it happens through engagement pattern analysis.',
    technologies: ['Python', 'Pandas', 'Scikit-learn', 'Matplotlib', 'MLflow', 'Plotly'],
    images: [],
    flowImages: [
      { src: churnHero, alt: 'ChurnSense Landing Page', caption: 'Hero section powered by LightGBM Machine Learning — "Stop Customer Churn Before It Happens" with Launch Predictor, View Source, and Visit Portfolio CTAs.' },
      { src: churnHeroMobile, alt: 'Mobile Hero View', caption: 'Mobile-responsive landing page with Customer Profile dashboard showing high-risk subscriber analysis, contract type, tenure, and 78% churn score.' },
      { src: churnDashboard, alt: 'Customer Dashboard', caption: 'Detailed customer profile with contract type, tenure (8 months), internet service, tech support status, monthly charges ($89.50), and online security analysis.' },
      { src: churnUsecases, alt: 'Use Cases & Churn Drivers', caption: 'Application use cases with sample churn drivers — month-to-month contract (92%), fiber optic + no security (78%), tenure < 12 months (71%), and more.' },
      { src: churnPredictor, alt: 'Churn Predictor Form', caption: 'Interactive predictor form with demographics, account info (tenure, monthly charges), contract type, payment method, and service configuration.' },
      { src: churnServices, alt: 'Services Configuration', caption: 'Service selection panel with phone service, multiple lines, internet service (fiber optic), and other configurable parameters for prediction.' },
      { src: churnResults, alt: 'Prediction Results', caption: '50% churn probability with "High Risk" classification, actionable recommendations: offer retention discount, contact customer, review pricing structure.' },
      { src: churnHistory, alt: 'Prediction History', caption: 'History dashboard with total predictions (3), high risk count (1), average score (25.7%), and searchable/filterable prediction log table.' },
      { src: churnCta, alt: 'Call to Action', caption: 'Bottom CTA section — "Ready to Predict Churn?" with Launch Predictor and Visit Portfolio buttons, plus footer with navigation links.' },
    ],
    detailedDescription: {
      overview: 'This project is a behavioral analytics prototype that demonstrates how businesses predict customer churn before it happens. Built around a simulated subscription-based platform, it models the full lifecycle of user engagement and disengagement patterns.',
      coreConcept: 'The core insight driving this project is that churn is not sudden — it is the final stage of measurable disengagement. Users exhibit declining activity patterns across multiple signals: login frequency, transaction activity, support interactions, and engagement metrics. The system analyzes these behavioral patterns over time and generates a Churn Probability Score indicating the likelihood of a customer leaving the service.',
      technicalApproach: 'The backend aggregates historical behavioral signals and feeds them into a predictive classification model. The output includes both a churn probability score and a retention priority score, enabling businesses to allocate retention resources effectively. The system involves exploratory data analysis, behavioral feature extraction, model comparison, threshold optimization, and explainability-focused evaluation.',
      prototype: 'The demo allows observers to simulate user behavior changes and see how churn probability increases when engagement declines or complaints increase. This makes the abstract concept of predictive retention tangible and actionable.',
      learningOutcomes: 'This prototype demonstrates predictive retention strategy and risk-based customer analytics. It shows how combining behavioral signals with machine learning can transform reactive customer management into proactive retention intelligence.'
    }
  },
  {
    id: '4',
    title: 'Intelligent CCTV Monitoring',
    category: 'computer-vision',
    year: '2023',
    slug: 'visionguard-cctv',
    coverImage: '',
    description: 'A computer vision prototype for automated visual intelligence using CCTV footage with real-time object detection and motion tracking.',
    technologies: ['Python', 'YOLOv8', 'OpenCV', 'PyTorch', 'TensorRT', 'Docker'],
    images: [],
    detailedDescription: {
      overview: 'This project is a computer vision prototype designed to demonstrate automated visual intelligence using CCTV footage. It moves beyond passive recording to actively interpret visual scenes and convert them into structured, actionable intelligence.',
      coreConcept: 'The core concept is automated situational awareness. Traditional CCTV systems record footage for later review, requiring constant human monitoring. This system processes live or recorded video streams and performs object detection, motion tracking, and event flagging in real time — identifying people, vehicles, and unusual movement patterns automatically.',
      technicalApproach: 'The backend uses deep learning-based object detection models to process video frames and generate detection outputs. Tracking logic maintains object consistency across frames, ensuring reliable identification even as subjects move through the scene. The system is optimized for real-time performance using TensorRT acceleration.',
      prototype: 'The prototype allows users to upload or stream video and observe how the system detects objects, tracks movement, and highlights suspicious activity patterns. It provides a clear demonstration of how raw surveillance data can be transformed into structured security intelligence.',
      learningOutcomes: 'This project demonstrates how surveillance data can be transformed into actionable insights without constant human monitoring. It showcases the practical application of deep learning in security systems and the engineering challenges of real-time video processing.'
    }
  }
];

export const getProjectBySlug = (slug: string): Project | undefined => {
  return projects.find(project => project.slug === slug);
};

export const getProjectsByCategory = (category: string): Project[] => {
  if (category === 'all') return projects;
  return projects.filter(project => project.category === category);
};

export const getFeaturedProjects = (): Project[] => {
  return projects.slice(0, 4);
};

export const getAdjacentProjects = (currentSlug: string): { prev: Project | null; next: Project | null } => {
  const currentIndex = projects.findIndex(p => p.slug === currentSlug);
  return {
    prev: currentIndex > 0 ? projects[currentIndex - 1] : null,
    next: currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null
  };
};
