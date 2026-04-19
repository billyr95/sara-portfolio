import { groq } from 'next-sanity';

export const allProjectsQuery = groq`
  *[_type == "project"] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    aspectRatio,
    thumbnailFocalPoint,

    // Thumbnail — single Cloudinary asset (image or video)
    "thumbnail": {
      "type": select(thumbnail.resource_type == "video" => "video", "image"),
      "src": thumbnail.secure_url,
      // For video thumbnails, Cloudinary can serve a poster by appending .jpg
      "poster": select(
        thumbnail.resource_type == "video" => thumbnail.secure_url + ".jpg",
        null
      )
    },

    // Modal gallery — array of Cloudinary assets
    "media": media[]{
      "type": select(asset.resource_type == "video" => "video", "image"),
      "src": asset.secure_url,
      "poster": select(
        asset.resource_type == "video" => asset.secure_url + ".jpg",
        null
      )
    }[defined(src)],

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

export const aboutPageQuery = groq`
  *[_type == "aboutPage"][0] {
    "photoUrl": photo.asset->url,
    bio,
    email
  }
`;

export const contactPageQuery = groq`
  *[_type == "contactPage"][0] {
    heading,
    subheading,
    email,
    instagramHandle,
    extraLinks[] {
      label,
      url
    }
  }
`;