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

    const { media, avatar }: any = this.getMedia();
    const tweet: string = this.getTweet();
    const info: object = this.getInfo();
    const createAt: string = this.getCreateAt();
    const username: string = this.getUsername();
    const verified: boolean = this.getVerified();

    return { username, avatar, verified, createAt, tweet, media, ...info };
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

  private getMedia(): object {
    const imgs: any[] = this.$(".css-9pa8cd").toArray();
    const avatar: string = imgs.shift().attribs.src.replace("_normal", "");

    const media: string[] = imgs.map((e: any) => {
      let link: string[] = e.attribs.src.split("=");
      link.pop();
      link.push("4096x4096");
      return link.join("=");
    });

    return { media, avatar };
  }

  private getTweet(): string {
    return this.getText(this.$(".css-1dbjc4n.r-1s2bzr4"));
  }

  private getCreateAt(): string {
    return this.$("time").toArray()[0].attribs.datetime;
  }

  private getUsername(): string {
    return this.getText(
      this.$(
        ".css-901oao.css-1hf3ou5.r-18u37iz.r-37j5jr.r-1wvb978.r-a023e6.r-16dba41.r-rjixqe.r-bcqeeo.r-qvutc0"
      )
    );
  }

  private getVerified(): boolean {
    const verif = this.$(
      ".r-1cvl2hr.r-4qtqp9.r-yyyyoo.r-1xvli5t.r-9cviqr.r-f9ja8p.r-og9te1.r-bnwqim.r-1plcrui.r-lrvibr"
    );

    return verif.length < 1 ? false : true;
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
