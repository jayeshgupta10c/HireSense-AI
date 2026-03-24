import axios from 'axios';
const api = axios.create({ baseURL: 'http://localhost:8000' });
export const analyzeResume = async (file, jd) => {
  const f = new FormData(); f.append('file', file); f.append('job_description', jd);
  const r = await api.post('/analyze', f); return r.data;
};
export const generateAISummary = async (res) => {
  const r = await api.post('/ai/summary', res); return r.data.summary;
};
export default api;
