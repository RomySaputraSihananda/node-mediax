import Mediax from "../lib/node-mediax.js";
import fs from "fs";
import path from "path";

const links = [
  "https://twitter.com/erigostore/status/1721427552097673429/",
  "https://twitter.com/Flxavoid/status/1721428284813250950/",
  "https://twitter.com/glowinthesarr/status/1721428398764085540/",
  "https://twitter.com/cinanazs/status/1721447514212348042",
  "https://twitter.com/azrillcraft14/status/1721646120760488020",
  "https://twitter.com/erigostore/status/1722162111714033965",
  "https://twitter.com/erigostore/status/1722129991876640961",
  "https://twitter.com/agansam_/status/1721843115638874346",
  "https://twitter.com/erigostore/status/1722238383542657528",
  "https://twitter.com/amortentia0213/status/1710162301326938255",
];

(async () => {
  const X = new Mediax();
  /*
   * https://twitter.com/i/videos/tweet/
   */

  // await X.init();
  const data = await X.get(links.pop());
  //  await X.save("data", links.pop());
  console.log(data);

  // for (const link of links) {
  //   const data = await X.get(link);
  //   console.log(data);
  // }

  // await X.close();
})();
