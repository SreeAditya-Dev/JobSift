Write-Host "Starting CareerBrew Career OS Services..." -ForegroundColor Green

# Start Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; if (Test-Path venv\Scripts\activate.ps1) { .\venv\Scripts\activate.ps1 }; uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

# Start Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host "Backend running on http://localhost:8000 (API Docs: http://localhost:8000/docs)" -ForegroundColor Cyan
Write-Host "Frontend running on http://localhost:3000" -ForegroundColor Cyan
