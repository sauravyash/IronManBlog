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
let latestNews = {
  updates: [{
    title: "First Post: le début",
    date: "1/2/2019",
    time: "3:30pm",
    tag: "General",
    content: "This is a multipurpose blog; a rationale to parts of my life."
  }, {
    title: "Creating Iron Man in Maya: Part 1",
    date: "1/3/2019",
    time: "3:30pm",
    tag: "3D Modelling",
    content: "Creating blueprints"
  }, {
    title: "Creating Iron Man in Maya: Part 2",
    date: "1/3/2019",
    time: "3:30pm",
    tag: "3D Modelling",
    content: "Creating body"
  }, {
    title: "Creating Iron Man in Maya: Part 3",
    date: "1/3/2019",
    time: "3:30pm",
    tag: "3D Modelling",
    content: "Restarting"
  }] // website root

};
router.get('/', ctx => {
  ctx.body = _pug.default.renderFile('pub/pages/content/index.pug', latestNews);
});
router.get('/:page_name', ctx => {
  ctx.body = _pug.default.renderFile(`pub/pages/content/${ctx.params.page_name}.pug`, latestNews);
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