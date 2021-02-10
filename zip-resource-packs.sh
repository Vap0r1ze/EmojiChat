#!/bin/bash

# Create target dir
mkdir -p target

# Create temp dir
cp -r resourcepack resourcepack-temp

# Create zip packs
for VARIANT in 1 2; do
  for QUALITY in hd sd; do
    echo "Creating EmojiChat.$VARIANT.${QUALITY^^}.ResourcePack.zip"
    cd "resourcepack-temp/variant $VARIANT/$QUALITY"

    # Reset timestamp attributes
    TZ=UTC find . -exec touch -t 197001010000 {} +

    # Zip
    zip -oXr ../../../target/EmojiChat.$VARIANT.${QUALITY^^}.ResourcePack.zip *
    cd ../../..
  done
done

Clean
rm -r resourcepack-temp
