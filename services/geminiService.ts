
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult, GeneratedQuestion } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Define the response schema for structured output
const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING, description: "Ringkasan performa kandidat dalam Bahasa Indonesia." },
    transcription: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          speaker: { type: Type.STRING, enum: ["Interviewer", "Candidate"] },
          text: { type: Type.STRING }
        }
      },
      description: "Transkripsi atau ringkasan dialog kunci."
    },
    keySkills: { type: Type.ARRAY, items: { type: Type.STRING } },
    redFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
    personality: {
      type: Type.OBJECT,
      properties: {
        type: { type: Type.STRING, description: "Contoh: Analitis, Dominan, Ekspresif (Dalam Bahasa Indonesia)" },
        leadership: { type: Type.NUMBER, description: "Skor 1-10" },
        problemSolving: { type: Type.NUMBER, description: "Skor 1-10" },
        emotionalControl: { type: Type.NUMBER, description: "Skor 1-10" },
        confidence: { type: Type.NUMBER, description: "Skor 1-10" }
      }
    },
    discProfile: {
      type: Type.OBJECT,
      properties: {
        dominantType: { type: Type.STRING, enum: ["D", "I", "S", "C"] },
        dScore: { type: Type.NUMBER, description: "Skor Dominance 0-100" },
        iScore: { type: Type.NUMBER, description: "Skor Influence 0-100" },
        sScore: { type: Type.NUMBER, description: "Skor Steadiness 0-100" },
        cScore: { type: Type.NUMBER, description: "Skor Compliance 0-100" },
        analysis: { type: Type.STRING, description: "Analisis singkat tentang profil DISC kandidat dalam Bahasa Indonesia." }
      }
    },
    emotionAnalysis: {
      type: Type.OBJECT,
      properties: {
        nervousness: { type: Type.NUMBER, description: "Skor 1-10 (10 sangat gugup)" },
        confidence: { type: Type.NUMBER, description: "Skor 1-10 berdasarkan isyarat visual/audio" },
        eyeContact: { type: Type.STRING, enum: ["Good", "Average", "Poor", "Not Visible"] },
        defensiveness: { type: Type.STRING, enum: ["None", "Low", "High"] },
        behavioralCues: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Observasi spesifik dalam Bahasa Indonesia" }
      }
    },
    matchScore: { type: Type.NUMBER, description: "Persentase kecocokan 0-100" },
    recommendation: { type: Type.STRING, description: "Rekomendasi perekrutan final dalam Bahasa Indonesia" },
    riskLevel: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
    suggestedFollowUpQuestions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3-5 Pertanyaan lanjutan dalam Bahasa Indonesia yang seharusnya ditanyakan interviewer." }
  },
  required: ["summary", "transcription", "keySkills", "redFlags", "personality", "discProfile", "emotionAnalysis", "matchScore", "recommendation", "riskLevel", "suggestedFollowUpQuestions"]
};

// Schema for Question Generator
const questionsSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      question: { type: Type.STRING, description: "Pertanyaan wawancara dalam Bahasa Indonesia" },
      intent: { type: Type.STRING, description: "Tujuan pertanyaan ini dalam Bahasa Indonesia" }
    },
    required: ["question", "intent"]
  }
};

const followUpSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    followUpQuestion: { type: Type.STRING, description: "Pertanyaan follow-up dalam Bahasa Indonesia" },
    explanation: { type: Type.STRING, description: "Penjelasan mengapa perlu ditanyakan (Bahasa Indonesia)" }
  },
  required: ["followUpQuestion", "explanation"]
};

