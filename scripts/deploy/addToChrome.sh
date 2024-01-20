#!/bin/bash

# Path to your dist folder relative to the current directory
EXTENSION_PATH="$(pwd)/dist"

# Path to Chrome
CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

# Start Chrome and load the extension
echo "Loading extension from $EXTENSION_PATH"
echo "Running full command:"
echo "$CHROME_PATH --user-data-dir=/tmp/shieldbug_test_profile --load-extension=$EXTENSION_PATH"
"$CHROME_PATH" --user-data-dir=/tmp/shieldbug_test_profile --load-extension="$EXTENSION_PATH"