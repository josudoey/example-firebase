module.exports = (app) => {
  const controllers = app.controllers
  const { config, pubsub } = controllers
  const { } = app.middlewares

  const koaRouter = require('koa-router')
  const router = koaRouter({})
  router.post('/pub', pubsub.publish)
  router.get('/config/:key*', config.get)
  router.get('/env', config.env)
  return router
}
