/**
 * CareerBrew Seed / Fallback Dataset
 * Used for instant rendering and resilient offline fallback.
 */
import { User, Job, Application, CommunityPost, ReferralListing, SalaryReport } from '@/types';

export const INITIAL_USER: User = {
  id: 1,
  email: 'alex.rivera@example.com',
  full_name: 'Alex Rivera',
  role: 'candidate',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  headline: 'Senior Full-Stack Engineer | React, Next.js, Python, System Design',
  bio: 'Passionate full-stack developer with 5+ years of experience building high-throughput web applications, real-time architectures, and developer tools.',
  location: 'San Francisco, CA (Open to Remote)',
  target_role: 'Staff / Senior Full-Stack Engineer',
  years_of_experience: 5.5,
  skills: ['React', 'Next.js', 'TypeScript', 'Python', 'FastAPI', 'PostgreSQL', 'Docker', 'Tailwind CSS', 'GraphQL', 'Redis', 'System Design', 'AWS'],
  resume_text: `Alex Rivera - Senior Full-Stack Engineer
alex.rivera@example.com | San Francisco, CA | github.com/alexrivera | linkedin.com/in/alexrivera

SUMMARY:
Results-driven Senior Full-Stack Engineer with 5+ years architecting mission-critical, scalable web systems. Specialized in TypeScript, React, Next.js, Python, and cloud-native microservices. Track record of cutting API latency by 40% and leading high-velocity engineering sprints.

EXPERIENCE:
Senior Full-Stack Engineer @ CloudScale Technologies (2022 - Present)
- Architected and shipped event-driven workflow engine supporting 12M daily operations using Next.js 14, FastAPI, and Redis.
- Reduced p99 API response times from 350ms to 65ms by implementing optimized PostgreSQL query indexing and connection pooling.
- Mentored a team of 6 engineers, standardizing TypeScript typing, automated CI/CD GitHub Actions pipelines, and 90%+ test coverage.

Full-Stack Developer @ NovaApp Systems (2019 - 2022)
- Engineered real-time collaborative dashboard using React, WebSockets, and Node.js for 100k+ active SaaS enterprise users.
- Designed RESTful and GraphQL APIs integrated with Stripe payment gateways handling $4M+ monthly GMV.

EDUCATION:
B.S. in Computer Science - University of California, Berkeley (2015 - 2019)`,
  portfolio_url: 'https://alexrivera.dev',
  github_url: 'https://github.com/alexrivera',
  linkedin_url: 'https://linkedin.com/in/alexrivera',
  karma_points: 240,
  is_verified_employee: false,
  created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
};

