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

      // Native image upload
      _type == "mediaImage" => {
        "type": "image",
        "src": image.asset->url
      },

      // Native video upload
      _type == "mediaVideo" => {
        "type": "video",
        "src": video.asset->url,
        "poster": poster.asset->url
      },

      // Cloudinary asset — the plugin stores url, secure_url, resource_type etc.
      _type == "mediaCloudinary" => {
        "type": select(
          asset.resource_type == "video" => "video",
          "image"
        ),
        "src": asset.secure_url,
        // For videos Cloudinary can auto-generate a poster by swapping the extension
        "poster": select(
          asset.resource_type == "video" => asset.secure_url + ".jpg",
          null
        )
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