#!/bin/sh
# Capture the SSR'd homepage as the static index.html Pages serves.
#
# The Vercel-era script installed pm2 globally just to start one server and wait for it. A
# background job and a bounded readiness loop do the same without a network install in the build path.
set -eu

# build/config.js listens on process.env.PORT || 4000, so follow the same rule.
port=${PORT:-4000}

yarn build

node dist/server &
server=$!
trap 'kill $server 2>/dev/null || true' EXIT

# Bounded on both axes: each attempt has its own timeout, and the loop gives up instead of hanging
# the build when the server stays up but never answers.
i=0
until curl -fsS -m 10 -o /dev/null "http://localhost:$port/"; do
	if ! kill -0 $server 2>/dev/null || [ "$i" -ge 60 ]; then
		echo "the server did not answer on :$port" >&2
		exit 1
	fi
	i=$((i + 1))
	sleep 1
done

curl -fsS -m 60 "http://localhost:$port/" >dist/static/index.html
