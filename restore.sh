#!/bin/bash
# Usage: 
#       ./restore.sh "dir1" "dir2"

set -euo pipefail

SRC="$1"
DST="$2"

# check args
if [[ ! -d "$SRC" || ! -d "$DST" ]]; then
    echo "Both arguments must be directories"
    exit 1
fi

# loop through every file in dir1 (recursively)
find "$SRC" -type f | while read -r src_file; do
    filename=$(basename "$src_file")

    # find file with same name under dir2
    while IFS= read -r dst_file; do
        echo "Updating: $dst_file"
        cp -f "$src_file" "$dst_file"
    done < <(find "$DST" -type f -name "$filename")
done
