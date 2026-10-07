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
| Build command          | `yarn build`                                |
| Build output directory | `dist/static`                               |
| Node version           | `lts/*` (see `.node-version`)               |
| Package manager        | Yarn 4 (`packageManager` in `package.json`) |

`packageManager` pins the Yarn major, and `.yarnrc.yml` sets `nodeLinker: node-modules` because the
tooling assumes a real `node_modules` tree.

Two `typescript` packages are installed under one name and one alias: `typescript` resolves to the
TS 6 build, the API that Yarn's builtin patch and typescript-eslint load by that name, while
`@typescript/native` resolves to the TS 7 native CLI. Only the TS 6 package ships a `tsc` binary
that Yarn hoists, so `lint:ts` invokes the native CLI by path.

`yarn build` builds the SSR entry into `dist/server` and the client into `dist/static`. The
prerender is a plugin in `vite.config.ts`, listed before the PWA plugin: it renders the page to a
string and writes it into the built `index.html`, and running before the service worker generation
is what keeps the precached HTML the rendered page rather than the placeholder shell. There is no
server: the sources used to redirect every other path to `/` while a Koa process served the
prerender, and that redirect is gone with it. Pages answers unmatched paths with `index.html` rather
than redirecting the browser to `/`. The custom domain (`www.1stG.me`) is configured in the Pages
project.
