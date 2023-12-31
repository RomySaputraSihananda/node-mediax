import puppeteer, { Browser, Page } from "puppeteer";
import * as cheerio from "cheerio";
import fs from "fs";
import path from "path";
import { Data, Info, Media, Medias } from "./interfaces/interface";

class node_mediax {
  private browser: Browser | null = null;
  private $: any | null = null;

  public async init(): Promise<void> {
    this.browser = await puppeteer.launch({
      headless: "new",
    });
  }

  /**
   * This is a method for retrieving data from a Twitter URL.
   * @param {string} url - URL from Twitter that will be scrapped
   * @returns {Promise<Data>} Details of the URL that has been scrapped
   */
  public async get(url: string): Promise<Data> {
    if (!this.browser) {
      throw new Error("Browser is not initialized. Call init() first.");
    }

    const page: Page = await this.browser.newPage();

    await page.goto(url.replace(/\/photo.*/, ""));

    await page.waitForSelector("img.css-9pa8cd", { timeout: 5_000 });

    this.$ = cheerio.load(await page.content());

    const { media, avatar } = this.getMedia() as {
      media: Media[];
      avatar: string;
    };
    const tweet: string = this.getTweet();
    const { views, reposts, quotes, likes, bookmarks } = this.getInfo() as {
      views: string;
      reposts: string;
      quotes: string;
      likes: string;
      bookmarks: string;
    };
    const createAt: string = this.getCreateAt();
    const username: string = this.getUsername();
    const verified: boolean = this.getVerified();

    return {
      username,
      avatar,
      verified,
      createAt,
      tweet,
      media,
      views,
      reposts,
      quotes,
      likes,
      bookmarks,
    };
  }

  /**
   * This is a method to grab an image from a Twitter URL and save it
   * @param {string} folder - The name of the folder that will be used to store photos
   * @param {string} url - URL from Twitter that will be scrapped
   */
  public async save(folder: string, url: string): Promise<void> {
    const { media } = (await this.get(url)) as {
      media: Media[];
    };

    if (!fs.existsSync(folder)) fs.mkdirSync(folder);

    media.forEach(async ({ url }: { url: string }) => {
      const req = await fetch(url);

      const res = await req.arrayBuffer();

      fs.writeFileSync(path.join(folder, this.getName(url)), Buffer.from(res));
      console.log({
        url,
        message: `save on ${path.join(folder, this.getName(url))}`,
      });
    });

    console.log("download complete");
  }

  private getName(url: string): string {
    return url.split("/")[4].split("?")[0] + ".jpg";
  }

  private getInfo(): Info {
    const [views, reposts, quotes, likes, bookmarks] = this.$(
      ".css-1dbjc4n.r-xoduu5.r-1udh08x"
    ).toArray() as [
      views: string,
      reposts: string,
      quotes: string,
      likes: string,
      bookmarks: string
    ];

    return {
      views: this.getText(views),
      likes: this.getText(likes),
      reposts: this.getText(reposts),
      quotes: this.getText(quotes),
      bookmarks: this.getText(bookmarks),
    };
  }

  private getMedia(): Medias {
    const imgs: any[] = this.$(".css-9pa8cd").toArray();
    const avatar: string = imgs.shift().attribs.src.replace("_normal", "");

    const media: Media[] = imgs.map((e: any) => {
      let link: string[] = e.attribs.src.split("=");
      link.pop();
      link.push("4096x4096");
      return { url: link.join("="), type: "image" };
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

  private getNumber(element: any): number {
    const number = this.getText(element).replace(/,/g, ".");
    return number.match("k") ? parseFloat(number) * 1000 : parseFloat(number);
  }

  public async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
    }
  }
}
class Mediax {
  /**
   * This is a method for retrieving data from a Twitter URL.
   * @param {string} url - URL from Twitter that will be scrapped
   * @returns {Promise<Data>} Details of the URL that has been scrapped
   */
  public async get(url: string): Promise<Data> {
    const x: node_mediax = new node_mediax();

    await x.init();
    const data: Data = await x.get(url);
    await x.close();

    return data;
  }

  /**
   * This is a method to grab an image from a Twitter URL and save it
   * @param {string} folder - The name of the folder that will be used to store photos
   * @param {string} url - URL from Twitter that will be scrapped
   */
  public async save(folder: string, url: string): Promise<void> {
    const x: node_mediax = new node_mediax();

    await x.init();
    await x.save(folder, url);
    await x.close();
  }
}

export default new Mediax();