export const analyzeInterviewMedia = async (
  base64Data: string,
  mimeType: string,
  candidateName: string,
  position: string,
  cvBase64?: string,
  cvMimeType?: string
): Promise<AnalysisResult> => {
  
  const modelId = "gemini-2.5-flash-latest"; // Using latest flash for multimodal + thinking capability

  let prompt = `
    Anda adalah seorang Analis Wawancara HR ahli dengan spesialisasi dalam psikologi perilaku dan profil DISC.
    Analisis rekaman wawancara ini untuk kandidat bernama ${candidateName} yang melamar posisi ${position}.
    
    PENTING: Berikan semua output teks (ringkasan, transkrip, analisis, rekomendasi) dalam **Bahasa Indonesia**. 
    Biarkan nilai Enum (seperti 'Low', 'Medium', 'High', 'Good', 'Poor', 'D', 'I', 'S', 'C') tetap dalam Bahasa Inggris agar sistem kompatibel.
    
    Tugas Anda:
    1. Transkripkan bagian-bagian kunci percakapan.
    2. Ringkas jawaban kandidat.
    3. **Analisis Emosi Video**: Analisis isyarat visual dan audio. Deteksi kegugupan, tingkat kepercayaan diri, kualitas kontak mata, dan bahasa tubuh defensif.
    4. **Analisis DISC**: Berdasarkan gaya komunikasi, intonasi, dan pilihan kata, tentukan profil DISC (Dominance, Influence, Steadiness, Compliance). Berikan perkiraan skor (0-100) untuk masing-masing dimensi.
    5. Analisis ciri kepribadian umum.
    6. Identifikasi keterampilan teknis (hard skills) dan soft skills utama. Jika CV dilampirkan, validasi klaim kandidat di CV dengan jawabannya di interview.
    7. Deteksi "tanda bahaya" (inkonsistensi, sikap defensif, kurang detail).
    8. **Peluang Terlewatkan**: Buat daftar pertanyaan lanjutan yang *seharusnya* ditanyakan pewawancara.
    9. Berikan skor kecocokan (0-100) dan tingkat risiko.
    
    Kembalikan hasil dalam format JSON yang terstruktur secara ketat.
  `;

  if (cvBase64) {
    prompt += `\n\nCATATAN: Dokumen CV kandidat telah dilampirkan. Gunakan informasi di CV untuk memverifikasi latar belakang teknis dan pengalaman, namun gunakan REKAMAN AUDIO/VIDEO sebagai sumber utama untuk analisis kepribadian dan DISC.`;
  }

  const parts = [];
  
  // Add CV part if available
  if (cvBase64 && cvMimeType) {
    parts.push({
      inlineData: {
        mimeType: cvMimeType,
        data: cvBase64
      }
    });
  }

  // Add Interview Media part
  parts.push({
    inlineData: {
      mimeType: mimeType,
      data: base64Data
    }
  });

  // Add Prompt
  parts.push({ text: prompt });

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: parts
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        thinkingConfig: { thinkingBudget: 4096 } // Higher budget for complex DISC + CV analysis
      }
    });

    const text = response.text;
    if (!text) throw new Error("Tidak ada respons dari AI");
    
    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};

export const generateSmartQuestions = async (
  position: string,
  experienceLevel: string,
  skills: string
): Promise<GeneratedQuestion[]> => {
  const modelId = "gemini-2.5-flash-latest";

  const prompt = `
    Buatkan 5 pertanyaan wawancara tingkat lanjut, perilaku, dan teknis untuk posisi ${position} dengan level pengalaman ${experienceLevel}.
    Fokus pada keterampilan ini: ${skills}.
    
    PENTING: Gunakan **Bahasa Indonesia** untuk semua pertanyaan dan penjelasan.
    Untuk setiap pertanyaan, jelaskan "intent" (apa yang harus dicari oleh pewawancara).
    Pertanyaan harus sulit dan dirancang untuk mengungkapkan kompetensi yang sebenarnya.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: { text: prompt },
      config: {
        responseMimeType: "application/json",
        responseSchema: questionsSchema,
        thinkingConfig: { thinkingBudget: 1024 } 
      }
    });

    if (!response.text) throw new Error("Tidak ada respons");
    return JSON.parse(response.text) as GeneratedQuestion[];
  } catch (error) {
    console.error("Question Generation Error:", error);
    throw error;
  }
};

export const generateFollowUp = async (
  originalQuestion: string,
  candidateAnswer: string
): Promise<{ followUpQuestion: string; explanation: string }> => {
  const modelId = "gemini-2.5-flash-latest";

  const prompt = `
    Pewawancara bertanya: "${originalQuestion}"
    Kandidat menjawab: "${candidateAnswer}"
    
    Jawaban kandidat mungkin dangkal, tidak jelas, atau kurang detail spesifik (metode STAR).
    
    PENTING: Gunakan **Bahasa Indonesia**.
    Buatkan pertanyaan lanjutan (follow-up) yang tajam, sopan, namun menyelidik untuk menggali lebih dalam bagian yang hilang.
    Jelaskan mengapa pertanyaan lanjutan ini perlu diajukan.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: { text: prompt },
      config: {
        responseMimeType: "application/json",
        responseSchema: followUpSchema,
        thinkingConfig: { thinkingBudget: 1024 }
      }
    });

    if (!response.text) throw new Error("Tidak ada respons");
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Follow-up Generation Error:", error);
    throw error;
  }
};