export const MOCK_JOBS: Job[] = [
  {
    id: 1,
    title: 'Senior Full-Stack Engineer (Developer Experience)',
    company: 'Stripe',
    company_logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    location: 'San Francisco, CA / Remote',
    workplace_type: 'Remote',
    employment_type: 'Full-time',
    experience_level: 'Senior',
    department: 'Engineering',
    salary_min: 185000,
    salary_max: 245000,
    salary_currency: 'USD',
    description: 'We are seeking a Senior Full-Stack Engineer to lead the next generation of Stripe Developer Dashboard and CLI experiences. You will design ultra-responsive web interfaces paired with resilient, low-latency microservices that power financial infrastructure worldwide.',
    requirements: [
      '5+ years building scalable modern web applications with React, Next.js, and TypeScript',
      'Deep experience architecting RESTful and async backend services (Python/FastAPI, Go, or Ruby)',
      'Proven understanding of state management, client performance, and distributed systems',
      'Strong empathy for developer workflows and craftsmanship'
    ],
    responsibilities: [
      'Own end-to-end features on the Stripe Dashboard from technical design to global deployment',
      'Optimize critical rendering paths, cutting client load times and improving API interaction speed',
      'Collaborate with product managers, designers, and platform teams across global time zones'
    ],
    benefits: [
      '$185k - $245k Base + Top-Tier Stripe Equity (RSUs)',
      'Comprehensive Medical, Dental, Vision & 401(k) match',
      '$2,000 Annual WFH Home Office Stipend & Wellness budget',
      'Unlimited PTO & 16-week parental leave'
    ],
    tech_stack: ['React', 'Next.js', 'TypeScript', 'Python', 'FastAPI', 'PostgreSQL', 'Docker', 'AWS', 'Redis'],
    views_count: 342,
    applications_count: 18,
    is_featured: true,
    is_active: true,
    is_saved: false,
    ai_match_score: 94,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
  {
    id: 2,
    title: 'Staff Distributed Systems Engineer',
    company: 'Google',
    company_logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100&auto=format&fit=crop&q=80',
    location: 'Sunnyvale, CA / Hybrid',
    workplace_type: 'Hybrid',
    employment_type: 'Full-time',
    experience_level: 'Staff',
    department: 'Cloud Infrastructure',
    salary_min: 230000,
    salary_max: 310000,
    salary_currency: 'USD',
    description: 'Join Google Cloud Core Infrastructure to architect the global substrate powering next-generation AI workloads and high-throughput container scheduling. You will lead cross-organizational technical initiatives with multi-million dollar compute efficiency impact.',
    requirements: [
      '8+ years software engineering experience in Go, C++, or Rust',
      'Demonstrated mastery of distributed consensus protocols (Raft, Paxos), concurrency, and Linux internals',
      'Experience architecting multi-region failover and high-availability topologies'
    ],
    responsibilities: [
      'Architect core scheduling algorithms handling millions of daily compute jobs',
      'Drive reliability post-mortems and define architectural standards for 200+ engineers',
      'Partner with AI/ML research groups to accelerate distributed tensor compute training'
    ],
    benefits: [
      '$230k - $310k Base + Generous GSU Equity Package',
      'On-site gourmet cafeterias, wellness centers & micro-kitchens',
      'Generous 401(k) match, tuition reimbursement & conference budget'
    ],
    tech_stack: ['Go', 'Kubernetes', 'C++', 'Distributed Systems', 'GCP', 'Python', 'System Design'],
    views_count: 520,
    applications_count: 29,
    is_featured: true,
    is_active: true,
    is_saved: true,
    ai_match_score: 78,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
  },
  {
    id: 3,
    title: 'Senior Design Systems Technologist',
    company: 'Figma',
    company_logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    location: 'San Francisco, CA / Remote',
    workplace_type: 'Remote',
    employment_type: 'Full-time',
    experience_level: 'Senior',
    department: 'Product Design',
    salary_min: 175000,
    salary_max: 225000,
    salary_currency: 'USD',
    description: 'Help Figma define the future of design tooling and multi-platform component ecosystems. You will build accessible, high-performance UI primitives used by millions of product designers and frontend engineers worldwide.',
    requirements: [
      '4+ years specialized in frontend component architecture and design systems',
      'Mastery of modern CSS, Web Accessibility (WCAG 2.1 AAA), TypeScript, and React',
      'Passion for micro-interactions, animation performance, and token architectures'
    ],
    responsibilities: [
      'Maintain and scale the Figma Design Token & UI Primitive libraries',
      'Build automated visual regression and accessibility testing harnesses',
      'Partner closely with product design leads to craft delight-infused user experiences'
    ],
    benefits: [
      'Competitive Base + Equity Package',
      'Flexible Remote-first culture with biannual team offsites',
      'Annual $3,000 Learning & Craft development grant'
    ],
    tech_stack: ['React', 'TypeScript', 'Tailwind CSS', 'Figma', 'WebGL', 'CSS Architecture'],
    views_count: 289,
    applications_count: 14,
    is_featured: false,
    is_active: true,
    is_saved: false,
    ai_match_score: 88,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    id: 4,
    title: 'AI Systems & Prompt Optimization Engineer',
    company: 'OpenAI',
    company_logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    location: 'San Francisco, CA',
    workplace_type: 'Hybrid',
    employment_type: 'Full-time',
    experience_level: 'Senior',
    department: 'Applied AI',
    salary_min: 210000,
    salary_max: 290000,
    salary_currency: 'USD',
    description: 'We are building the interface between frontier LLM capabilities and practical developer productivity. You will engineer low-latency evaluation pipelines, context distillation layers, and agentic reasoning workflows.',
    requirements: [
      'Strong background in Python, PyTorch, LangChain, or LLM evaluation frameworks',
      'Experience building high-throughput streaming endpoints with FastAPI or gRPC',
      'Familiarity with vector embeddings, semantic retrieval (RAG), and model quantization'
    ],
    responsibilities: [
      'Design and ship evaluation pipelines for autonomous coding agents',
      'Optimize model inference token caching and streaming latency by >35%',
      'Publish open-source developer tooling and reference architectures'
    ],
    benefits: [
      '$210k - $290k Base + Substantial PPO Equity Grants',
      'Daily catered lunches & full health coverage',
      'Generous hardware and AI compute allowances'
    ],
    tech_stack: ['Python', 'FastAPI', 'PyTorch', 'LLM', 'Docker', 'PostgreSQL', 'Redis'],
    views_count: 710,
    applications_count: 45,
    is_featured: true,
    is_active: true,
    is_saved: false,
    ai_match_score: 82,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  },
  {
    id: 5,
    title: 'Frontend Platform & Performance Engineer',
    company: 'Vercel',
    company_logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    location: 'Remote (Global)',
    workplace_type: 'Remote',
    employment_type: 'Full-time',
    experience_level: 'Mid-level',
    department: 'Frontend Infrastructure',
    salary_min: 150000,
    salary_max: 195000,
    salary_currency: 'USD',
    description: 'Join the team making the web faster. You will work on Next.js core optimizations, edge routing heuristics, and developer dashboard telemetry.',
    requirements: [
      '3+ years building high-traffic web applications with Next.js & React',
      'Deep understanding of Edge Runtime, server-side caching, and Web Vitals',
      'Comfortable with TypeScript, AST transformations, and bundler internals'
    ],
    responsibilities: [
      'Contribute directly to Next.js open-source repository and Vercel dashboard',
      'Analyze runtime performance bottlenecks for high-profile customer websites',
      'Create interactive performance diagnostic tools for developers'
    ],
    benefits: [
      '100% Remote Global Freedom',
      'Competitive Salary & Pre-IPO Equity Options',
      'Health, Dental, Home Office Stipend & Annual Retreats'
    ],
    tech_stack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Edge Functions'],
    views_count: 415,
    applications_count: 22,
    is_featured: false,
    is_active: true,
    is_saved: false,
    ai_match_score: 96,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
  }
];

export const MOCK_APPLICATIONS: Application[] = [
  {
    id: 1,
    job_id: 1,
    user_id: 1,
    status: 'interview',
    match_score: 94,
    resume_text: INITIAL_USER.resume_text,
    cover_letter: 'Passionate about developer experience at Stripe.',
    candidate_notes: 'Technical screen passed with Hiring Lead. Next: System Design round on Thursday.',
    interview_date: new Date(Date.now() + 1000 * 60 * 60 * 72).toISOString(),
    applied_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    job: MOCK_JOBS[0],
    user: INITIAL_USER,
  },
  {
    id: 2,
    job_id: 2,
    user_id: 1,
    status: 'applied',
    match_score: 78,
    resume_text: INITIAL_USER.resume_text,
    cover_letter: 'Referred by David Kim (Staff Engineer).',
    candidate_notes: 'Submitted via employee referral portal.',
    applied_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    job: MOCK_JOBS[1],
    user: INITIAL_USER,
  },
  {
    id: 3,
    job_id: 3,
    user_id: 1,
    status: 'screening',
    match_score: 88,
    resume_text: INITIAL_USER.resume_text,
    candidate_notes: 'Recruiter phone chat scheduled.',
    interview_date: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    applied_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    job: MOCK_JOBS[2],
    user: INITIAL_USER,
  },
  {
    id: 4,
    job_id: 5,
    user_id: 1,
    status: 'offer',
    match_score: 96,
    salary_offered: 185000,
    candidate_notes: 'Offer letter received! Reviewing equity package & negotiating with AI playbook.',
    applied_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    job: MOCK_JOBS[4],
    user: INITIAL_USER,
  }
];

export const MOCK_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 1,
    author_id: 3,
    channel: 'interview-prep',
    title: "Inside Google's L5/L6 System Design Interview: What actually moves the needle in 2026",
    content: `Having sat on over 50 hiring committees at Google and Meta, here are the 4 common mistakes candidates make that kill an otherwise great interview:

1. **Jumping into tech stacks too fast:** Don't start drawing Kafka and Redis boxes in the first 2 minutes. Spend 5-8 minutes clarifying read/write ratios, QPS, latency SLAs, and data durability constraints.
2. **Ignoring failure domains:** What happens when your message broker crashes or a database replica falls 10 seconds behind? Always address backpressure, idempotency keys, and circuit breakers.
3. **Hand-wavy database indexing:** Saying "I'll use a SQL database" isn't enough. Specify B-Tree vs LSM-Tree trade-offs, composite index ordering, and partitioning keys.
4. **Not driving the conversation:** The interviewer wants to see you lead. Proactively mention 2 different architecture alternatives and justify why you picked Option B.

Drop your questions below—happy to do an impromptu AMA on distributed systems design!`,
    tags: ['Google', 'System Design', 'L5 Interview', 'Architecture', 'FAANG'],
    is_anonymous: false,
    upvotes: 142,
    downvotes: 3,
    views_count: 1850,
    linked_company: 'Google',
    linked_job_id: 2,
    is_solved: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    author_name: 'David Kim',
    author_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    author_headline: 'Staff SWE @ Google Cloud | Ex-Meta',
    author_company: 'Google',
    comments_count: 19,
  },
  {
    id: 2,
    author_id: 1,
    channel: 'salary-talk',
    title: 'Negotiated Stripe Senior SWE Offer from $195k to $235k base + $120k equity (Here is the exact script)',
    content: `Just signed my offer and wanted to share complete transparency with the community!

Initial Offer:
- Base: $195,000
- RSUs: $80,000 / yr
- Sign-on: $15,000
- Total Comp Year 1: $290,000

Final Accepted Offer:
- Base: $235,000 (+20.5%)
- RSUs: $115,000 / yr
- Sign-on: $25,000
- Total Comp Year 1: $375,000

**What worked:**
1. Kept communication polite, enthusiastic, and anchored on third-party market data from CareerBrew / Levels.
2. Never said "I need more money"—instead framed it as: "Given my background in high-throughput API architecture and multiple competing discussions, I am looking for a total compensation target of $370k to sign today."
3. Waited until I had all written feedback before discussing numbers.

Hope this helps anyone in final round negotiations right now!`,
    tags: ['Stripe', 'Salary', 'Negotiation', 'Total Comp', 'Senior Engineer'],
    is_anonymous: false,
    upvotes: 218,
    downvotes: 2,
    views_count: 3200,
    linked_company: 'Stripe',
    linked_job_id: 1,
    is_solved: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    author_name: 'Alex Rivera',
    author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    author_headline: 'Senior Full-Stack Engineer',
    author_company: 'CloudScale',
    comments_count: 34,
  },
  {
    id: 3,
    author_id: 4,
    channel: 'resume-review',
    title: 'The #1 reason tech resumes get discarded by ATS in 2026 (And how to fix it)',
    content: `As a hiring manager and designer who regularly screens frontend applications, 80% of resumes fail because they list 'responsibilities' instead of 'quantified outcomes'.

Instead of:
❌ *'Responsible for maintaining company design system and components.'*

Write this:
✅ *'Architected 45+ reusable accessible React/TypeScript UI primitives, accelerating feature development by 30% and reducing UI bug reports by 48% across 4 product teams.'*

If you want your resume reviewed, drop your bullet points below and I'll give honest actionable critique!`,
    tags: ['Resume', 'ATS', 'Career Advice', 'Frontend', 'Hiring'],
    is_anonymous: false,
    upvotes: 97,
    downvotes: 1,
    views_count: 1420,
    linked_company: 'Figma',
    linked_job_id: 3,
    is_solved: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    author_name: 'Elena Rostova',
    author_avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    author_headline: 'Staff Design Technologist @ Figma',
    author_company: 'Figma',
    comments_count: 27,
  }
];

