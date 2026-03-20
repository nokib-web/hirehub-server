import { GoogleGenerativeAI } from '@google/generative-ai';
import AppError from '../../utils/AppError';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const chat = async (message: string, history: Array<{ role: 'user' | 'model'; parts: string }> = []) => {
  try {
    const chatSession = model.startChat({
      history: history.map((item) => ({
        role: item.role,
        parts: [{ text: item.parts }],
      })),
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    const systemPrompt = `You are a professional career assistant for a job recruitment platform called HireHub. 
Help users with: job search advice, resume tips, interview preparation, career guidance, 
salary negotiation, and finding the right jobs. Be concise, professional, and helpful. 
Format responses clearly using markdown if needed.`;

    const fullPrompt = history.length === 0 ? `${systemPrompt}\n\nUser: ${message}` : message;

    const result = await chatSession.sendMessage(fullPrompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    throw new AppError(500, `Gemini API Error: ${error.message}`);
  }
};

const generateJobDescription = async (data: {
  title: string;
  company: string;
  category: string;
  type: string;
  experience: string;
}) => {
  try {
    const prompt = `Generate a professional job description for a ${data.title} position at ${data.company}. 
Category: ${data.category}. Type: ${data.type}. Experience: ${data.experience}. 
Include: 3-paragraph overview, 6 key responsibilities (as array), 
6 requirements (as array), 5 required skills (as array). 
Return ONLY valid JSON with keys: description, responsibilities, requirements, skills`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Clean up response if Gemini adds markdown code blocks
    if (text.startsWith('```json')) {
      text = text.replace(/```json|```/g, '').trim();
    } else if (text.startsWith('```')) {
      text = text.replace(/```/g, '').trim();
    }

    try {
      return JSON.parse(text);
    } catch (parseError) {
      console.error('Failed to parse AI response:', text);
      throw new AppError(500, 'Failed to generate structured job description. AI returned invalid format.');
    }
  } catch (error: any) {
    throw new AppError(500, `Gemini API Error: ${error.message}`);
  }
};

const improveCoverLetter = async (data: {
  coverLetter: string;
  jobTitle: string;
  company: string;
}) => {
  try {
    const prompt = `Improve this cover letter for a ${data.jobTitle} position at ${data.company}. 
Make it more professional, compelling, and tailored. Keep it under 300 words. 
Original: ${data.coverLetter}
Return ONLY the improved cover letter text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    throw new AppError(500, `Gemini API Error: ${error.message}`);
  }
};

const getResumeTips = async (data: {
  skills: string[];
  targetRole: string;
  experience: string;
}) => {
  try {
    const prompt = `Give 5 specific, actionable resume tips for someone targeting a ${
      data.targetRole
    } role with ${data.experience} experience. Their current skills: ${data.skills.join(', ')}. 
Return as JSON array: [{ "tip": string, "explanation": string }]
Return ONLY valid JSON.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean up response if Gemini adds markdown code blocks
    if (text.startsWith('```json')) {
      text = text.replace(/```json|```/g, '').trim();
    } else if (text.startsWith('```')) {
      text = text.replace(/```/g, '').trim();
    }

    try {
      return JSON.parse(text);
    } catch (parseError) {
      console.error('Failed to parse AI response:', text);
      throw new AppError(500, 'Failed to generate resume tips. AI returned invalid format.');
    }
  } catch (error: any) {
    throw new AppError(500, `Gemini API Error: ${error.message}`);
  }
};

export const AIService = {
  chat,
  generateJobDescription,
  improveCoverLetter,
  getResumeTips,
};
