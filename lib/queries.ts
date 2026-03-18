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

export const homePageQuery = groq`
  *[_type == "homePage"][0] {
    "backgroundVideoUrl": backgroundVideo.asset->url,
    "backgroundVideoPosterUrl": backgroundVideoPoster.asset->url,
    headline,
    subheadline,
    ctaLabel,
    ctaLink,
    navLinks,
    seoTitle,
    seoDescription
  }
`;

export const workPageQuery = groq`
  *[_type == "workPage"][0] {
    filters
  }
`;