import puppeteer, { Browser, Page } from "puppeteer";
import * as cheerio from "cheerio";
import fs from "fs";

class Mediax {
  private browser: Browser | null = null;

  public async init() {
    this.browser = await puppeteer.launch({
      headless: "new",
    });
  }

  public async get(tweetUrl: string): Promise<object> {
    if (!this.browser) {
      throw new Error("Browser is not initialized. Call initialize() first.");
    }

    const page: Page = await this.browser.newPage();

    await page.goto(tweetUrl);

    await page.waitForSelector("img.css-9pa8cd", { timeout: 5_000 });

    const pageContent: string = await page.content();

    fs.writeFileSync("test.txt", pageContent);

    const $: any = cheerio.load(pageContent);
    const imgs: any = $(".css-9pa8cd").toArray();
    imgs.shift();

    const links: string[] = imgs.map((e: any) => {
      let link: string[] = e.attribs.src.split("=");
      link.pop();
      link.push("4096x4096");
      return link.join("=");
    });

    const tweet: string = $(
      ".css-901oao.r-1nao33i.r-37j5jr.r-1inkyih.r-16dba41.r-135wba7.r-bcqeeo.r-bnwqim.r-qvutc0"
    ).text();

    const divs: any[] = $(".css-1dbjc4n.r-xoduu5.r-1udh08x");

    divs.forEach((element: any) => {
      console.log(element.text());
    });

    return { tweet, links, divs };
  }

  public async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

export default Mediax;
