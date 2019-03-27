import Koa from 'koa'
import logger from 'koa-morgan'
import Router from 'koa-router'
import serve from 'koa-static'
import pug from 'pug'
// import send from 'koa-send'

const server = new Koa()
const router = new Router()
const PORT = process.env.DEVENV ? 4000 : process.env.PORT

let blogData = {
  updates: [
    {
      title: "Day 1",
      date: "5/03/2019",
      time: "2:30pm",
      tag: "General",
      content: "Today, I searched for inspiration when searching for a model to create. I decided to choose a superhero as it would be an interesting challenge. I didn’t think about which kind of superhero as there are countless types, and honestly deciding on a choice left me overwhelmed. I decided to find something that could get me started quickly. In Google Images, I found a replica blueprint to the original design of the Iron Man Mark 46, but the resolution was extremely low and the original image appeared to be unavailable. However, I finally had a vague direction for the idea of the model."
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
  ctx.body = pug.renderFile('pub/pages/content/index.pug', blogData)
})

router.get('/:journal', ctx => {
  ctx.body = pug.renderFile('pub/pages/content/journal.pug', blogData)
})

router.get('/:page_name', ctx => {
  try{
    ctx.body = pug.renderFile(`pub/pages/content/${ctx.params.page_name}.pug`, blogData)
  }
  catch(e){
    ctx.status = 404
    ctx.body = "Sorry, page not found"
  }

})

router.get('/:page_name/:sub_page', ctx => {
  try{
    ctx.body = pug.renderFile(`pub/pages/content/${ctx.params.page_name}/${ctx.params.sub_page}.pug`)
  }
  catch(e){
    ctx.status = 404
    ctx.body = "Sorry, page not found"
  }
})

server
  .use(serve('pub'))
  .use(serve('app'))
  .use(logger('tiny'))
  .use(router.routes())
  .listen(PORT)

console.log(`This server is hosted on port ${PORT}`)
