/**
 * CareerBrew Global TypeScript Type Definitions
 */

export type UserRole = 'candidate' | 'recruiter' | 'employee';

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  headline?: string;
  bio?: string;
  location?: string;
  target_role?: string;
  years_of_experience?: number;
  skills?: string[];
  company?: string;
  is_verified_employee?: boolean;
  portfolio_url?: string;
  github_url?: string;
  linkedin_url?: string;
  karma_points: number;
  resume_text?: string;
  created_at: string;
}

export interface Job {
  id: number;
  title: string;
  company: string;
  company_logo?: string;
  location: string;
  workplace_type: 'Remote' | 'Hybrid' | 'Onsite';
  employment_type: 'Full-time' | 'Contract' | 'Internship';
  experience_level: 'Entry-level' | 'Mid-level' | 'Senior' | 'Lead' | 'Staff';
  department: string;
  salary_min: number;
  salary_max: number;
  salary_currency: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  tech_stack: string[];
  recruiter_id?: number;
  views_count: number;
  applications_count: number;
  is_active: boolean;
  is_featured?: boolean;
  created_at: string;
  is_saved?: boolean;
  ai_match_score?: number;
}

export type ApplicationStatus = 'bookmarked' | 'applied' | 'screening' | 'interview' | 'offer' | 'rejected';

export interface Application {
  id: number;
  job_id: number;
  user_id: number;
  status: ApplicationStatus;
  match_score: number;
  resume_text?: string;
  cover_letter?: string;
  candidate_notes?: string;
  interview_date?: string;
  salary_offered?: number;
  recruiter_feedback?: string;
  applied_at: string;
  updated_at: string;
  job?: Job;
  user?: User;
}

export type CommunityChannel = 'general' | 'interview-prep' | 'salary-talk' | 'referrals' | 'resume-review' | 'company-culture';

export interface CommunityPost {
  id: number;
  author_id: number;
  channel: CommunityChannel;
  title: string;
  content: string;
  tags: string[];
  is_anonymous: boolean;
  upvotes: number;
  downvotes: number;
  views_count: number;
  linked_company?: string;
  linked_job_id?: number;
  is_solved: boolean;
  created_at: string;
  author_name?: string;
  author_avatar?: string;
  author_headline?: string;
  author_company?: string;
  comments_count: number;
  has_upvoted?: boolean;
}

export interface PostComment {
  id: number;
  post_id: number;
  author_id: number;
  parent_id?: number | null;
  content: string;
  upvotes: number;
  is_anonymous: boolean;
  created_at: string;
  author_name?: string;
  author_avatar?: string;
  author_headline?: string;
  author_company?: string;
  replies?: PostComment[];
}

export interface ReferralListing {
  id: number;
  employee_id: number;
  company: string;
  company_logo?: string;
  role_category: string;
  description: string;
  requirements_summary?: string;
  max_referrals_per_month: number;
  successful_referrals: number;
  is_active: boolean;
  created_at: string;
  employee_name?: string;
  employee_avatar?: string;
  employee_headline?: string;
}

export type ReferralStatus = 'pending' | 'accepted' | 'submitted' | 'declined';

export interface ReferralRequest {
  id: number;
  listing_id: number;
  candidate_id: number;
  target_job_url?: string;
  target_role_title: string;
  pitch: string;
  portfolio_url?: string;
  resume_snippet?: string;
  match_score: number;
  status: ReferralStatus;
  reviewer_note?: string;
  created_at: string;
  updated_at: string;
  listing?: ReferralListing;
  candidate?: User;
}

export interface SkillMatchItem {
  skill: string;
  status: 'matched' | 'missing' | 'partial';
  importance: 'critical' | 'recommended' | 'bonus';
}

export interface ResumeAnalysisResult {
  overall_score: number;
  ats_compatibility_score: number;
  skills_match_score: number;
  experience_impact_score: number;
  brevity_formatting_score: number;
  matched_skills: string[];
  missing_skills: string[];
  skill_breakdown: SkillMatchItem[];
  strengths: string[];
  areas_for_improvement: string[];
  tailored_bullet_suggestions: {
    original: string;
    optimized: string;
    impact_boost: string;
  }[];
  recommended_keywords: string[];
  summary_verdict: string;
}

export interface InterviewQuestion {
  id: number;
  category: string;
  question: string;
  context: string;
  rubric_hints: string[];
}

export interface MockInterviewSession {
  session_id: string;
  job_title: string;
  company_name: string;
  total_questions: number;
  questions: InterviewQuestion[];
}

export interface MockAnswerFeedback {
  score: number;
  star_method_analysis: {
    Situation: string;
    Task: string;
    Action: string;
    Result: string;
  };
  strengths: string[];
  critiques: string[];
  ideal_sample_response: string;
  key_takeaways: string;
}

export interface SalaryReport {
  id: number;
  company: string;
  title: string;
  level: string;
  base_salary: number;
  bonus: number;
  equity: number;
  total_comp: number;
  location: string;
  years_of_experience: number;
  is_verified: boolean;
  created_at: string;
}
