#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

echo "🧪 Running Ruff linter..."
ruff check .

echo "✅ Ruff passed!"

echo "⚫ Running Black formatter check..."
black --check .

echo "✅ Black formatting passed!"

echo "🔍 Running MyPy type checker..."
mypy app/

echo "✅ MyPy passed!"

echo "🧪 Running pytest with coverage..."
pytest --cov=app --cov-report=xml --cov-report=term-missing -v

echo "✅ All tests and checks passed!"
