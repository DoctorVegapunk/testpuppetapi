const express  = require('express')
const puppeteer = require("puppeteer")
const bodyParser = require('body-parser');
const axios = require('axios')

const port  = process.env.PORT || 3000
const app = express()

const scrapeTest = require('./test')

const mangareader = require('./websites/mangareader.json')
const scrapeChapter = require('./scrapeChapter')
const scrapeManga = require('./scrapeManga')
const scrapeChapterList =require('./scrapeChapterList')

app.use(bodyParser.json());

app.get('/',async(req,res)=>{
  scrapeTest()
  .then((title) => {
    res.send(title);
  })
  .catch((error) => {
    res.send(error);
  });
})

app.get('/mangareader/:mangaName',async(req,res)=>{
    const mangaData = mangareader[req.params.mangaName]
    scrapeChapterList(mangaData.link)
    .then(result=>{
      res.json(result)
    })
    .catch(error=>{
      res.send(error)
    })
})

app.post('/mangareader/download/chapter',async(req,res)=>{
  const data = req.body
  scrapeChapter(data.title,data.link)
  .then(result=>{
    res.send(result)
  })
  .catch(error=>{
    res.send(error)
  })
})

app.get('/mangareader/download/all/:mangaName',async(req,res)=>{
  const mangaData = mangareader[req.params.mangaName]

  scrapeManga(mangaData.link)
  .then(result=>{
    res.json(result)
  })
  .catch(error=>{
    res.send(error)
  })
})

app.get('/test',async(req,res)=>{
    const requestBody = {"title":"Chapter 23: Ep. 23 - Jakdo Fire Station Platoon 2 (2)","link":"https://mangareader.to/read/1-second-55488/en/chapter-23"}
    axios.post('https://nameless-tor-52807.herokuapp.com/mangareader/download/chapter', requestBody).then(response => {
        res.json(response.data);
      }).catch(error => {
        res.send(error);
      });
})

app.listen(port, ()=> console.log(`Server listening on port: ${port}`))


