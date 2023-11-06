import puppeteer, { Browser, Page } from "puppeteer";
import * as cheerio from "cheerio";

class MediaX {
  private browser: Browser | null = null;

  async initialize() {
    this.browser = await puppeteer.launch({
      headless: true,
    });
  }

  async scrapeImages(tweetUrl: string): Promise<string[]> {
    if (!this.browser) {
      throw new Error("Browser is not initialized. Call initialize() first.");
    }

    const page: Page = await this.browser.newPage();

    await page.goto(tweetUrl);

    await page.waitForSelector("img.css-9pa8cd", { timeout: 5_000 });

    const pageContent: string = await page.content();
    const $: any = cheerio.load(pageContent);
    const imgs: any = $(".css-9pa8cd").toArray();
    imgs.shift();

    const links: string[] = imgs.map((e: any) => {
      let link: string[] = e.attribs.src.split("=");
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

export default MediaX;
