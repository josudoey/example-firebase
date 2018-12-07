const { PubSub } = require('@google-cloud/pubsub')
exports = module.exports = function (app) {
  const projectId = app.config.get('app.projectId')

  const pubsubClient = new PubSub({
    projectId: projectId
  })

  class Controller extends app.Controller {
    async publish (ctx) {
      const query = ctx.query
      const topicName = query.topic
      const message = Buffer.from(JSON.stringify(ctx.req.body))
      try {
        const messageId = await pubsubClient
          .topic(topicName)
          .publisher()
          .publish(message)
        ctx.status = 200
        ctx.body = {
          messageId: messageId
        }
      } catch (err) {
        ctx.status = 400
        ctx.body = {
          message: err.message
        }
      }
    }
  }
  return Controller
}
