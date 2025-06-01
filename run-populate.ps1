# PowerShell script to run the post population
# Make sure you're in the project root directory

Write-Host "🚀 Running Firebase post population script..." -ForegroundColor Green

# Run the Node.js script
node src/test/populatePosts.js

Write-Host "✅ Script execution completed!" -ForegroundColor Green
Write-Host "📱 Now open your app to see the posts in the HomeFeed" -ForegroundColor Yellow
