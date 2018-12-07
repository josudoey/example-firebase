const once = require('lodash/once')
const path = require('path')
const camelCase = require('camelcase')
const globby = require('globby')
exports = module.exports = function (opts) {
  const Koa = require('koa')
  const app = new Koa()
  const config = app.config = require('./config')
  app.keys = config.get('app.keys')
  app.Controller = class { }
  const assembleModule = function (ctx, cwd, resolve) {
    const paths = globby.sync('**/*.js', {
      cwd: cwd,
      absolute: false,
      nodir: true
    })
    paths.forEach(function (fn) {
      const key = camelCase(fn.replace(/.js$/, ''))
      const fpath = path.resolve(cwd, fn)
      ctx.__defineGetter__(key, once(function () {
        return resolve(ctx, key, fpath)
      }))
    })
    return ctx
  }

  const resolveController = function (ctx, key, fpath) {
    const moduleInstance = require(fpath)
    let controller = null
    if (typeof moduleInstance === 'object') {
      controller = Object.create(moduleInstance)
    }
    if (typeof moduleInstance === 'function') {
      const ModuleConstructor = moduleInstance(app)
      controller = new ModuleConstructor(app)
    }
    return controller
  }

  const resolveMiddleware = function (ctx, key, fpath) {
    return require(fpath)
  }

  app.controllers = assembleModule({}, path.resolve(__dirname, './controllers'), resolveController)
  app.middlewares = assembleModule({}, path.resolve(__dirname, './middlewares'), resolveMiddleware)

  const router = require('./router')(app)
  app.use(router.routes())
  return app
}
