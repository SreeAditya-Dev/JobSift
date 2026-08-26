import { User } from '@/types';

export const INITIAL_USER: User = {
  id: 1,
  email: 'alex.rivera@example.com',
  full_name: 'Alex Rivera',
  role: 'candidate',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  headline: 'Senior Full-Stack Engineer',
  bio: 'Building scalable web products & distributed microservices.',
  location: 'San Francisco, CA',
  target_role: 'Staff Full-Stack Engineer',
  years_of_experience: 5.5,
  skills: ['React', 'Next.js', 'TypeScript', 'Python', 'FastAPI', 'PostgreSQL', 'Docker', 'System Design'],
  company: '',
  is_verified_employee: false,
  portfolio_url: 'https://alexrivera.dev',
  github_url: 'https://github.com/alexrivera',
  linkedin_url: 'https://linkedin.com/in/alexrivera',
  karma_points: 100,
  resume_text: '',
  created_at: new Date().toISOString(),
};
