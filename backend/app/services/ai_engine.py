"""
JobSift AI Engine - Intelligent ATS Matcher, Mock Interviewer & Career Copilot
Provides rule-based + heuristic semantic parsing & AI generation logic with high accuracy and resilience.
"""
import re
import uuid
from typing import List, Dict, Any
from app.schemas.schemas import (
    ResumeAnalysisResponse, SkillMatchItem, MockInterviewStartResponse,
    InterviewQuestion, MockInterviewAnswerFeedback, CoverLetterResponse,
    SalaryBenchmarkResponse
)

# Common high-demand tech skills dictionary for deep keyword mapping
SKILL_TAXONOMY = {
    "frontend": ["react", "next.js", "typescript", "javascript", "tailwind css", "vue", "angular", "html5", "css3", "redux", "graphql", "zustand", "webpack", "vite"],
    "backend": ["python", "fastapi", "django", "node.js", "express", "go", "golang", "java", "spring boot", "c#", ".net", "rust", "microservices", "rest api", "grpc"],
    "database": ["postgresql", "mysql", "mongodb", "redis", "elasticsearch", "sqlite", "dynamodb", "prisma", "sqlalchemy"],
    "devops_cloud": ["docker", "kubernetes", "aws", "gcp", "azure", "ci/cd", "github actions", "terraform", "linux", "nginx", "prometheus", "grafana"],
    "ai_ml": ["machine learning", "deep learning", "pytorch", "tensorflow", "langchain", "llm", "rag", "huggingface", "nlp", "computer vision", "scikit-learn", "pandas", "numpy"],
    "architecture": ["system design", "distributed systems", "scalable architecture", "event-driven architecture", "caching", "database indexing", "load balancing", "message queues", "kafka", "rabbitmq"],
    "soft_skills": ["agile", "scrum", "cross-functional collaboration", "mentorship", "code review", "system ownership", "problem solving", "stakeholder communication"]
}

ALL_KNOWN_SKILLS = set()
for category_skills in SKILL_TAXONOMY.values():
    ALL_KNOWN_SKILLS.update(category_skills)


def extract_skills_from_text(text: str) -> List[str]:
    """Extract known technical and soft skills from raw text"""
    text_lower = text.lower()
    found_skills = []
    
    for skill in ALL_KNOWN_SKILLS:
        # Match word boundary or exact phrase
        pattern = r'\b' + re.escape(skill) + r'\b'
        if re.search(pattern, text_lower):
            found_skills.append(skill.title() if len(skill) > 3 else skill.upper())
            
    # Also extract common programming acronyms and words
    custom_patterns = [
        ("Next.js", r'next(?:\.js|\s*js)'),
        ("Node.js", r'node(?:\.js|\s*js)'),
        ("Vue.js", r'vue(?:\.js|\s*js)'),
        ("CI/CD", r'ci\s*/\s*cd'),
        ("REST API", r'rest(?:ful)?\s*api'),
        ("GraphQL", r'graphql'),
        ("TypeScript", r'typescript|ts\b'),
        ("PostgreSQL", r'postgres(?:ql)?'),
        ("FastAPI", r'fastapi'),
        ("Kubernetes", r'kubernetes|k8s\b'),
        ("Docker", r'docker'),
        ("Tailwind CSS", r'tailwind(?:\s*css)?'),
    ]
    for name, pat in custom_patterns:
        if re.search(pat, text_lower) and name not in found_skills:
            found_skills.append(name)
            
    return sorted(list(set(found_skills)))


