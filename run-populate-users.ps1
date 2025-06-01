# PowerShell script to populate test users in Firestore
Write-Host "Running user population script..." -ForegroundColor Green

try {
    # Run the populate users script
    node src/test/populateUsers.js
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Users populated successfully!" -ForegroundColor Green
    } else {
        Write-Host "Error populating users. Exit code: $LASTEXITCODE" -ForegroundColor Red
    }
} catch {
    Write-Host "Error running population script: $_" -ForegroundColor Red
}

Write-Host "Press any key to continue..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
