import { groq } from 'next-sanity';

export const allProjectsQuery = groq`
  *[_type == "project"] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    aspectRatio,
    "thumbnail": {
      "type": thumbnailType,
      "src": select(
        thumbnailType == "video" => thumbnailVideo.asset->url,
        thumbnailImage.asset->url
      ),
      "poster": thumbnailPoster.asset->url
    },
    "media": media[] {
      _type,
      _type == "mediaImage" => {
        "type": "image",
        "src": image.asset->url
      },
      _type == "mediaVideo" => {
        "type": "video",
        "src": video.asset->url,
        "poster": poster.asset->url
      }
    },
    tags,
    year
  }
`;