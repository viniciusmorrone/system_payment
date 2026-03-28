#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Run tests with coverage
npm run test -- --coverage --watchAll=false

# Check if tests passed
if [ $? -eq 0 ]; then
    echo "✅ All tests passed!"
else
    echo "❌ Some tests failed!"
    exit 1
fi
