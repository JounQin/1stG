#!/bin/sh
# Build the purely static bundle a static host serves — dist/static, ready for Cloudflare Pages.
#
# `yarn build` already emits the client assets into dist/static, the SSR server into dist/server
# and the HTML template into dist/template.html. What is missing is index.html, and the site is one
# page by construction: server/index.js redirects every path to "/". So start the built server once
# and capture that single response.
#
# Unlike the Vercel-era script this does not install or drive pm2: a build container needs one
# process that answers one request, and a plain background job is that. It also polls for readiness
# rather than assuming a fixed startup time, and fails loudly if the capture is not a whole page.
set -eu

PORT=${PORT:-4000}
BASE="http://localhost:${PORT}/"

yarn build

# Fail with the reason rather than letting `node` report a bare MODULE_NOT_FOUND later.
for artifact in dist/server.js dist/template.html dist/react-ssr-server-bundle.json \
	dist/react-ssr-client-manifest.json; do
	if [ ! -f "$artifact" ]; then
		echo "build did not produce $artifact" >&2
		exit 1
	fi
done

DEBUG=1stg:* node dist/server &
SERVER_PID=$!
trap 'kill "$SERVER_PID" 2>/dev/null || true' EXIT INT TERM

# --noproxy and -m both matter: a build host may set http_proxy, and a request that hangs would
# otherwise pin the build forever.
i=0
while [ "$i" -lt 60 ]; do
	if curl -fsS --noproxy '*' -m 10 -o /dev/null "$BASE" 2>/dev/null; then
		break
	fi
	# A server that died will never answer; report that instead of waiting the full minute.
	if ! kill -0 "$SERVER_PID" 2>/dev/null; then
		echo "prerender failed: the server exited before answering" >&2
		exit 1
	fi
	i=$((i + 1))
	sleep 1
done

curl -fsS --noproxy '*' -m 60 "$BASE" >dist/static/index.html

# A truncated response or an error page would otherwise ship silently.
if ! grep -q '</html>' dist/static/index.html; then
	echo "prerender failed: dist/static/index.html is not a complete page" >&2
	exit 1
fi

echo "prerendered $(wc -c <dist/static/index.html) bytes into dist/static/index.html"
