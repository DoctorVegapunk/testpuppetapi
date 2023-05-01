const puppeteer = require('puppeteer');
const { Cluster } = require('puppeteer-cluster');

const scrapeManga = (mangaLink) =>{ 
  return new Promise( async (resolve,reject) => {
    const cluster = await Cluster.launch({
      concurrency: Cluster.CONCURRENCY_CONTEXT,
      maxConcurrency: 6,
      puppeteerOptions: {
        executablePath: '/usr/bin/chromium-browser',
        args: [
          '--no-sandbox',
          '--disable-gpu',
        ],
      },
    });

    const imageLinks = []

    
      
    const browser = await puppeteer.launch({
      executablePath: '/usr/bin/chromium-browser',
      args: [
        '--no-sandbox',
        '--disable-gpu',
      ]
    });
    const page = await browser.newPage();

    const cookies = [{
      'name': 'mr_settings',
      'value': '{%22readingMode%22:%22vertical%22%2C%22readingDirection%22:%22rtl%22%2C%22quality%22:%22high%22%2C%22hozPageSize%22:1}',
      'url': 'https://mangareader.to'
    }];

    await page.setCookie(...cookies);


    await page.goto(mangaLink);

    // Set the viewport size
    await page.setViewport({ width: 1920, height: 1080 });
    await cluster.task(async ({ page, data }) => {
      await page.goto(data.link);
      const images = await page.$$("div.iv-card")
      imageLinks.push({
          title:data.title,
          pages:[]
      })
      for(const [index, image] of images.entries()){
          const dataUrl = await image.evaluate(el => el.getAttribute('data-url'));
          imageLinks[data.index].pages.push({
              pageNumber:index+1,
              link:dataUrl
          })
      }
    });


    const chapters = await page.$$("li.item.reading-item.chapter-item")
    for(const [index,chapter] of chapters.entries()){
      const title = await page.evaluate(el => el.querySelector("a").getAttribute("title"), chapter)
      const link = "https://mangareader.to" +  await page.evaluate(el => el.querySelector("a").getAttribute("href"), chapter)
      cluster.queue({link,title:title,page,index})
    }

    await cluster.idle();
    await cluster.close();
    await browser.close();

    resolve(JSON.stringify(imageLinks))
  })
}
module.exports = scrapeManga