export const MOCK_REFERRAL_LISTINGS: ReferralListing[] = [
  {
    id: 1,
    employee_id: 3,
    company: 'Google',
    company_logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100&auto=format&fit=crop&q=80',
    role_category: 'Engineering & Cloud',
    description: "I'm a Staff SWE in Google Cloud. I am happy to refer qualified engineers for L4/L5/L6 software roles, SRE, and Cloud Infrastructure across US offices.",
    requirements_summary: 'Target job ID from google.com/careers, GitHub/portfolio link, and 2-sentence technical summary.',
    max_referrals_per_month: 5,
    successful_referrals: 12,
    is_active: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
    employee_name: 'David Kim',
    employee_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    employee_headline: 'Staff Software Engineer @ Google Cloud',
  },
  {
    id: 2,
    employee_id: 4,
    company: 'Figma',
    company_logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    role_category: 'Design & Frontend',
    description: 'Referring strong product designers, design technologists, and frontend platform engineers for Figma SF & NYC hubs.',
    requirements_summary: 'Link your live portfolio or GitHub repositories showcasing component architecture or interaction craftsmanship.',
    max_referrals_per_month: 4,
    successful_referrals: 6,
    is_active: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
    employee_name: 'Elena Rostova',
    employee_avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    employee_headline: 'Staff Design Technologist @ Figma',
  },
  {
    id: 3,
    employee_id: 2,
    company: 'Stripe',
    company_logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    role_category: 'Full-Stack & Infra',
    description: 'Direct recruiter referral fast-track for backend, full-stack, and infrastructure roles across North America.',
    requirements_summary: 'Attach updated resume and target role title. ATS match score >= 75% preferred.',
    max_referrals_per_month: 10,
    successful_referrals: 24,
    is_active: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25).toISOString(),
    employee_name: 'Sarah Chen',
    employee_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    employee_headline: 'Principal Talent Lead @ Stripe',
  }
];

