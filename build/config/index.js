import config, {globals} from './base'

export * from './base'
const current = require(`./${globals.NODE_ENV}`)
export default {...config, ...(current.default || current)(config)}
