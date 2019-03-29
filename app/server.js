"use strict";

var _koa = _interopRequireDefault(require("koa"));

var _koaMorgan = _interopRequireDefault(require("koa-morgan"));

var _koaRouter = _interopRequireDefault(require("koa-router"));

var _koaStatic = _interopRequireDefault(require("koa-static"));

var _pug = _interopRequireDefault(require("pug"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import send from 'koa-send'
const server = new _koa.default();
const router = new _koaRouter.default();
const PORT = process.env.DEVENV ? 4000 : process.env.PORT;
let blogData = {
  updates: [{
    title: "Creating Iron Man in Maya: Preface",
    author: "Saurav Yash Agasti",
    date: "5/03/2019",
    time: "2:30pm",
    tag: "General",
    content: "Today, I searched for inspiration when searching for a model to create. I decided to choose a superhero as it would be an interesting challenge. I didn’t think about which kind of superhero as there are countless types, and honestly deciding on a choice left me overwhelmed. I decided to find something that could get me started quickly. In Google Images, I found a replica blueprint to the original design of the Iron Man Mark 46, but the resolution was extremely low and the original image appeared to be unavailable. However, I finally had a vague direction for the idea of the model."
  }, {
    title: "Creating Iron Man in Maya: Part 1",
    author: "Saurav Yash Agasti",
    date: "1/3/2019",
    time: "3:30pm",
    tag: "3D Modelling",
    content: "I decided to look into iron man models and I realised that this superhero would be the perfect choice for a model. This was because Iron Man was more machine than human, but still had the basic characteristics of a human. This would result in a reasonably simpler box model compared to any human-like character like Thor or Spiderman. When searching throughout Pinterest and Google, I found multiple decent reference images for Mark 2 and Mark 1, but there was one Mark 3 reference image that seemed to look both high quality and accurate to the suit in the first Iron Man movie. After obtaining this image from the source website and citing it Harvard style, I used photoshop to split the image into the front, side and back images for later use in Maya."
  }, {
    title: "Creating Iron Man in Maya: Part 2",
    author: "Saurav Yash Agasti",
    date: "1/3/2019",
    time: "3:30pm",
    tag: "3D Modelling",
    content: "Creating body"
  }, {
    title: "Creating Iron Man in Maya: Part 3",
    author: "Saurav Yash Agasti",
    date: "1/3/2019",
    time: "3:30pm",
    tag: "3D Modelling",
    content: "Restarting"
  }],
  feedback: [{
    title: "Amazing Work",
    name: "John Doe IV",
    date: "26/03/2019",
    time: "3:01pm",
    message: "I can't believe you did this, I though this was gonna be aids."
  }, {
    title: "Damn... Respect",
    name: "Frednie Smith",
    date: "25/03/2019",
    time: "3:01pm",
    message: "If only you started earlier..."
  }] // website root

};
router.get('/', ctx => {
  ctx.body = _pug.default.renderFile('pub/pages/content/index.pug', blogData);
});
router.get('/:page_name', ctx => {
  try {
    ctx.body = _pug.default.renderFile(`pub/pages/content/${ctx.params.page_name}.pug`, blogData);
  } catch (e) {
    ctx.status = 404;
    ctx.body = "Sorry, page not found";
  }
});
router.get('/:page_name/:sub_page', ctx => {
  try {
    ctx.body = _pug.default.renderFile(`pub/pages/content/${ctx.params.page_name}/${ctx.params.sub_page}.pug`);
  } catch (e) {
    ctx.status = 404;
    ctx.body = "Sorry, page not found";
  }
});
server.use((0, _koaStatic.default)('pub')).use((0, _koaStatic.default)('app')).use((0, _koaMorgan.default)('tiny')).use(router.routes()).listen(PORT);
console.log(`This server is hosted on port ${PORT}`);