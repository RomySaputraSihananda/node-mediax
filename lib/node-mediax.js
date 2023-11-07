var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import puppeteer from "puppeteer";
import * as cheerio from "cheerio";
import fs from "fs";
class Mediax {
    constructor() {
        this.browser = null;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.browser = yield puppeteer.launch({
                headless: "new",
            });
        });
    }
    get(tweetUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.browser) {
                throw new Error("Browser is not initialized. Call initialize() first.");
            }
            const page = yield this.browser.newPage();
            yield page.goto(tweetUrl);
            yield page.waitForSelector("img.css-9pa8cd", { timeout: 5000 });
            const pageContent = yield page.content();
            fs.writeFileSync("test.txt", pageContent);
            const $ = cheerio.load(pageContent);
            const imgs = $(".css-9pa8cd").toArray();
            imgs.shift();
            const links = imgs.map((e) => {
                let link = e.attribs.src.split("=");
                link.pop();
                link.push("4096x4096");
                return link.join("=");
            });
            const tweet = $(".css-901oao.r-1nao33i.r-37j5jr.r-1inkyih.r-16dba41.r-135wba7.r-bcqeeo.r-bnwqim.r-qvutc0").text();
            const divs = $(".css-1dbjc4n.r-xoduu5.r-1udh08x");
            divs.forEach((element) => {
                console.log(element.text());
            });
            return { tweet, links, divs };
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.browser) {
                yield this.browser.close();
            }
        });
    }
}
export default Mediax;
