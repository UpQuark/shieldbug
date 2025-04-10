#!/bin/bash

# Path to your dist folder relative to the current directory
EXTENSION_PATH="$(pwd)/dist"

# Check if the dist directory exists
if [ ! -d "$EXTENSION_PATH" ]; then
  echo "Error: dist directory not found at $EXTENSION_PATH. Make sure to run 'npm run build' first."
  exit 1
fi

# Path to Chrome
CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

# Create a unique profile name based on the extension name
PROFILE_DIR="/tmp/shieldbug_dev_profile"

# Start Chrome and load the extension
echo "Loading extension from $EXTENSION_PATH"
echo "Using profile directory: $PROFILE_DIR"
echo "Running command:"
echo "$CHROME_PATH --user-data-dir=$PROFILE_DIR --load-extension=$EXTENSION_PATH chrome://extensions/ https://google.com"

# Launch Chrome with extension loaded and open extensions page plus a test page
"$CHROME_PATH" --user-data-dir="$PROFILE_DIR" --load-extension="$EXTENSION_PATH" "chrome://extensions/" "https://google.com"

echo ""
echo "Chrome launched with the extension loaded."
echo "- The extensions page is opened so you can see your extension was loaded"
echo "- A Google tab is opened to test your extension"
echo "- This browser session uses a separate profile so your regular Chrome isn't affected"
echo "- You can browse normally in this window to test your extension"