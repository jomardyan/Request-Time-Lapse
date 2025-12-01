#!/bin/bash

# Asset Generation Quick Setup
# This script sets up and runs the asset generator

set -e

echo "🎨 Request Time-Lapse - Asset Generation Setup"
echo "=============================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
  echo "❌ Node.js is not installed. Please install Node.js 16+ first."
  exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
  echo "❌ npm is not installed. Please install npm first."
  exit 1
fi

echo "✅ npm version: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo ""
echo "✅ Dependencies installed!"
echo ""

# Generate assets
echo "🚀 Generating assets..."
npm run generate-assets

echo ""
echo "✨ Asset generation complete!"
echo "📁 Check the ./assets directory for generated files."
