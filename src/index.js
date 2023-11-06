import puppeteer from "puppeteer";
import * as cheerio from "cheerio";

class MediaX {
  constructor() {
    this.browser = null;
  }

  async initialize() {
    this.browser = await puppeteer.launch({
      headless: "new",
    });
  }

  async get(url) {
    if (!this.browser) {
      throw new Error("Browser is not initialized. Call initialize() first.");
    }

    const page = await this.browser.newPage();

    await page.goto(url);

    await page.waitForSelector("img.css-9pa8cd", { timeout: 5_000 });

    const pageContent = await page.content();
    const $ = cheerio.load(pageContent);
    const imgs = $(".css-9pa8cd").toArray();
    imgs.shift();

    let link;
    const links = imgs.map((e) => {
      link = e.attribs.src.split("=");
      link.pop();
      link.push("4096x4096");
      return link.join("=");
    });

    await page.close();
    return links;
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

(async () => {
  const X = new MediaX();

  await X.initialize();

  const data = await X.get(
    "https://twitter.com/MichaJourney/status/1715979563522719995"
  );
  console.log(data);
})();

// module.exports = TwitterImageScraper;
