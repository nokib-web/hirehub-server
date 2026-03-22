import OpenAI from 'openai';
import AppError from '../../utils/AppError';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });

const SYSTEM_PROMPT = `You are a professional career assistant for a job recruitment platform called HireHub. 
Help users with: job search advice, resume tips, interview preparation, career guidance, 
salary negotiation, and finding the right jobs. Be concise, professional, and helpful. 
Format responses clearly. Keep answers brief and actionable.`;

const chat = async (
  message: string,
  history: Array<{ role: 'user' | 'model'; parts: string }> = []
) => {
  try {
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.map((h) => ({
        role: h.role === 'model' ? ('assistant' as const) : ('user' as const),
        content: h.parts,
      })),
      { role: 'user', content: message },
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      max_tokens: 1000,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || 'No response generated.';
  } catch (error: any) {
    throw new AppError(500, `OpenAI API Error: ${error.message}`);
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

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are a professional job description writer. Always return valid JSON only.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 1500,
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const text = completion.choices[0]?.message?.content || '{}';
    try {
      return JSON.parse(text);
    } catch (parseError) {
      console.error('Failed to parse AI response:', text);
      throw new AppError(500, 'Failed to generate structured job description. AI returned invalid format.');
    }
  } catch (error: any) {
    throw new AppError(500, `OpenAI API Error: ${error.message}`);
  }
};

const improveCoverLetter = async (data: {
  coverLetter: string;
  jobTitle: string;
  company: string;
}) => {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a professional cover letter writer. Return only the improved cover letter text.',
        },
        {
          role: 'user',
          content: `Improve this cover letter for a ${data.jobTitle} position at ${data.company}. 
Make it more professional, compelling, and tailored. Keep it under 300 words. 
Original: ${data.coverLetter}`,
        },
      ],
      max_tokens: 600,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || '';
  } catch (error: any) {
    throw new AppError(500, `OpenAI API Error: ${error.message}`);
  }
};

const getResumeTips = async (data: {
  skills: string[];
  targetRole: string;
  experience: string;
}) => {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a professional resume coach. Return only valid JSON as specified.',
        },
        {
          role: 'user',
          content: `Give 5 specific, actionable resume tips for someone targeting a ${data.targetRole} role with ${data.experience} experience. Their current skills: ${data.skills.join(', ')}. 
Return as JSON array: [{ "tip": string, "explanation": string }]`,
        },
      ],
      max_tokens: 800,
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const text = completion.choices[0]?.message?.content || '{"tips":[]}';
    try {
      const parsed = JSON.parse(text);
      return Array.isArray(parsed) ? parsed : (parsed.tips || parsed.results || Object.values(parsed)[0]);
    } catch (parseError) {
      console.error('Failed to parse AI response:', text);
      throw new AppError(500, 'Failed to generate resume tips. AI returned invalid format.');
    }
  } catch (error: any) {
    throw new AppError(500, `OpenAI API Error: ${error.message}`);
  }
};

const generateReviewSummary = async (companyName: string, reviews: any[]) => {
  try {
    const reviewsText = reviews.map((r) => `[Rating: ${r.rating}/5, Comment: ${r.comment}]`).join('\n');

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a professional business analyst. Summarize reviews concisely and return only the summary text.',
        },
        {
          role: 'user',
          content: `Summarize the employee reviews for ${companyName} into a concise, professional 2-3 sentence paragraph. 
Highlight the main pros mentioned and any common concerns if they exist. 
Reviews:\n${reviewsText}`,
        },
      ],
      max_tokens: 300,
      temperature: 0.6,
    });

    return completion.choices[0]?.message?.content || '';
  } catch (error: any) {
    throw new AppError(500, `OpenAI API Error: ${error.message}`);
  }
};

export const AIService = {
  chat,
  generateJobDescription,
  improveCoverLetter,
  getResumeTips,
  generateReviewSummary,
};
