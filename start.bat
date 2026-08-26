@echo off
echo Starting CareerBrew Career OS Services...
start cmd /k "cd backend && (if exist venv\Scripts\activate.bat call venv\Scripts\activate.bat) && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"
start cmd /k "cd frontend && npm run dev"
echo Backend running on http://localhost:8000 (API Docs: http://localhost:8000/docs)
echo Frontend running on http://localhost:3000
