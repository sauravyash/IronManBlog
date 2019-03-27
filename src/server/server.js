import Koa from 'koa'
import logger from 'koa-morgan'
import Router from 'koa-router'
import serve from 'koa-static'
import pug from 'pug'
// import send from 'koa-send'

const server = new Koa()
const router = new Router()
const PORT = process.env.DEVENV ? 4000 : 80

let latestNews = {
  updates: [
    {
      title: "First Post: le début",
      date: "1/2/2019",
      time: "3:30pm",
      tag: "General",
      content: "This is a multipurpose blog; a rationale to parts of my life."
    },
    {
      title: "Creating Iron Man in Maya: Part 1",
      date: "1/3/2019",
      time: "3:30pm",
      tag: "3D Modelling",
      content: "Creating blueprints"
    },
    {
      title: "Creating Iron Man in Maya: Part 2",
      date: "1/3/2019",
      time: "3:30pm",
      tag: "3D Modelling",
      content: "Creating body"
    },
    {
      title: "Creating Iron Man in Maya: Part 3",
      date: "1/3/2019",
      time: "3:30pm",
      tag: "3D Modelling",
      content: "Restarting"
    },

  ]
}

// website root
router.get('/', ctx => {
  ctx.body = pug.renderFile('pub/pages/index.pug', latestNews)
})

// router.get('/js', async (ctx) => {
//   await send(ctx, ctx.path, { root: __dirname + '/app' })
// })

server
  .use(serve('pub'))
  .use(serve('app'))
  .use(logger('tiny'))
  .use(router.routes())
  .listen(PORT)

console.log(`This server is hosted on port ${PORT}`)