def analyze_resume_fit(resume_text: str, job_description: str = "", target_role: str = "") -> ResumeAnalysisResponse:
    """Analyze resume text vs job description / target role and generate ATS score & actionable suggestions"""
    resume_skills = extract_skills_from_text(resume_text)
    
    if not job_description:
        # Default baseline job description if none provided
        job_description = f"""
        Seeking an experienced {target_role or 'Software Engineer'} with strong proficiency in React, TypeScript, Next.js, 
        Python, FastAPI, System Design, REST APIs, PostgreSQL, Docker, CI/CD, and agile development. 
        Must have proven track record in distributed architecture, scalability, code reviews, and high-impact deliverables.
        """
        
    jd_skills = extract_skills_from_text(job_description)
    if not jd_skills:
        jd_skills = ["React", "TypeScript", "Python", "FastAPI", "System Design", "Docker", "PostgreSQL", "CI/CD"]
        
    matched_skills = [s for s in jd_skills if any(s.lower() == r.lower() for r in resume_skills)]
    missing_skills = [s for s in jd_skills if not any(s.lower() == r.lower() for r in resume_skills)]
    
    # Calculate scores
    total_jd_skills = max(len(jd_skills), 1)
    skills_match_ratio = len(matched_skills) / total_jd_skills
    skills_score = int(skills_match_ratio * 100)
    
    # Impact score based on action verbs and metrics (percentages, numbers, dollars)
    metric_count = len(re.findall(r'\b\d+(?:%|\+?x|\s*k|\s*m|\s*users|\s*ms)?\b', resume_text))
    action_verb_count = len(re.findall(r'\b(architected|developed|spearheaded|optimized|scaled|reduced|increased|led|delivered|implemented|engineered)\b', resume_text, re.IGNORECASE))
    
    experience_impact_score = min(98, max(45, int((metric_count * 5) + (action_verb_count * 6) + 30)))
    
    # Formatting score
    brevity_formatting_score = 90
    if len(resume_text.split()) < 100:
        brevity_formatting_score = 50
    elif len(resume_text.split()) > 1200:
        brevity_formatting_score = 70
        
    ats_score = int((skills_score * 0.45) + (experience_impact_score * 0.35) + (brevity_formatting_score * 0.20))
    overall_score = min(99, max(40, int(ats_score)))
    
    # Build detailed skill breakdown
    skill_breakdown = []
    for s in jd_skills:
        is_matched = any(s.lower() == r.lower() for r in resume_skills)
        skill_breakdown.append(SkillMatchItem(
            skill=s,
            status="matched" if is_matched else "missing",
            importance="critical" if s in jd_skills[:4] else "recommended"
        ))
        
    # Strengths
    strengths = []
    if matched_skills:
        strengths.append(f"Demonstrated core proficiency in key required technologies: {', '.join(matched_skills[:4])}.")
    if metric_count >= 3:
        strengths.append("Strong usage of quantitative impact metrics and measurable KPIs in project descriptions.")
    if action_verb_count >= 4:
        strengths.append("High-energy leadership action verbs ('Architected', 'Spearheaded', 'Optimized') highlighting ownership.")
    if not strengths:
        strengths.append("Clean baseline structure with relevant technical domain orientation.")
        
    # Areas for improvement
    areas = []
    if missing_skills:
        areas.append(f"Incorporate missing target keywords required by recruiter ATS filters: {', '.join(missing_skills[:5])}.")
    if metric_count < 3:
        areas.append("Quantify your project outcomes (e.g., 'Reduced API latency by 42%', 'Scaled system to 50k DAUs').")
    if brevity_formatting_score < 80:
        areas.append("Adjust length to standard 1-page format (around 450-700 concise words).")
        
    # Tailored bullet suggestions
    tailored_bullet_suggestions = [
        {
            "original": "Worked on backend APIs and fixed database performance issues.",
            "optimized": f"Architected high-throughput asynchronous REST endpoints using {missing_skills[0] if missing_skills else 'FastAPI'}, reducing database query bottlenecks by 38% and supporting 15k concurrent requests.",
            "impact_boost": "+45% Recruiter Catch Rate"
        },
        {
            "original": "Built frontend web interface with React components.",
            "optimized": f"Engineered responsive, accessible single-page web app utilizing {matched_skills[0] if matched_skills else 'Next.js & TypeScript'}, cutting Core Web Vitals LCP from 2.8s to 0.9s.",
            "impact_boost": "+35% ATS Relevance"
        }
    ]
    
    verdict = (
        "Strong competitive profile! With minor keyword alignment in missing skill areas, your resume stands in the top 15% tier for this role."
        if overall_score >= 80 else
        "Good foundation with notable potential. Integrate the recommended missing keywords and quantify your past achievements to surpass recruiter screening filters."
    )
    
    return ResumeAnalysisResponse(
        overall_score=overall_score,
        ats_compatibility_score=ats_score,
        skills_match_score=skills_score,
        experience_impact_score=experience_impact_score,
        brevity_formatting_score=brevity_formatting_score,
        matched_skills=matched_skills,
        missing_skills=missing_skills,
        skill_breakdown=skill_breakdown,
        strengths=strengths,
        areas_for_improvement=areas,
        tailored_bullet_suggestions=tailored_bullet_suggestions,
        recommended_keywords=missing_skills[:6] + ["Distributed Architecture", "End-to-End Testing", "API Gateways"],
        summary_verdict=verdict
    )


