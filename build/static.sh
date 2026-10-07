#!/bin/sh
# Build the site into the directory Cloudflare Pages serves. The prerender runs as a Vite plugin,
# ahead of the service worker generation, so the precached HTML is the rendered page.
set -eu

yarn build
