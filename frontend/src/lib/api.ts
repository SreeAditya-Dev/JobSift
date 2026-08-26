/**
 * CareerBrew API Client
 * Connects to Python FastAPI backend at http://localhost:8000/api
 * Includes smart resilient fallbacks for offline development/preview.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

/** Helper to get stored auth token */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('careerbrew_token');
}

/** Base fetch wrapper with auth header injection */
async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(errorBody.detail || `API request failed with status ${res.status}`);
    }

    return await res.json();
  } catch (err: any) {
    console.warn(`[CareerBrew API Warning on ${endpoint}]:`, err.message);
    throw err;
  }
}

// ---------------- AUTH API ---------------- //
export const authApi = {
  login: async (email: string, password: string) => {
    return fetchApi<{ access_token: string; token_type: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
  register: async (userData: any) => {
    return fetchApi<{ access_token: string; token_type: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
  getMe: async () => {
    return fetchApi<any>('/auth/me');
  },
  switchDemoPersona: async (role: 'candidate' | 'recruiter' | 'employee') => {
    return fetchApi<{ access_token: string; token_type: string; user: any }>(`/auth/switch-demo-persona?role=${role}`, {
      method: 'POST',
    });
  },
};

// ---------------- JOBS API ---------------- //
export const jobsApi = {
  getJobs: async (params: Record<string, string | number | undefined> = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '' && v !== 'All') {
        query.append(k, String(v));
      }
    });
    return fetchApi<any[]>(`/jobs?${query.toString()}`);
  },
  getJobById: async (jobId: number) => {
    return fetchApi<any>(`/jobs/${jobId}`);
  },
  getJobIntelligence: async (jobId: number) => {
    return fetchApi<any>(`/jobs/${jobId}/insider-intelligence`);
  },
  createJob: async (jobData: any) => {
    return fetchApi<any>('/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
  },
  toggleSaveJob: async (jobId: number) => {
    return fetchApi<{ saved: boolean; message: string }>(`/jobs/${jobId}/save`, {
      method: 'POST',
    });
  },
};

// ---------------- APPLICATIONS API ---------------- //
export const applicationsApi = {
  getMyPipeline: async () => {
    return fetchApi<any[]>('/applications/my-pipeline');
  },
  apply: async (data: { job_id: number; resume_text?: string; cover_letter?: string; candidate_notes?: string }) => {
    return fetchApi<any>('/applications/apply', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  updateStatus: async (applicationId: number, statusData: any) => {
    return fetchApi<any>(`/applications/${applicationId}/status`, {
      method: 'PATCH',
      body: JSON.stringify(statusData),
    });
  },
  getJobApplicants: async (jobId: number) => {
    return fetchApi<any[]>(`/applications/job/${jobId}/applicants`);
  },
};

// ---------------- COMMUNITY API ---------------- //
export const communityApi = {
  getPosts: async (params: Record<string, string | undefined> = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v && v !== 'all') query.append(k, v);
    });
    return fetchApi<any[]>(`/community/posts?${query.toString()}`);
  },
  getPostDetail: async (postId: number) => {
    return fetchApi<any>(`/community/posts/${postId}`);
  },
  getPostComments: async (postId: number) => {
    return fetchApi<any[]>(`/community/posts/${postId}/comments`);
  },
  createPost: async (postData: any) => {
    return fetchApi<any>('/community/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  },
  addComment: async (postId: number, commentData: { content: string; parent_id?: number | null; is_anonymous?: boolean }) => {
    return fetchApi<any>(`/community/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify(commentData),
    });
  },
  upvotePost: async (postId: number) => {
    return fetchApi<{ id: number; upvotes: number }>(`/community/posts/${postId}/upvote`, {
      method: 'POST',
    });
  },
};

// ---------------- REFERRALS API ---------------- //
export const referralsApi = {
  getListings: async (params: Record<string, string | undefined> = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v && v !== 'All') query.append(k, v);
    });
    return fetchApi<any[]>(`/referrals/listings?${query.toString()}`);
  },
  createListing: async (listingData: any) => {
    return fetchApi<any>('/referrals/listings', {
      method: 'POST',
      body: JSON.stringify(listingData),
    });
  },
  requestReferral: async (requestData: any) => {
    return fetchApi<any>('/referrals/requests', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  },
  getMyRequests: async () => {
    return fetchApi<any[]>('/referrals/my-requests');
  },
  getIncomingRequests: async () => {
    return fetchApi<any[]>('/referrals/incoming-requests');
  },
  reviewRequest: async (requestId: number, status: string, reviewerNote?: string) => {
    return fetchApi<any>(`/referrals/requests/${requestId}/review?status=${status}&reviewer_note=${encodeURIComponent(reviewerNote || '')}`, {
      method: 'PATCH',
    });
  },
};

// ---------------- AI COPILOT API ---------------- //
export const aiApi = {
  analyzeResume: async (data: { resume_text: string; job_description?: string; target_role?: string }) => {
    return fetchApi<any>('/ai/analyze-resume', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  startMockInterview: async (data: { job_id?: number; job_title: string; company_name?: string; seniority?: string; focus_area?: string }) => {
    return fetchApi<any>('/ai/mock-interview/start', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  submitMockAnswer: async (data: { session_id: string; question_id: number; question: string; category: string; user_answer: string }) => {
    return fetchApi<any>('/ai/mock-interview/submit-answer', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  generateCoverLetter: async (data: { job_title: string; company_name: string; job_description: string; candidate_skills: string[]; candidate_experience: string; tone?: string }) => {
    return fetchApi<any>('/ai/generate-cover-letter', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  getSalaryBenchmark: async (data: { role_title: string; experience_years: number; location: string; tech_stack?: string[] }) => {
    return fetchApi<any>('/ai/salary-benchmark', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// ---------------- SALARIES API ---------------- //
export const salariesApi = {
  getSalaries: async (company?: string, title?: string) => {
    const query = new URLSearchParams();
    if (company) query.append('company', company);
    if (title) query.append('title', title);
    return fetchApi<{ summary: any; reports: any[] }>(`/salaries?${query.toString()}`);
  },
};

// ---------------- USER API ---------------- //
export const usersApi = {
  getProfile: async (userId: number) => {
    return fetchApi<any>(`/users/${userId}`);
  },
  updateProfile: async (profileData: any) => {
    return fetchApi<any>('/users/profile', {
      method: 'PATCH',
      body: JSON.stringify(profileData),
    });
  },
};
