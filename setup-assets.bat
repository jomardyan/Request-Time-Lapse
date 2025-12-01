@echo off
REM Asset Generation Quick Setup for Windows
REM This batch script sets up and runs the asset generator

setlocal enabledelayedexpansion

echo.
echo 🎨 Request Time-Lapse - Asset Generation Setup
echo ==============================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if errorlevel 1 (
  echo ❌ Node.js is not installed. Please install Node.js 16+ first.
  pause
  exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js version: %NODE_VERSION%
echo.

REM Check if npm is installed
where npm >nul 2>nul
if errorlevel 1 (
  echo ❌ npm is not installed. Please install npm first.
  pause
  exit /b 1
)

for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo ✅ npm version: %NPM_VERSION%
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

if errorlevel 1 (
  echo ❌ Failed to install dependencies
  pause
  exit /b 1
)

echo.
echo ✅ Dependencies installed!
echo.

REM Generate assets
echo 🚀 Generating assets...
call npm run generate-assets

if errorlevel 1 (
  echo ❌ Failed to generate assets
  pause
  exit /b 1
)

echo.
echo ✨ Asset generation complete!
echo 📁 Check the .\assets directory for generated files.
echo.
pause
