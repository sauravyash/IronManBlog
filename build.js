var sass = require('node-sass')
var babel = require('@babel/core')
var fs = require('fs')

sass.render({
  file: 'src/scss/core.scss',
  outFile: 'pub/css/core.scss',
  sourceMap: true
},
(err, result) => {
  result
  if (err) throw err
})

function babelTransform(from, to){
  babel.transformFileAsync(from, {}).then(result => {
    fs.writeFile(to, result.code, (err) => {
      if (err) throw(err)
    })
  }).catch(e=>{console.log(from, e)})
}

babelTransform('src/server/server.js','app/server.js')

babelTransform('src/browser/browser.js','pub/js/browser.js')
