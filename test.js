const puppeteer = require('puppeteer')
const scrapeTest = async() => new Promise(async(resolve, reject) => {
        
      const browser = await puppeteer.launch({
        headless: true,
        executablePath: '/usr/bin/chromium-browser',
        args: [
          '--no-sandbox',
          '--disable-gpu',
        ]
      });
      const page = await browser.newPage();
      await page.goto('https://mangareader.to');
      const titleElement =  await page.$$("h1.A1headline")
      const title = await (await titleElement[0].getProperty('textContent')).jsonValue()

      resolve(title)

      await browser.close();
      
})

module.exports = scrapeTest