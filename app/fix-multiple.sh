#!/usr/bin/env bash

actual_path=$(pwd)
cd $1
branches=$(git ls-remote --heads origin | awk -F " " '{print $2}' | cut -d'/' -f3)
for branch in $branches ; do
    git branch -D $branch
    git checkout -b $branch origin/$branch
    REPO_PATH="$1" SCAFFOLDING="$2" node $actual_path/app/main.js
    git add --all
    git commit -a -m "Adjustment exercise to scaffolding requirements"
done
