# ============================================================
# The Lenny Growth Assistant - One-Command Local Launch Script
# ============================================================

Write-Host "🚀 Launching The Lenny Growth Assistant Backend & Frontend..." -ForegroundColor Cyan

# 1. Install Backend Requirements
Write-Host "📦 Installing Backend Dependencies..." -ForegroundColor Yellow
python -m pip install -r backend/requirements.txt

# 2. Run Backend in background process
Write-Host "⚡ Starting FastAPI Backend on http://localhost:8000..." -ForegroundColor Green
$backendProc = Start-Process -FilePath "python" -ArgumentList "-m", "uvicorn", "app.main:app", "--host", "127.0.0.1", "--port", "8000" -Environment @{ "PYTHONPATH" = "backend" } -PassThru

# 3. Start Frontend
Write-Host "🎨 Starting React + Vite Frontend on http://localhost:3000..." -ForegroundColor Green
Set-Location frontend
npm run dev
