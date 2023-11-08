interface Data {
  username: string;
  avatar: string;
  verified: boolean;
  createAt: string;
  tweet: string;
  media: Media[];
  views: string;
  repost: string;
  likes: string;
  bookmarks: string;
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
  repost: string;
  likes: string;
  bookmarks: string;
}

export { Data, Media, Info, Medias };
