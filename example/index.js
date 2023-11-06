import Mediax from "../lib/node-mediax.js";

(async () => {
  const X = new Mediax();

  await X.init();

  const data = await X.get(
    "https://twitter.com/MichaJourney/status/1715979563522719995"
  );
  console.log(data);

  await X.close();
})();
