#!/bin/bash -e

set -x

git checkout gh-pages
git pull origin gh-pages --no-edit
git merge preact --no-edit
npm run build
git add -f bundle.js
git commit -m "Update gh-pages"
git push -f origin gh-pages
git checkout preact