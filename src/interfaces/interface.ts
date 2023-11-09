interface Data extends Info {
  username: string;
  avatar: string;
  verified: boolean;
  createAt: string;
  tweet: string;
  media: Media[];
}

interface Medias {
  avatar: string;
  media: Media[];
}

interface Media {
  url: string;
  type: string;
}

interface Info {
  views: string;
  reposts: string;
  quotes: string;
  likes: string;
  bookmarks: string;
}

export { Data, Media, Info, Medias };
