#!/bin/bash

# Get the absolute path of the project directory
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Try to find an available terminal emulator
if command_exists gnome-terminal; then
    gnome-terminal -- bash -c "cd \"$PROJECT_DIR\" && npm run dev; exec bash"
elif command_exists xterm; then
    xterm -e "cd \"$PROJECT_DIR\" && npm run dev; exec bash" &
else
    echo "Error: No suitable terminal emulator found. Please install gnome-terminal or xterm."
    exit 1
fi

# Wait a moment for the server to start
sleep 3

# Print the URL
echo "Development server started!"
echo "Access your website at: http://localhost:3000"

# Return success
exit 0 