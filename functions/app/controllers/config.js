exports = module.exports = function (app) {
  class Controller extends app.Controller {
    async get (ctx) {
      const params = ctx.params
      ctx.status = 200
      ctx.body = app.config.get(params.key)
    }
    async env (ctx) {
      ctx.status = 200
      ctx.body = process.env
    }
  }
  return Controller
}
