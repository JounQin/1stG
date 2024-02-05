#!/bin/sh

yarn build &&
	yarn global add pm2 &&
	pm2 start --name=1stg --wait-ready npm -- start &&
	curl http://localhost:4000 >dist/static/index.html
