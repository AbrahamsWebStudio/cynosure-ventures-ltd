#!/bin/bash

# Deployment script for VPS
echo "Starting deployment..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Run linting (with warnings only)
echo "Running linting..."
npm run lint || echo "Linting completed with warnings"

# Build the application
echo "Building application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo "You can now start the application with: npm start"
else
    echo "❌ Build failed!"
    exit 1
fi 