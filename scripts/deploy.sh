#!/bin/sh
# Builds the site for GitHub Pages (served under /njtattoo/) and publishes the files to the gh-pages branch.
set -e
cd "$(dirname "$0")/.."
MSYS_NO_PATHCONV=1 BASE_PATH=/njtattoo npm run build
cd out
touch .nojekyll
rm -rf .git
git init -q -b gh-pages
git add -A
git commit -q -m "Deploy"
git push -f https://github.com/septeamone/njtattoo.git gh-pages
rm -rf .git
