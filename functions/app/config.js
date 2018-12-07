const dotProp = require('dot-prop')
const functions = require('firebase-functions')
class Config {
  constructor (defaults) {
    this.defaults = defaults
    this.cache = Object.assign({}, defaults)
  }

  get (key) {
    const config = functions.config()
    if (dotProp.has(config, key)) {
      return dotProp.get(config, key)
    }
    const cache = this.cache
    if (dotProp.has(cache, key)) {
      return dotProp.get(cache, key)
    }
    return cache[key]
  }
}

const crypto = require('crypto')
const defaultConfig = require('./config.default.json')
exports = module.exports = new Config(Object.assign({
  'app.keys': [crypto.randomBytes(24).toString('hex')],
  'app.projectId': process.env.GCLOUD_PROJECT
}, defaultConfig))
