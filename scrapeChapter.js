const puppeteer = require('puppeteer');

const scrapeChapter = (chapterTitle,chapterLink)=>{
    return new Promise(async (resolve,reject)=>{
   
        const browser = await puppeteer.launch({
            headless: true,
            executablePath: '/usr/bin/chromium-browser',
            args: [
              '--no-sandbox',
              '--disable-gpu',
            ]
          });
        const url = chapterLink;
        const page = await browser.newPage();

        const cookies = [{
            'name': 'mr_settings',
            'value': '{%22readingMode%22:%22vertical%22%2C%22readingDirection%22:%22rtl%22%2C%22quality%22:%22high%22%2C%22hozPageSize%22:1}',
            'url': 'https://mangareader.to'
        }];

        await page.setCookie(...cookies);
        await page.goto(url);

        const imageLinks = {
            title:chapterTitle,
            pages:[]
        }
        const images = await page.$$("div.iv-card")
        for(const [index, image] of images.entries()){
            const dataUrl = await image.evaluate(el => el.getAttribute('data-url'));
            imageLinks.pages.push({
                pageNumber:index+1,
                link:dataUrl
            })
        }
        await browser.close()
        resolve(imageLinks)

    })

}

module.exports = scrapeChapter