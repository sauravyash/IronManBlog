import Koa from 'koa'
import logger from 'koa-morgan'
import Router from 'koa-router'
import serve from 'koa-static'
import pug from 'pug'
const { Client } = require('pg')
// import send from 'koa-send'

const server = new Koa()
const router = new Router()
const PORT = process.env.DEVENV ? 4000 : process.env.PORT

let un = "hfjhjpkvynhpze",
  pw = "0a080728fb60faf2f1a72d0617121ff63d3d76d86aa1236ae84e251ed91cbff4",
  host = "ec2-54-83-61-142.compute-1.amazonaws.com",
  db_port=5432,
  db = "d4foi177e13v1q"

const connString = `User ID=${un};Password=${pw};Host=${host};Port=${db_port};Database=${db};
Pooling=true;Min Pool Size=0;Max Pool Size=100;Connection Lifetime=0;`

const client = new Client({
  connectionString: process.env.DATABASE_URL || connString,
  ssl: true,
})

const selectFeedbackQuery = "SELECT * FROM Feedback"

const insertFeedbackQuery = values => ({
  name: 'insert-feedback',
  text: 'INSERT INTO feedback(Comment_Title, Comment_Message, Comment_Date, Replying_To, Comment_Author) VALUES($1, $2, $3, $4, $5)',
  values
})

insertFeedbackQuery

let blogData = {
  updates: [
    {
      title: "Creating Iron Man in Maya: Preface",
      author:"Saurav Yash Agasti",
      date: "5/03/2019",
      time: "2:30pm",
      tag: "General",
      content: "Today, I searched for inspiration when searching for a model to create. I decided to choose a superhero as it would be an interesting challenge. I didn’t think about which kind of superhero as there are countless types, and honestly deciding on a choice left me overwhelmed. I decided to find something that could get me started quickly. In Google Images, I found a replica blueprint to the original design of the Iron Man Mark 46, but the resolution was extremely low and the original image appeared to be unavailable. However, I finally had a vague direction for the idea of the model."
    },
    {
      title: "Creating Iron Man in Maya: Part 1",
      author:"Saurav Yash Agasti",
      date: "1/3/2019",
      time: "3:30pm",
      tag: "3D Modelling",
      content: "I decided to look into iron man models and I realised that this superhero would be the perfect choice for a model. This was because Iron Man was more machine than human, but still had the basic characteristics of a human. This would result in a reasonably simpler box model compared to any human-like character like Thor or Spiderman. When searching throughout Pinterest and Google, I found multiple decent reference images for Mark 2 and Mark 1, but there was one Mark 3 reference image that seemed to look both high quality and accurate to the suit in the first Iron Man movie. After obtaining this image from the source website and citing it Harvard style, I used photoshop to split the image into the front, side and back images for later use in Maya."
    },
    {
      title: "Creating Iron Man in Maya: Part 2",
      author:"Saurav Yash Agasti",
      date: "1/3/2019",
      time: "3:30pm",
      tag: "3D Modelling",
      content: "Creating body"
    },
    {
      title: "Creating Iron Man in Maya: Part 3",
      author:"Saurav Yash Agasti",
      date: "1/3/2019",
      time: "3:30pm",
      tag: "3D Modelling",
      content: "Restarting"
    }
  ],
  feedback: [
    {
      title: "Amazing Work",
      name: "John Doe IV",
      date: "26/03/2019",
      time: "3:01pm",
      message: "I can't believe you did this, I though this was gonna be aids."
    },
    {
      title: "Damn... Respect",
      name: "Frednie Smith",
      date: "25/03/2019",
      time: "3:01pm",
      message: "If only you started earlier..."
    }
  ]
}

// website root
router.get('/', ctx => {
  ctx.body = pug.renderFile('pub/pages/content/index.pug', blogData)
})

router.get('/:page_name', ctx => {
  client.connect()
  let cmd
  if (ctx.params.page_name === "feedback"){
    cmd = selectFeedbackQuery
  } else {
    cmd = blogData
  }

  client.query(cmd, (err, res) => {
    if (err) throw err
    let pageData = {
      query: res.rows
    }
    client.end()
    try{
      ctx.body = pug.renderFile(`pub/pages/content/${ctx.params.page_name}.pug`, pageData)
    }
    catch(e){
      ctx.status = 404
      ctx.body = "Sorry, page not found"
    }
  })
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
