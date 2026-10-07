#!/bin/sh
# Prerender the single page into the directory Cloudflare Pages serves.
set -eu

yarn build
node build/prerender.mts
