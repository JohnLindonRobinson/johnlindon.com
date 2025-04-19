#!/bin/bash

# Find and kill the Node.js development server
pkill -f "node.*next dev" || echo "No running development server found."

echo "Development server stopped."
exit 0 