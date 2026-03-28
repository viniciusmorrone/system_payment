#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

echo "🔍 Running ESLint..."
npm run lint

echo "✅ ESLint passed!"

echo "🔍 Running TypeScript type checking..."
npm run type-check

echo "✅ TypeScript checking passed!"

echo "🎉 All linting checks passed!"
