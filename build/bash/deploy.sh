#!/usr/bin/env bash

set -e
git pull origin master
yarn
pm2 delete 1stg
yarn build
yarn pm2
