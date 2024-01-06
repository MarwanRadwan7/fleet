export interface Post {
  id: string;
  user_id: string;
  slug: string;
  content: string;
  media_url: string;
  media_thumbnail: string;
  hashtags: string;
  tags: string;
  lat: number;
  lng: number;
  edited: boolean;
  createdAt: Date;
  updatedAt: Date;
}
