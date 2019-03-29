"use strict";

var _koa = _interopRequireDefault(require("koa"));

var _koaBodyparser = _interopRequireDefault(require("koa-bodyparser"));

var _koaMorgan = _interopRequireDefault(require("koa-morgan"));

var _koaRouter = _interopRequireDefault(require("koa-router"));

var _koaStatic = _interopRequireDefault(require("koa-static"));

var _pug = _interopRequireDefault(require("pug"));

var _pg = require("pg");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const server = new _koa.default();
const router = new _koaRouter.default();
const PORT = process.env.DEVENV ? 4000 : process.env.PORT;
const dbURI = `postgres://hfjhjpkvynhpze:0a080728fb60faf2f1a72d0617121ff63d3d76d86aa1236ae84e251ed91cbff4@ec2-54-83-61-142.compute-1.amazonaws.com:5432/d4foi177e13v1q`;
const connString = process.env.DEVENV ? dbURI : process.env.DATABASE_URL;
const pool = new _pg.Pool({
  connectionString: connString,
  ssl: true
});
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});
server.use((0, _koaBodyparser.default)());
console.log("DEVENV:", process.env.DEVENV);
const selectFeedbackQuery = `SELECT "Comment_ID", "Comment_Title", "Comment_Author", "Comment_Message", "Replying_To", EXTRACT(EPOCH FROM "Comment_Date") as "Time", "Comment_Date" FROM "Feedback" ORDER BY "Time" DESC`;
const selectJournalQuery = `SELECT "Journal_ID", "Journal_Title", "Journal_Author", "Journal_Date", "Journal_Content", "Journal_Tag", EXTRACT(EPOCH FROM "Journal_Date") as "Time" FROM "Journal" ORDER BY "Time" DESC`; // website root

router.get('/', async ctx => {
  await pool.query(selectJournalQuery).then(res => {
    console.log(res.rows);
    let pageData = {
      query: res.rows
    };

    try {
      ctx.body = _pug.default.renderFile(`pub/pages/content/index.pug`, pageData);
    } catch (e) {
      console.log(e);
      ctx.status = 404;
      ctx.body = "Sorry, page not found";
    }
  }).catch(e => setImmediate(() => {
    throw e;
  }));
});
router.get('/:page_name', async ctx => {
  let cmd;

  switch (ctx.params.page_name) {
    case "feedback":
      cmd = selectFeedbackQuery;
      break;

    case "journal":
      cmd = selectJournalQuery;
      break;

    default:
      cmd = "";
  }

  await pool.query(cmd).then(res => {
    console.log(res.rows);
    let pageData = {
      query: res.rows
    };

    try {
      ctx.body = _pug.default.renderFile(`pub/pages/content/${ctx.params.page_name}.pug`, pageData);
    } catch (e) {
      console.log(e);
      ctx.status = 404;
      ctx.body = "Sorry, page not found";
    }
  }).catch(e => setImmediate(() => {
    throw e;
  }));
});
router.get('/:page_name/:sub_page', ctx => {
  try {
    ctx.body = _pug.default.renderFile(`pub/pages/content/${ctx.params.page_name}/${ctx.params.sub_page}.pug`);
  } catch (e) {
    ctx.status = 404;
    ctx.body = "Sorry, page not found";
  }
});
router.post('/feedback', async ctx => {
  let jsonBody = ctx.request.body;
  let values = [jsonBody.title, jsonBody.msg, jsonBody.date, null, jsonBody.name];
  console.log(jsonBody);
  console.log(values);
  const cmd = {
    name: 'insert-feedback',
    text: `INSERT INTO "Feedback"("Comment_Title", "Comment_Message", "Comment_Date", "Replying_To", "Comment_Author") VALUES($1, $2, $3, $4, $5)`,
    values
  };
  let success, error;
  await pool.query(cmd).then(res => {
    success = "true";
  }).catch(e => {
    success = "false", error = e;
  });
  ctx.body = {
    success,
    error
  };
});
server.use((0, _koaStatic.default)('pub')).use((0, _koaStatic.default)('app')).use((0, _koaMorgan.default)('tiny')).use(router.routes()).listen(PORT);
console.log(`This server is hosted on port ${PORT}`);