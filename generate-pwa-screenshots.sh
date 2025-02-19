#!/bin/bash

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "ImageMagick is not installed. Please install it first:"
    echo "brew install imagemagick"
    exit 1
fi

OUTPUT_DIR="public"

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

if [ -z "$1" ] || [ -z "$2" ]; then
    echo "Please provide both desktop and mobile screenshot files"
    echo "Usage: ./generate-pwa-screenshots.sh <desktop-screenshot> <mobile-screenshot>"
    exit 1
fi

DESKTOP_SCREENSHOT=$1
MOBILE_SCREENSHOT=$2

# Process desktop screenshot
convert "$DESKTOP_SCREENSHOT" -resize 1920x1080 "$OUTPUT_DIR/screenshot-desktop.png"

# Process mobile screenshot
convert "$MOBILE_SCREENSHOT" -resize 750x1334 "$OUTPUT_DIR/screenshot-mobile.png"

echo "PWA screenshots generated successfully in $OUTPUT_DIR/"
echo "Please ensure the screenshots are representative of your app's interface" 