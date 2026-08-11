#!/usr/bin/env bash
set -e

echo "पुराने नग़मे — setup"
echo ""

# Check Node version
if ! command -v node &> /dev/null; then
  echo "Node.js not found. Install Node 18+ from https://nodejs.org before continuing."
  exit 1
fi

NODE_MAJOR=$(node -v | sed 's/v//' | cut -d. -f1)
if [ "$NODE_MAJOR" -lt 18 ]; then
  echo "Node $NODE_MAJOR found — this project needs Node 18 or newer."
  exit 1
fi
echo "Node $(node -v) OK"

echo ""
echo "Installing dependencies..."
npm install

echo ""
echo "Done. Next steps:"
echo "  npm run dev     — start the local dev server at http://localhost:3000"
echo "  npm run build   — production build"
echo "  npm run lint    — check code quality"
