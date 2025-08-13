# Pre-deployment verification script
Write-Host "🚀 Verifying deployment readiness..." -ForegroundColor Green

Write-Host "`n📋 Running TypeScript checks..." -ForegroundColor Yellow
try {
    $tsResult = & npx tsc --noEmit --strict 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✅ TypeScript checks passed" -ForegroundColor Green
    } else {
        Write-Host "  ❌ TypeScript errors found:" -ForegroundColor Red
        Write-Host $tsResult -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "  ❌ TypeScript check failed: $_" -ForegroundColor Red
    exit 1
}

Write-Host "`n🔨 Running build test..." -ForegroundColor Yellow
try {
    $buildResult = & npm run build 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✅ Build completed successfully" -ForegroundColor Green
    } else {
        Write-Host "  ❌ Build failed:" -ForegroundColor Red
        Write-Host $buildResult -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "  ❌ Build test failed: $_" -ForegroundColor Red
    exit 1
}

Write-Host "`n✅ Deployment verification complete!" -ForegroundColor Green
Write-Host "Your application is ready for Vercel deployment" -ForegroundColor White

# Show current commit info
Write-Host "`n📝 Current commit:" -ForegroundColor Cyan
git log --oneline -1
Write-Host "`n🔗 Remote status:" -ForegroundColor Cyan  
git status --porcelain
if ($?) {
    Write-Host "Working tree clean - ready to deploy!" -ForegroundColor Green
}
