const express  = require('express')
const puppeteer = require("puppeteer")
const scrapeTest = require('./test')

const port  = process.env.PORT || 3000
const app = express()

app.get('/',async(req,res)=>{
  scrapeTest()
  .then((title) => {
    res.send(title);
  })
  .catch((error) => {
    res.send(error);
  });
})
app.listen(port, ()=> console.log(`Server listening on port: ${port}`))


