/* ─────────────────────────────────────────────────────────────────
   Groq AI Service — uses direct fetch() for max reliability
   Model: llama3-8b-8192
   Set VITE_GROQ_API_KEY in frontend/.env
──────────────────────────────────────────────────────────────── */

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL    = 'llama3-8b-8192';

async function callGroq(messages, maxTokens = 600) {
  const key = import.meta.env.VITE_GROQ_API_KEY;
  if (!key || key === 'your_groq_api_key_here') return null;

  try {
    const res = await fetch(GROQ_URL, {
      method : 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
      body   : JSON.stringify({ model: MODEL, messages, max_tokens: maxTokens, temperature: 0.7 })
    });
    if (!res.ok) { console.error('Groq HTTP error', res.status); return null; }
    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? null;
  } catch (e) {
    console.error('Groq fetch failed:', e);
    return null;
  }
}

function tryJSON(text) {
  try { return JSON.parse(text); } catch { return null; }
}

/* ── Cover Letter ── */
export async function generateCoverLetter({ role, matchedSkills, missingSkills, score }) {
  const raw = await callGroq([{
    role: 'user',
    content:
      `Write a professional, concise cover letter for the role "${role}".
Candidate match score: ${score}%.
Strong skills: ${matchedSkills.slice(0,5).join(', ')}.
Learning actively: ${missingSkills.slice(0,3).join(', ')}.
Write 3 short paragraphs. No placeholders. Start with "Dear Hiring Team,". Keep it under 200 words.`
  }], 500);

  return raw ?? `Dear Hiring Team,

I am excited to apply for the ${role} position. With a ${score}% alignment to your requirements and proven expertise in ${matchedSkills.slice(0,3).join(', ')}, I am confident in my ability to deliver outstanding results.

I am actively developing my knowledge in ${missingSkills.slice(0,2).join(' and ')}, ensuring I remain current with evolving industry demands.

I would welcome the opportunity to discuss how my skills can benefit your team.

Best regards,
[Your Name]`;
}

/* ── Growth Plan ── */
export async function generateGrowthPlan(skill, role) {
  const raw = await callGroq([{
    role: 'user',
    content:
      `Give a compact learning plan to master "${skill}" for the "${role}" role.
Reply ONLY with valid JSON, no markdown fences, matching this structure exactly:
{"description":"one line","steps":["step1","step2","step3"],"resources":[{"title":"name","url":"https://..."},{"title":"name","url":"https://..."}]}`
  }], 500);

  const parsed = raw ? tryJSON(raw) : null;
  return parsed ?? {
    description: `Master ${skill} through structured practice for the ${role} role.`,
    steps: [`Study core ${skill} concepts`, `Build a mini project using ${skill}`, `Solve 5 practice problems`],
    resources: [
      { title: `${skill} Docs`, url: `https://www.google.com/search?q=${encodeURIComponent(skill+' documentation')}` },
      { title: `${skill} Tutorial`, url: `https://www.youtube.com/results?search_query=${encodeURIComponent(skill+' tutorial')}` }
    ]
  };
}

/* ── Quiz Questions — llama3 ── */
export async function generateQuizQuestions(skill) {
  const raw = await callGroq([{
    role: 'user',
    content:
      `Create exactly 3 multiple choice quiz questions about "${skill}" for a software developer.
Reply ONLY with a valid JSON array, no markdown, no explanation, like this:
[{"q":"Question text?","options":["A","B","C","D"],"answer":0},{"q":"Question 2?","options":["A","B","C","D"],"answer":2},{"q":"Question 3?","options":["A","B","C","D"],"answer":1}]
The "answer" field is the 0-based index of the correct option.`
  }], 700);

  if (raw) {
    // strip any accidental markdown fences
    const clean = raw.replace(/```json|```/g, '').trim();
    const parsed = tryJSON(clean);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  }

  // Fallback questions
  return [
    { q: `What is the primary purpose of ${skill}?`, options: ['Data storage', 'Build/deploy automation', 'Styling', 'Testing'], answer: 1 },
    { q: `Which company originally developed ${skill}?`, options: ['Google', 'Microsoft', 'Meta', 'Varies by tool'], answer: 3 },
    { q: `${skill} is most commonly associated with which workflow?`, options: ['CI/CD', 'UI Design', 'Database ORM', 'Networking'], answer: 0 }
  ];
}

/* ── Career Pivot ── */
export async function generateCareerPivotPlan(role, currentSkills) {
  const raw = await callGroq([{
    role: 'user',
    content:
      `Career pivot plan to become a "${role}". Current skills: ${currentSkills.slice(0,6).join(', ')}.
Reply ONLY with valid JSON:
{"summary":"one sentence","keySkills":["s1","s2","s3"],"timeline":"X months","firstStep":"actionable step"}`
  }], 400);

  const parsed = raw ? tryJSON(raw.replace(/```json|```/g, '').trim()) : null;
  return parsed ?? {
    summary: `Transitioning to ${role} is achievable with targeted upskilling over 3-6 months.`,
    keySkills: [`Core ${role} fundamentals`, 'Problem-solving frameworks', 'Domain knowledge'],
    timeline: '3-6 months',
    firstStep: `Enroll in a foundational ${role} course on Coursera or Udemy this week.`
  };
}
