#!/bin/sh

echo "🚀 Starting Prodify Development Server..."

# Wait for database to be ready
echo "⏳ Waiting for database..."
until npx prisma db push --skip-generate 2>/dev/null; do
  echo "Database is unavailable - sleeping"
  sleep 2
done

echo "✅ Database is ready!"

# Run migrations
echo "📦 Running migrations..."
npx prisma migrate deploy

# Run seed
echo "🌱 Running seed..."
npx prisma db seed || echo "⚠️  Seed already executed or failed"

# Start the application
echo "🎯 Starting Next.js..."
npm run dev