# Curated question bank for interactive mock interviews
QUESTION_BANK = {
    "Engineering": [
        {
            "category": "Behavioral (STAR Method)",
            "question": "Tell me about a high-stakes technical disagreement you had with a teammate or tech lead. How did you handle it and what was the outcome?",
            "context": "Evaluates conflict resolution, technical humility, emotional intelligence, and objective decision-making.",
            "rubric_hints": ["Use STAR format", "Highlight objective data/benchmarks used", "Show empathy and constructive resolution", "Share what you learned"]
        },
        {
            "category": "System Design & Architecture",
            "question": "How would you design a distributed real-time notification engine that can fan-out 5 million push notifications and emails within 60 seconds with 99.99% delivery guarantee?",
            "context": "Evaluates architectural scalability, message queues, idempotency, rate limiting, and failure recovery.",
            "rubric_hints": ["Clarify requirements and scale", "Propose queue architecture (Kafka / RabbitMQ)", "Discuss backpressure and worker pools", "Address idempotency and retry dead-letter queues"]
        },
        {
            "category": "Technical Deep Dive",
            "question": "Explain how React 19's Server Components, hydration lifecycle, and concurrent rendering work under the hood. When would you avoid SSR?",
            "context": "Tests modern frontend engine internals, performance optimization, and pragmatic technical trade-offs.",
            "rubric_hints": ["Explain server vs client boundary", "Describe streaming SSR and suspense", "Discuss bundle size benefits vs state constraints", "Provide real-world production trade-offs"]
        },
        {
            "category": "Problem Solving & Incident Response",
            "question": "Imagine your production API response time suddenly spikes from 80ms to 4500ms after a routine deployment. Walk me through your step-by-step triage and mitigation strategy.",
            "context": "Assesses systematic troubleshooting, monitoring observability, rollback prudence, and root-cause analysis.",
            "rubric_hints": ["Immediate mitigation (rollback / traffic routing)", "Investigate logs, metrics, APM traces", "Check DB connection pool / query locks", "Conduct blameless post-mortem"]
        }
    ]
}


def start_mock_interview(job_title: str, company_name: str = "", seniority: str = "Mid-level") -> MockInterviewStartResponse:
    """Initialize a tailored mock interview session with dynamic questions"""
    session_id = f"interview-{uuid.uuid4().hex[:8]}"
    questions_list = []
    
    base_questions = QUESTION_BANK.get("Engineering", [])
    for idx, q in enumerate(base_questions, start=1):
        questions_list.append(InterviewQuestion(
            id=idx,
            category=q["category"],
            question=q["question"],
            context=q["context"],
            rubric_hints=q["rubric_hints"]
        ))
        
    return MockInterviewStartResponse(
        session_id=session_id,
        job_title=job_title,
        company_name=company_name or "Tech Innovation Corp",
        total_questions=len(questions_list),
        questions=questions_list
    )


