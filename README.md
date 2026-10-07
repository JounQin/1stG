# [1stG.me](https://www.1stG.me)

[![GitHub Actions](https://github.com/JounQin/1stG/workflows/Node%20CI/badge.svg)](https://github.com/JounQin/1stG/actions?query=workflow%3A%22Node+CI%22)
[![Codacy Grade](https://img.shields.io/codacy/grade/ce9d5817d3c14cb0abfe03cd9766b8b6)](https://www.codacy.com/app/JounQin/1stG)

[![Conventional Commits](https://img.shields.io/badge/conventional%20commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Code Style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![codechecks.io](https://raw.githubusercontent.com/codechecks/docs/master/images/badges/badge-default.svg?sanitize=true)](https://codechecks.io)

> Server Rendered Static Homepage Website powered by Technology Stack Of React

## Deploy

Static hosting on Cloudflare Pages. There is no CI workflow and no runtime server: the build
prerenders the site's single page into `dist/static`, and Pages serves that directory as-is.

| Pages setting          | Value                                       |
| ---------------------- | ------------------------------------------- |
| Build command          | `yarn build-static`                         |
| Build output directory | `dist/static`                               |
| Node version           | 18 (see `.nvmrc`)                           |
| Package manager        | Yarn 4 (`packageManager` in `package.json`) |

`packageManager` pins the Yarn major, and `.yarnrc.yml` sets `nodeLinker: node-modules` because
Yarn 4 defaults to Plug'n'Play, which this webpack 4 toolchain cannot use.

`yarn build-static` runs `build/static.sh`. `yarn build` produces the client assets in
`dist/static`, the SSR server in `dist/server` and the HTML template in `dist/template.html`; the
script then starts that server on `:4000` just long enough to capture `/` as `index.html` and stops
it again. `server/index.js` redirects every other path to `/`, which is why one captured response is
the whole site: that redirect belongs to the prerender, not to the deployment. Pages answers
unmatched paths with `index.html` rather than redirecting the browser to `/`. The custom domain
(`www.1stG.me`) is configured in the Pages project.
