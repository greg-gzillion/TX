# PowerShell test runner for Windows
param(
    [string]$TestFile = "",
    [switch]$Watch,
    [switch]$Coverage,
    [switch]$Setup
)

Write-Host "🚀 PhoenixPME Test Runner" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan

# Set test environment
$env:NODE_ENV = "test"

if ($Setup) {
    Write-Host "Setting up test environment..." -ForegroundColor Yellow
    & .\scripts\test-db-setup.ps1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Test setup failed" -ForegroundColor Red
        exit 1
    }
}

# Build Jest command
$jestCmd = "jest"

if ($TestFile) {
    $jestCmd += " $TestFile"
}

if ($Watch) {
    $jestCmd += " --watch"
}

if ($Coverage) {
    $jestCmd += " --coverage"
}

# Always run in band for tests
$jestCmd += " --runInBand --forceExit"

Write-Host "Running: $jestCmd" -ForegroundColor Yellow
Write-Host ""

# Run tests
& npx $jestCmd.Split(" ")

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ All tests passed!" -ForegroundColor Green
} else {
    Write-Host "❌ Tests failed" -ForegroundColor Red
    exit 1
}
