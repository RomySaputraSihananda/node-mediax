import Mediax from "../lib/node-mediax.js";

const links = [
  "https://twitter.com/erigostore/status/1721427552097673429/",
  "https://twitter.com/Flxavoid/status/1721428284813250950/",
  "https://twitter.com/glowinthesarr/status/1721428398764085540/",
  "https://twitter.com/cinanazs/status/1721447514212348042",
  "https://twitter.com/azrillcraft14/status/1721646120760488020",
];

(async () => {
  const X = new Mediax();
  /*
   * https://twitter.com/i/videos/tweet/
   */
  await X.init();
  // const data = await X.get(links[0]).save();
  // console.log(data);

  const data2 = await X.get(links.pop());
  console.log(data2);

  await X.close();
})();