export const MOCK_SALARIES: SalaryReport[] = [
  { id: 1, company: 'Google', title: 'Staff Software Engineer', level: 'L6', base_salary: 285000, bonus: 55000, equity: 240000, total_comp: 580000, location: 'Sunnyvale, CA', years_of_experience: 9.0, is_verified: true, created_at: new Date().toISOString() },
  { id: 2, company: 'OpenAI', title: 'Member of Technical Staff', level: 'MTS', base_salary: 260000, bonus: 40000, equity: 250000, total_comp: 550000, location: 'San Francisco, CA', years_of_experience: 7.0, is_verified: true, created_at: new Date().toISOString() },
  { id: 3, company: 'Stripe', title: 'Senior Full-Stack Engineer', level: 'L4 / L5', base_salary: 225000, bonus: 25000, equity: 110000, total_comp: 360000, location: 'San Francisco, CA', years_of_experience: 5.5, is_verified: true, created_at: new Date().toISOString() },
  { id: 4, company: 'Figma', title: 'Senior Design Technologist', level: 'IC4', base_salary: 195000, bonus: 20000, equity: 85000, total_comp: 300000, location: 'San Francisco, CA', years_of_experience: 6.0, is_verified: true, created_at: new Date().toISOString() },
  { id: 5, company: 'Vercel', title: 'Senior Frontend Engineer', level: 'IC3', base_salary: 180000, bonus: 15000, equity: 70000, total_comp: 265000, location: 'Remote', years_of_experience: 4.5, is_verified: true, created_at: new Date().toISOString() }
];
