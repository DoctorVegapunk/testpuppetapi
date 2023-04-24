const express  = require('express')
const puppeteer = require("puppeteer")
require("dotenv").config()

const port  = process.env.PORT || 5000
const app = express()

app.get('/',async(req,res)=>{
    const browser = await puppeteer.launch({
        args:[
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--single-process',
            '--no-zygote'
        ],
        executablePath: process.env.NODE_ENV === "production" ? process.env.PUPPETEER_EXECUTABLE_PATH : puppeteer.executablePath()
    })
    const page = await browser.newPage()
    await page.goto('https://mangareader.to/')

    const testText = await page.$$("div.social-home-block.mb-4 >div.shb-left")
    const innerHTML = await testText[0].evaluate(element => element.innerHTML)
    res.send(innerHTML)
    await browser.close()
})


app.listen(port, ()=> console.log(`Server listening on port: ${port}`))


