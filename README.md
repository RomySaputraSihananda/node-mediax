# node-mediax

node-mediax adalah modul Python yang memungkinkan Anda untuk melakukan web scraping pada Twitter untuk mengambil URL gambar dengan URL yang sudah ditentukan.

### Fitur Utama:

1. Mengambil URL gambar dari URL yang ditentukan.

### Getting Started

```sh
npm i node-mediax
# yarn add node-mediax
```

### Usage:

```javascript
import Mediax from "node-mediax";

const X = new Mediax();

await X.init();

const data = await X.get(
  "https://twitter.com/Flxavoid/status/1721428284813250950/"
);
console.log(data);

await X.close();
```

Dengan node-mediax, Anda dapat dengan mudah mengakses gambar-gambar dari Twitter dan mengintegrasikannya ke dalam proyek Anda. Pastikan untuk mematuhi aturan dan kebijakan penggunaan dari Twitter.

## License

This project is licensed under the [MIT License](LICENSE).
