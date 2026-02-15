
export enum CandidateStatus {
  PENDING = 'Pending',
  INTERVIEWED = 'Interviewed',
  ANALYZING = 'Analyzing',
  HIRED = 'Hired',
  REJECTED = 'Rejected'
}

export interface TranscriptionTurn {
  speaker: 'Interviewer' | 'Candidate';
  text: string;
  timestamp?: string;
}

export interface PersonalityTraits {
  type: string;
  leadership: number;
  problemSolving: number;
  emotionalControl: number;
  confidence: number;
}

export interface DiscProfile {
  dominantType: 'D' | 'I' | 'S' | 'C';
  dScore: number; // 0-100
  iScore: number; // 0-100
  sScore: number; // 0-100
  cScore: number; // 0-100
  analysis: string;
}

export interface EmotionAnalysis {
  nervousness: number; // 1-10
  confidence: number; // 1-10
  eyeContact: 'Good' | 'Average' | 'Poor' | 'Not Visible';
  defensiveness: 'None' | 'Low' | 'High';
  behavioralCues: string[];
}

export interface AnalysisResult {
  summary: string;
  transcription: TranscriptionTurn[];
  keySkills: string[];
  redFlags: string[];
  personality: PersonalityTraits;
  discProfile: DiscProfile;
  emotionAnalysis: EmotionAnalysis;
  matchScore: number;
  recommendation: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  suggestedFollowUpQuestions: string[];
}

export interface Candidate {
  id: string;
  name: string;
  position: string;
  email: string;
  phone: string;
  experienceLevel: string;
  status: CandidateStatus;
  appliedDate: string;
  cvFileName?: string;
  analysis?: AnalysisResult;
}

export interface DashboardStats {
  totalCandidates: number;
  interviewed: number;
  hired: number;
  rejected: number;
  avgScore: number;
}

export interface GeneratedQuestion {
  question: string;
  intent: string;
}
