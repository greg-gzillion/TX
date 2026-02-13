#!/bin/bash
# Cross-platform test database setup script

echo "🔧 Setting up test database..."

# Check if we're on Windows
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    echo "📝 Windows detected - using PowerShell commands"
    # This script will be run via PowerShell on Windows
    exit 0
fi

# For Linux/Mac
# Check if PostgreSQL is running
if ! pg_isready -h localhost -p 5432 > /dev/null 2>&1; then
    echo "⚠️ PostgreSQL is not running. Starting PostgreSQL..."
    # Try to start PostgreSQL (adjust for your system)
    if command -v sudo > /dev/null 2>&1; then
        sudo service postgresql start || sudo systemctl start postgresql
    else
        service postgresql start || systemctl start postgresql
    fi
    sleep 3
fi

# Create test database if it doesn't exist
if ! psql -U postgres -h localhost -tc "SELECT 1 FROM pg_database WHERE datname = 'phoenixpme_test'" | grep -q 1; then
    echo "Creating test database..."
    psql -U postgres -h localhost -c "CREATE DATABASE phoenixpme_test"
    echo "✅ Test database created"
else
    echo "✅ Test database already exists"
fi

# Run migrations on test database
export DATABASE_URL="postgresql://postgres:@localhost:5432/phoenixpme_test"
npx prisma migrate deploy

echo "✅ Migrations applied to test database"
echo "🎉 Test database setup complete!"