def evaluate_mock_answer(question: str, category: str, user_answer: str) -> MockInterviewAnswerFeedback:
    """Analyze the candidate's interview answer and generate structured feedback using STAR & rubrics"""
    word_count = len(user_answer.split())
    answer_lower = user_answer.lower()
    
    # Heuristic scoring based on depth, structure, and keywords
    has_situation = any(k in answer_lower for k in ["when", "at my previous", "project", "scenario", "context", "situation"])
    has_task = any(k in answer_lower for k in ["goal", "task", "objective", "needed to", "responsible for", "problem was"])
    has_action = any(k in answer_lower for k in ["i implemented", "i designed", "i led", "i optimized", "i proposed", "i decided", "action", "we built"])
    has_result = any(k in answer_lower for k in ["result", "outcome", "reduced", "increased", "improved", "ultimately", "achieved", "%", "metric"])
    
    base_score = 60
    if word_count > 60:
        base_score += 10
    if word_count > 120:
        base_score += 10
    if has_situation and has_task:
        base_score += 8
    if has_action:
        base_score += 8
    if has_result:
        base_score += 8
        
    score = min(96, max(45, base_score))
    
    strengths = []
    if word_count >= 80:
        strengths.append("Great depth and technical narrative clarity.")
    if has_action:
        strengths.append("Clearly highlighted your specific individual contributions and proactive ownership.")
    if has_result:
        strengths.append("Effective articulation of business and technical impact metrics.")
    if not strengths:
        strengths.append("Addressed the question promptly with relevant domain focus.")
        
    critiques = []
    if not has_result:
        critiques.append("Strengthen your answer by closing with concrete quantifiable results (e.g., latency dropped by 30%, user satisfaction up by 25%).")
    if word_count < 60:
        critiques.append("Elaborate further on architectural trade-offs, alternative approaches considered, and lessons learned.")
    if not has_situation:
        critiques.append("Frame the context upfront clearly using the STAR method: Situation -> Task -> Action -> Result.")
        
    sample_ideal = (
        "In my previous role at a high-growth SaaS platform, we encountered an architectural bottleneck where database queries caused 3s latency during traffic surges. "
        "My objective was to decrease latency below 200ms while maintaining zero data loss. "
        "I spearheaded the migration to an asynchronous event pipeline using Redis caching, PostgreSQL read replicas, and message queuing with Kafka. "
        "As a result, API response times dropped by 78% (down to 65ms p99), and our service successfully handled a 4x Black Friday traffic surge with 99.99% uptime."
    )
    
    return MockInterviewAnswerFeedback(
        score=score,
        star_method_analysis={
            "Situation": "Clear context provided" if has_situation else "Needs clearer background framing",
            "Task": "Well identified responsibility" if has_task else "Explicitly define what challenge you were solving",
            "Action": "Strong personal leadership" if has_action else "Detail your personal step-by-step execution",
            "Result": "Quantified positive impact" if has_result else "Close with measurable metric outcomes"
        },
        strengths=strengths,
        critiques=critiques,
        ideal_sample_response=sample_ideal,
        key_takeaways="Focus on active voice ('I engineered', 'I facilitated'), tie technical choices directly to business outcomes, and always include what you'd do differently with hindsight."
    )


