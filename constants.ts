
import { Candidate, CandidateStatus } from './types';

export const MOCK_CANDIDATES: Candidate[] = [
  {
    id: '1',
    name: 'Siti Aminah',
    position: 'Senior Frontend Engineer',
    email: 'siti.aminah@example.com',
    phone: '+62 812-3456-7890',
    experienceLevel: 'Senior (5+ tahun)',
    status: CandidateStatus.HIRED,
    appliedDate: '2023-10-15',
    analysis: {
      summary: 'Siti menunjukkan pengetahuan mendalam tentang internal React dan manajemen state. Dia mengomunikasikan konsep teknis yang kompleks dengan sangat jelas.',
      transcription: [
        { speaker: 'Interviewer', text: 'Ceritakan tentang masalah rendering menantang yang pernah Anda selesaikan.' },
        { speaker: 'Candidate', text: 'Di pekerjaan terakhir saya, kami memiliki dasbor yang lambat. Saya mengimplementasikan virtualisasi dan memoization...' }
      ],
      keySkills: ['React', 'Optimasi Performa', 'Desain Sistem'],
      redFlags: [],
      personality: {
        type: 'Analitis',
        leadership: 8,
        problemSolving: 9,
        emotionalControl: 8,
        confidence: 9
      },
      discProfile: {
        dominantType: 'C',
        dScore: 30,
        iScore: 20,
        sScore: 60,
        cScore: 85,
        analysis: 'Kandidat menunjukkan ciri C (Compliance) yang kuat, sangat detail-oriented, analitis, dan berfokus pada kualitas kode. Stabil dalam komunikasi.'
      },
      emotionAnalysis: {
        nervousness: 2,
        confidence: 9,
        eyeContact: 'Good',
        defensiveness: 'None',
        behavioralCues: ['Menjaga kontak mata dengan stabil', 'Tersenyum natural saat perkenalan']
      },
      matchScore: 92,
      recommendation: 'Sangat Direkomendasikan',
      riskLevel: 'Low',
      suggestedFollowUpQuestions: [
        'Bisakah Anda jelaskan lebih detail bagaimana Anda mengukur dampak performa dari perubahan tersebut?',
        'Bagaimana Anda menangani trade-off antara penggunaan memori dan CPU selama optimasi?'
      ]
    }
  },
  {
    id: '2',
    name: 'Budi Santoso',
    position: 'Product Manager',
    email: 'budi.s@example.com',
    phone: '+62 813-9876-5432',
    experienceLevel: 'Mid-Level',
    status: CandidateStatus.INTERVIEWED,
    appliedDate: '2023-10-18',
    analysis: {
      summary: 'Budi memiliki kepekaan produk yang baik tetapi kesulitan dengan pertanyaan berbasis metrik. Dia menunjukkan empati yang baik terhadap pengguna.',
      transcription: [],
      keySkills: ['Riset Pengguna', 'Agile', 'Roadmapping'],
      redFlags: ['Kurang detail pada KPI'],
      personality: {
        type: 'Suportif',
        leadership: 6,
        problemSolving: 7,
        emotionalControl: 7,
        confidence: 6
      },
      discProfile: {
        dominantType: 'S',
        dScore: 20,
        iScore: 60,
        sScore: 80,
        cScore: 40,
        analysis: 'Tipe S (Steadiness) dominan. Pembawaan tenang, pendengar yang baik, dan berorientasi pada kerja sama tim. Kurang agresif dalam mengambil risiko.'
      },
      emotionAnalysis: {
        nervousness: 6,
        confidence: 5,
        eyeContact: 'Average',
        defensiveness: 'Low',
        behavioralCues: ['Sedikit gelisah saat ditanya tentang proyek gagal', 'Melihat ke bawah saat berpikir']
      },
      matchScore: 74,
      recommendation: 'Pertimbangkan untuk posisi Junior',
      riskLevel: 'Medium',
      suggestedFollowUpQuestions: [
        'Bisa berikan contoh spesifik KPI yang Anda tentukan yang secara langsung mempengaruhi roadmap?',
        'Bagaimana Anda menangani ketidaksepakatan dengan tim engineering?'
      ]
    }
  },
  {
    id: '3',
    name: 'Jessica Alba',
    position: 'UX Designer',
    email: 'j.alba@design.com',
    phone: '+62 811-4567-8901',
    experienceLevel: 'Senior',
    status: CandidateStatus.PENDING,
    appliedDate: '2023-10-20'
  }
];
