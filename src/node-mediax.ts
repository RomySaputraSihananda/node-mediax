import puppeteer, { Browser, Page } from "puppeteer";
import * as cheerio from "cheerio";

class Mediax {
  private browser: Browser | null = null;
  private $: any | null = null;

  public async init() {
    this.browser = await puppeteer.launch({
      headless: "new",
    });
  }

  public async get(tweetUrl: string): Promise<object> {
    if (!this.browser) {
      throw new Error("Browser is not initialized. Call init() first.");
    }

    const page: Page = await this.browser.newPage();

    await page.goto(tweetUrl);

    await page.waitForSelector("img.css-9pa8cd", { timeout: 5_000 });

    const pageContent: string = await page.content();

    this.$ = cheerio.load(pageContent);

    const media: string[] = this.getMedia();

    const tweet: string = this.getText(
      ".css-901oao.r-1nao33i.r-37j5jr.r-1inkyih.r-16dba41.r-135wba7.r-bcqeeo.r-bnwqim.r-qvutc0"
    );

    const info: object = this.getInfo();

    const createAt: string = this.getCreateAt();

    return { createAt, tweet, media, ...info };
  }

  private getInfo(): object {
    const [views, repost, likes, bookmarks]: any[] = this.$(
      ".css-1dbjc4n.r-xoduu5.r-1udh08x"
    ).toArray();

    return {
      views: this.getText(views),
      repost: this.getText(repost),
      likes: this.getText(likes),
      bookmarks: this.getText(bookmarks),
    };
  }

  private getMedia(): string[] {
    const imgs: any[] = this.$(".css-9pa8cd").toArray();
    imgs.shift();

    const medias: string[] = imgs.map((e: any) => {
      let link: string[] = e.attribs.src.split("=");
      link.pop();
      link.push("4096x4096");
      return link.join("=");
    });

    return medias;
  }

  private getCreateAt(): string {
    return this.$("time").toArray()[0].attribs.datetime;
  }

  private getText(element: any): string {
    return this.$(element).text();
  }

  public async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

export default Mediax;
