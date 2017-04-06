#!/usr/bin/env bash

branches=$(git ls-remote --heads origin | awk -F " " '{print $2}' | cut -d'/' -f3)
for branch in $branches ; do
    git branch -D $branch
    git checkout -b $branch origin/$branch
    REPO_PATH="$1" SCAFFOLDING="$2" node app/main.js
    git add --all
    git commit -a -m "Adjustment exercise to scaffolding requirements"
done
