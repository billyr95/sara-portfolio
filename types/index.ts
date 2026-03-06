export type AspectRatio = '16:9' | '9:16' | '1:1';

export interface MediaItem {
  type: 'video' | 'image';
  src: string;
  poster?: string;
}

export interface Project {
  _id: string;
  title: string;
  slug: string;
  description: string;
  aspectRatio: AspectRatio;
  thumbnail: MediaItem;
  media: MediaItem[];
  tags: string[];
  year: string;
}
