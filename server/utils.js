import runInVm from 'run-in-vm'

const getLogger = ({logger, verbose}) => logger || (verbose ? console.log.bind(console) : function () {})

const acceptsHtml = (header, {htmlAcceptHeaders = ['text/html', '*/*']}) =>
  !!htmlAcceptHeaders.find(acceptHeader => header.indexOf(acceptHeader) + 1)

export function intercept({headers, method, url}, options = {}) {
  const logger = getLogger(options)

  if (method !== 'GET') {
    logger(
      'Not intercepting',
      method,
      url,
      'because the method is not GET.'
    )
    return true
  }

  if (!headers || typeof headers.accept !== 'string') {
    logger(
      'Not intercepting',
      method,
      url,
      'because the client did not send an HTTP accept header.'
    )
    return true
  }

  if (headers.accept.indexOf('application/json') === 0) {
    logger(
      'Not intercepting',
      method,
      url,
      'because the client prefers JSON.'
    )
    return true
  }

  if (!acceptsHtml(headers.accept, options)) {
    logger(
      'Not intercepting',
      method,
      url,
      'because the client does not accept HTML.'
    )
    return true
  }

  const parsedUrl = require('url').parse(url)

  if (parsedUrl.pathname.indexOf('.') + 1 && !options.disableDotRule) {
    logger(
      'Not intercepting',
      method,
      url,
      'because the path includes a dot (.) character.'
    )
    return true
  }
}

export function parseTemplate(template, contentPlaceholder = '<div id="app">') {
  if (typeof template === 'object') {
    return template
  }

  let i = template.indexOf('</head>')
  const j = template.indexOf(contentPlaceholder)

  if (j < 0) {
    throw new Error(`Content placeholder not found in template.`)
  }

  if (i < 0) {
    i = template.indexOf('<body>')
    if (i < 0) {
      i = j
    }
  }

  return {
    head: template.slice(0, i),
    neck: template.slice(i, j),
    tail: template.slice(j + contentPlaceholder.length)
  }
}

export const createRunner = bundle => runInVm({bundle, runInNewContext: false})
