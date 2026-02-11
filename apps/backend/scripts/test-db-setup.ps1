# PowerShell script for Windows test database setup
Write-Host "🔧 Setting up test database..." -ForegroundColor Cyan

# Check if PostgreSQL is running (adjust as needed for your setup)
$pgService = Get-Service -Name postgresql* -ErrorAction SilentlyContinue
if (-not $pgService) {
    Write-Host "⚠️ PostgreSQL service not found. Please ensure PostgreSQL is installed and running." -ForegroundColor Yellow
    exit 1
}

# Create test database if it doesn't exist
try {
    # Using psql command - adjust connection string as needed
    & psql -U postgres -c "SELECT 1 FROM pg_database WHERE datname = 'phoenixpme_test'" | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Creating test database..." -ForegroundColor Green
        & psql -U postgres -c "CREATE DATABASE phoenixpme_test"
        if ($LASTEXITCODE -ne 0) {
            throw "Failed to create test database"
        }
        Write-Host "✅ Test database created" -ForegroundColor Green
    } else {
        Write-Host "✅ Test database already exists" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Error creating test database: $_" -ForegroundColor Red
    exit 1
}

# Set environment variable for migrations
$env:DATABASE_URL = "postgresql://postgres@localhost:5432/phoenixpme_test"

# Run Prisma migrations
Write-Host "Running database migrations..." -ForegroundColor Cyan
try {
    & npx prisma migrate deploy
    if ($LASTEXITCODE -ne 0) {
        throw "Migrations failed"
    }
    Write-Host "✅ Migrations applied to test database" -ForegroundColor Green
} catch {
    Write-Host "❌ Error running migrations: $_" -ForegroundColor Red
    exit 1
}

Write-Host "🎉 Test database setup complete!" -ForegroundColor Green
