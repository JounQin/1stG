#!/bin/sh
# Capture the SSR'd homepage as the static index.html Pages serves.
#
# The Vercel-era script installed pm2 globally just to start one server and wait for it. A
# background job and a readiness loop do the same without a network install in the build path.
set -eu

yarn build

node dist/server &
server=$!
trap 'kill $server 2>/dev/null || true' EXIT

# -m bounds each attempt, and a server that already exited is reported instead of waited on.
until curl -fsS -m 10 -o /dev/null http://localhost:4000/; do
	if ! kill -0 $server 2>/dev/null; then
		echo "the server exited before answering" >&2
		exit 1
	fi
	sleep 1
done

curl -fsS -m 60 http://localhost:4000/ >dist/static/index.html
