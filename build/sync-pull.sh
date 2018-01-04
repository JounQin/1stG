#!/usr/bin/env bash

set -e

rm -rf dist
git clone https://github.com/JounQin/1stg.git dist -b assets
rm -rf dist/.git
