#!/usr/bin/env bash

set -e

yarn global add pm2
pm2 start --name=1stg --wait-ready npm -- start
curl http://localhost:4000 > dist/static/index.html

rm -rf sync

main() {
  git log -1 --pretty=%B | cat |
  if read -r MESSAGE
  then
    echo "last commit message:"
    echo "$MESSAGE"

    local CREATED=1

    {
      git clone https://user:${GH_TOKEN}@github.com/$TRAVIS_REPO_SLUG.git sync -b gh-pages
    } || {
      echo "branch \`gh-pages\` has not been created"
      CREATED=0
      mkdir sync
      cd sync
      git init
      git checkout -b gh-pages
      git remote add origin https://user:${GH_TOKEN}@github.com/$TRAVIS_REPO_SLUG.git
      cd ..
    }

    rm -rf sync/*

    cd sync
    cp -rf ../dist/static/* .
    cp ../*.md .
    cp ../public/* .
    echo www.1stg.me > CNAME

    git add -A
    git status -s |
    if read
    then
      git commit -m "$MESSAGE"

      if [ "$CREATED" == "1" ]
      then
        git push --quiet
      else
        echo "first push, create \`gh-pages\` branch"
        git push --quiet --set-upstream origin gh-pages
      fi
    else
      echo "there is nothing changed to commit"
    fi

    rm -rf sync
  fi
}

main