def generate_cover_letter(job_title: str, company_name: str, job_description: str, candidate_skills: List[str], candidate_experience: str, tone: str = "Confident") -> CoverLetterResponse:
    """Generate custom tailored cover letter & cold outreach DM"""
    skills_str = ", ".join(candidate_skills[:4]) if candidate_skills else "modern web architecture, cloud scalability, and distributed systems"
    
    cover_letter = f"""Dear Hiring Team at {company_name},

I am writing to express my strong interest in the {job_title} position. Having closely followed {company_name}'s rapid innovation in developer experience and digital products, I am excited by the opportunity to bring my hands-on background in {skills_str} to your team.

Throughout my career, I have specialized in building robust, scalable products that bridge complex technical capabilities with intuitive user experiences. In my previous work ({candidate_experience or 'engineering high-performance web systems'}), I successfully spearheaded architecture overhauls that improved system throughput, elevated code standards, and accelerated release velocity.

What draws me specifically to {company_name} is your commitment to high engineering velocity without sacrificing product craftsmanship. I thrive in collaborative, high-ownership cultures where I can contribute to mission-critical systems and mentor fellow engineers.

I would welcome the opportunity to discuss how my technical expertise and passion for engineering excellence align with the upcoming roadmap for the {job_title} role at {company_name}.

Thank you for your time and consideration.

Warm regards,
Alex Rivera
"""

    cold_outreach = (
        f"Hi [Hiring Manager / Recruiter Name],\n\n"
        f"I came across the {job_title} opening at {company_name} and was immediately drawn to your work. "
        f"With deep expertise in {skills_str}, I recently scaled similar distributed architectures with notable latency and conversion improvements. "
        f"I’d love to connect and share how my background could support your team's current goals. Are you open to a brief 10-minute chat this week?\n\n"
        f"Best,\nAlex"
    )

    return CoverLetterResponse(
        cover_letter=cover_letter.strip(),
        key_selling_points=[
            f"Direct alignment with {company_name}'s tech stack ({skills_str}).",
            "Proven history of high-ownership delivery and performance optimization.",
            "Concise, metric-oriented pitch optimized for recruiter engagement."
        ],
        cold_outreach_dm=cold_outreach
    )


def get_salary_benchmark(role_title: str, experience_years: float, location: str, tech_stack: List[str] = None) -> SalaryBenchmarkResponse:
    """Compute real-world market salary distributions and negotiation playbook"""
    base = 120000
    # Location multiplier
    loc_lower = location.lower()
    mult = 1.0
    if "san francisco" in loc_lower or "sf" in loc_lower or "bay area" in loc_lower or "new york" in loc_lower or "nyc" in loc_lower:
        mult = 1.35
    elif "seattle" in loc_lower or "remote" in loc_lower or "boston" in loc_lower:
        mult = 1.2
    elif "austin" in loc_lower or "london" in loc_lower or "toronto" in loc_lower:
        mult = 1.1
    elif "bangalore" in loc_lower or "india" in loc_lower:
        # standard USD converted benchmark
        mult = 0.55

    # Experience calculation
    yoe_boost = int(experience_years * 9500)
    median = int((base + yoe_boost) * mult)
    p25 = int(median * 0.85)
    p75 = int(median * 1.18)
    p90 = int(median * 1.38)

    return SalaryBenchmarkResponse(
        role_title=role_title,
        location=location or "United States / Remote",
        p25_salary=p25,
        median_salary=median,
        p75_salary=p75,
        p90_salary=p90,
        currency="USD",
        equity_range_percent="0.05% - 0.25% (or $40k - $90k/yr RSUs)",
        top_paying_skills=["System Design", "Distributed Systems", "TypeScript", "Next.js", "FastAPI", "Kubernetes", "AWS"],
        negotiation_leverage_tips=[
            "Never anchor with a single low number; provide a target band with your top 75th percentile.",
            "Emphasize unique cross-functional impact (e.g. bridging frontend velocity with robust backend architecture).",
            "Negotiate non-base components: signing bonus, annual refreshers, early vesting cliffs, or extra PTO."
        ],
        counter_offer_script=(
            f"Thank you for this exciting offer! Based on current market benchmarks for a {role_title} with my track record and technical specialization in this region, "
            f"I was anticipating a total compensation package closer to ${p75:,}. If we can align closer to that number or adjust the equity component, I am ready to sign immediately."
        )
    )
