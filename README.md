# node-mediax

node-mediax is a node module that allows you to scrape Twitter to retrieve image URLs and info with specified URLs.

### Getting Started

```sh
npm i node-mediax
# yarn add node-mediax
```

### Example:

#### 1. Get info

```javascript
import Mediax from "node-mediax";

const X = new Mediax();

await X.init();

const data = await X.get(
  "https://twitter.com/amortentia0213/status/1710162301326938255"
);
console.log(data);

await X.close();
```

##### Output

```json
{
  "username": "@amortentia0213",
  "avatar": "https://pbs.twimg.com/profile_images/1651244772646854658/LssoZYlz.jpg",
  "verified": false,
  "createAt": "2023-10-06T05:17:20.000Z",
  "tweet": "230929  #TGIFreday\n\n#Freya #프레야 #フレヤ #JKT48Freya Jayawardana",
  "media": [
    {
      "url": "https://pbs.twimg.com/media/F7u3iB-boAAzYT9?format=jpg&name=4096x4096",
      "type": "image"
    },
    {
      "url": "https://pbs.twimg.com/media/F7u3iB-aQAAgrHo?format=jpg&name=4096x4096",
      "type": "image"
    },
    {
      "url": "https://pbs.twimg.com/media/F7u3iB8awAA1QOJ?format=jpg&name=4096x4096",
      "type": "image"
    }
  ],
  "views": "32.3K",
  "repost": "371",
  "likes": "5",
  "bookmarks": "2,643"
}
```

#### 2. Save media

```javascript
import Mediax from "node-mediax";

const X = new Mediax();

await X.init();

await X.save(
  "data",
  "https://twitter.com/amortentia0213/status/1710162301326938255"
);

await X.close();
```

##### Output

```json
[
  {
    "url": "https://pbs.twimg.com/media/F7u3iB-boAAzYT9?format=jpg&name=4096x4096",
    "message": "save on data/F7u3iB-boAAzYT9.jpg"
  },
  {
    "url": "https://pbs.twimg.com/media/F7u3iB8awAA1QOJ?format=jpg&name=4096x4096",
    "message": "save on data/F7u3iB8awAA1QOJ.jpg"
  },
  {
    "url": "https://pbs.twimg.com/media/F7u3iB-aQAAgrHo?format=jpg&name=4096x4096",
    "message": "save on data/F7u3iB-aQAAgrHo.jpg"
  }
]
```

##### Sample image

- **data/F7u3iB-boAAzYT9.jpg**
  ![](/data/F7u3iB-boAAzYT9.jpg)
- **data/F7u3iB8awAA1QOJ.jpg**
  ![](/data/F7u3iB8awAA1QOJ.jpg)
- **data/F7u3iB-aQAAgrHo.jpg**
  ![](/data/F7u3iB-aQAAgrHo.jpg)

Dengan node-mediax, Anda dapat dengan mudah mengakses gambar-gambar dari Twitter dan mengintegrasikannya ke dalam proyek Anda. Pastikan untuk mematuhi aturan dan kebijakan penggunaan dari Twitter.

## License

This project is licensed under the [MIT License](LICENSE).
