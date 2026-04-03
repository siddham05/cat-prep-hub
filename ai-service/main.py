from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file

app = FastAPI(title="CAT Prep AI Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))
MODEL = "llama-3.3-70b-versatile"

# ─── Request Models ────────────────────────────────────────────────────────────

class RoadmapRequest(BaseModel):
    background: str        # engineering | commerce | arts | working
    months_left: int       # 2 | 4 | 6 | 9 | 12
    daily_hours: int       # 1 | 2 | 3 | 4
    weakest_area: str      # VARC | DILR | Quant | All

class PlannerRequest(BaseModel):
    daily_hours: int
    phase: str             # foundation | practice | revision
    background: Optional[str] = "engineering"

class MotivationRequest(BaseModel):
    streak: int
    tasks_done: int
    tasks_total: int
    weak_area: Optional[str] = "VARC"

class PIRequest(BaseModel):
    target_college: Optional[str] = "IIM Ahmedabad"
    background: str
    question: str

class DoubtRequest(BaseModel):
    section: str           # VARC | DILR | Quant
    question: str

# ─── Endpoints ─────────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    return {"status": "ok", "service": "cat-prep-ai"}


@app.post("/ai/roadmap")
def generate_roadmap(req: RoadmapRequest):
    prompt = f"""You are an expert CAT exam coach with 15+ years experience.

Student profile:
- Background: {req.background} student
- Time left: {req.months_left} months until CAT
- Daily study time: {req.daily_hours} hours/day
- Weakest area: {req.weakest_area}

Create a detailed, phase-wise study roadmap. Structure your response EXACTLY as follows:

PHASE 1: [Phase Name] ([weeks/months])
Focus: [2-3 focus areas]
Activities: [3-4 specific activities]
Resources: [2-3 specific book/resource names]
Tip: [One actionable insider tip]

PHASE 2: ...
(Continue for all phases)

KEY RULES:
- For engineering students: skip basic quant theory, go straight to advanced tricks
- Prioritise {req.weakest_area} with 40% extra time
- Be specific: name actual books (Arun Sharma, TIME material etc)
- Keep total response under 400 words
- End with one motivational sentence"""

    try:
        message = client.chat.completions.create(
            model=MODEL,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=800
        )
        return {"roadmap": message.choices[0].message.content, "tokens_used": message.usage.completion_tokens}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/ai/tasks")
def generate_daily_tasks(req: PlannerRequest):
    prompt = f"""You are a CAT coach. Generate exactly 6 specific study tasks for today.

Student: {req.background} student | Phase: {req.phase} | Daily hours: {req.daily_hours}h

Return ONLY a JSON array, no other text:
[
  {{"id": 1, "section": "VARC", "task": "...", "duration_min": 30, "difficulty": "easy|medium|hard", "resource": "..."}},
  ...
]

Rules:
- Mix VARC, DILR, Quant across tasks
- In foundation phase: focus on concepts
- In practice phase: focus on mocks and timed sets
- In revision phase: focus on weak areas and shortcuts
- Each task must be SPECIFIC (mention exact resource/activity)
- Difficulties: 2 easy, 3 medium, 1 hard"""

    try:
        message = client.chat.completions.create(
            model=MODEL,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=600
        )
        import json, re
        text = message.choices[0].message.content
        match = re.search(r'\[.*\]', text, re.DOTALL)
        if match:
            tasks = json.loads(match.group())
        else:
            tasks = []
        return {"tasks": tasks}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/ai/motivation")
def get_motivation(req: MotivationRequest):
    completion_pct = int((req.tasks_done / max(req.tasks_total, 1)) * 100)

    if req.streak == 0:
        tone = "restart encouragement"
    elif req.streak < 5:
        tone = "building momentum"
    elif req.streak < 15:
        tone = "strong consistency praise"
    else:
        tone = "elite performer recognition"

    prompt = f"""You are a warm but direct CAT mentor. Write a motivational message for a student with:
- Study streak: {req.streak} days
- Today's completion: {req.tasks_done}/{req.tasks_total} tasks ({completion_pct}%)
- Struggling with: {req.weak_area}
- Tone needed: {tone}

Rules:
- Exactly 3 sentences
- Reference their actual numbers naturally
- Mention {req.weak_area} specifically
- End with a specific actionable micro-tip for today
- No generic phrases like "you got this" or "believe in yourself"
- Sound like a real mentor, not a chatbot"""

    try:
        message = client.chat.completions.create(
            model=MODEL,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=200
        )
        return {"message": message.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/ai/pi-prep")
def pi_prep(req: PIRequest):
    prompt = f"""You are an IIM Personal Interview expert who has coached 500+ students.

Target college: {req.target_college}
Student background: {req.background}
Interview question: "{req.question}"

Provide:
1. SAMPLE ANSWER (3-4 sentences, genuine and structured)
2. WHAT THEY'RE TESTING (1-2 sentences on what the panelist wants to hear)
3. AVOID (2 bullet points on common mistakes)
4. POWER PHRASE (one memorable closing line)

Keep response under 300 words. Be direct and practical."""

    try:
        message = client.chat.completions.create(
            model=MODEL,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=500
        )
        return {"answer": message.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/ai/doubt")
def solve_doubt(req: DoubtRequest):
    section_context = {
        "VARC": "Reading Comprehension, Verbal Ability, Para-jumbles, Summary questions",
        "DILR": "Data Interpretation sets, Logical Reasoning puzzles, caselets",
        "Quant": "Arithmetic, Algebra, Geometry, Number Systems, Modern Math"
    }

    prompt = f"""You are a CAT expert tutor for {req.section} ({section_context.get(req.section, '')}).

Student's question: {req.question}

Answer with:
- CONCEPT: Brief explanation of the underlying concept
- APPROACH: Step-by-step method to solve this type of problem  
- SHORTCUT: Any CAT-specific trick or shortcut if applicable
- EXAMPLE: A quick worked example if helpful

Be concise (under 250 words). Use simple language."""

    try:
        message = client.chat.completions.create(
            model=MODEL,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=500
        )
        return {"answer": message.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/resources/{weak_area}")
def get_resources(weak_area: str):
    resources = {
        "VARC": [
            {"name": "Arun Sharma — Verbal Ability", "type": "varc", "desc": "Best for RC strategies & verbal ability", "priority": 1, "url": "#"},
            {"name": "TIME VARC Study Material", "type": "varc", "desc": "Trusted institute content, structured approach", "priority": 2, "url": "#"},
            {"name": "The Hindu — Daily Reading", "type": "varc", "desc": "Essential for RC speed and comprehension", "priority": 3, "url": "https://www.thehindu.com"},
            {"name": "2IIM Free VARC Resources", "type": "varc", "desc": "Free content by IIM alumni, topic-wise", "priority": 4, "url": "https://2iim.com"},
            {"name": "CAT Official Mock Tests", "type": "varc", "desc": "Always attempt official mocks — most accurate pattern", "priority": 5, "url": "#"},
        ],
        "DILR": [
            {"name": "Arun Sharma — DILR", "type": "dilr", "desc": "Gold standard for LR sets and DI caselets", "priority": 1, "url": "#"},
            {"name": "2IIM DILR Sets", "type": "dilr", "desc": "High-quality sets with detailed solutions", "priority": 2, "url": "https://2iim.com"},
            {"name": "PaGaLGuY DILR Forum", "type": "dilr", "desc": "Peer-verified practice sets and discussions", "priority": 3, "url": "https://www.pagalguy.com"},
            {"name": "Cracku DILR Practice", "type": "dilr", "desc": "Topic-wise sets with video explanations", "priority": 4, "url": "https://cracku.in"},
        ],
        "Quant": [
            {"name": "Arun Sharma — Quant", "type": "quant", "desc": "Concept + shortcuts, ideal for engineers", "priority": 1, "url": "#"},
            {"name": "Nishit Sinha — Quant", "type": "quant", "desc": "Strong on algebra and number systems", "priority": 2, "url": "#"},
            {"name": "2IIM Quant Formulas", "type": "quant", "desc": "Concise formula sheets for revision", "priority": 3, "url": "https://2iim.com"},
            {"name": "Cracku Daily Quant Quiz", "type": "quant", "desc": "10 questions/day habit builder", "priority": 4, "url": "https://cracku.in"},
        ],
        "All": [
            {"name": "Arun Sharma — Complete Set", "type": "varc", "desc": "Full series covering all 3 sections", "priority": 1, "url": "#"},
            {"name": "TIME Full Course", "type": "dilr", "desc": "Most trusted coaching material", "priority": 2, "url": "#"},
            {"name": "2IIM Free Resources", "type": "quant", "desc": "High quality free content across sections", "priority": 3, "url": "https://2iim.com"},
            {"name": "CAT Official Mock Tests", "type": "varc", "desc": "Non-negotiable — attempt all official mocks", "priority": 4, "url": "#"},
            {"name": "Cracku CAT Prep", "type": "dilr", "desc": "Topic tests + full mocks with analytics", "priority": 5, "url": "https://cracku.in"},
        ]
    }
    return {"resources": resources.get(weak_area, resources["All"])}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
