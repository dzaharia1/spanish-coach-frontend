#!/bin/bash

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "ImageMagick is not installed. Please install it first:"
    echo "brew install imagemagick"
    exit 1
fi

# Check if source image is provided
if [ -z "$1" ]; then
    echo "Please provide a source image file"
    echo "Usage: ./generate-pwa-icons.sh <source-image>"
    exit 1
fi

SOURCE_IMAGE=$1
OUTPUT_DIR="public"

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Generate PWA icons
convert "$SOURCE_IMAGE" -resize 192x192 "$OUTPUT_DIR/pwa-192x192.png"
convert "$SOURCE_IMAGE" -resize 512x512 "$OUTPUT_DIR/pwa-512x512.png"
convert "$SOURCE_IMAGE" -resize 180x180 "$OUTPUT_DIR/apple-touch-icon.png"
convert "$SOURCE_IMAGE" -resize 32x32 "$OUTPUT_DIR/favicon.ico"

echo "PWA icons generated successfully in $OUTPUT_DIR/" 