import { groq } from 'next-sanity'

// Brand assets (fonts, logo)
export const brandAssetsQuery = groq`
  *[_type == "brandAssets"][0] {
    typefaces[] {
      name,
      weight,
      "url": asset->url
    }
  }
`

// About page hero banner
export const aboutPageQuery = groq`
  *[_type == "aboutPage"][0] {
    "hero": heroBanner {
      asset->,
      alt,
      hotspot,
      crop
    },
    "image2": image2 {
      asset->,
      alt,
      hotspot,
      crop
    },
    "image3": image3 {
      asset->,
      alt,
      hotspot,
      crop
    },
    statement1,
    servicesIntroduction,
    servicesButtonText,
    servicesButtonLink,
    serviceItems[] {
      _key,
      heading,
      description,
      buttonText,
      buttonLink
    },
    "image4": image4 {
      asset->,
      alt,
      hotspot,
      crop
    }
  }
`

// Homepage hero image
export const homepageImageQuery = groq`
  *[_type == "homepageImage"][0] {
    image {
      asset->,
      alt,
      hotspot,
      crop
    }
  }
`

// Projects list (all, or filtered by category)
export const projectsQuery = groq`
  *[_type == "project"] | order(year desc) {
    _id,
    title,
    slug,
    category,
    year,
    location,
    "heroImage": images[0] {
      asset->,
      alt,
      hotspot,
      crop
    }
  }
`

export const projectsByCategoryQuery = groq`
  *[_type == "project" && category == $category] | order(year desc) {
    _id,
    title,
    slug,
    category,
    year,
    location,
    "heroImage": images[0] {
      asset->,
      alt,
      hotspot,
      crop
    }
  }
`

// Single project detail
export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    category,
    architect,
    location,
    description,
    size,
    year,
    collaborators,
    images[] {
      asset->,
      alt,
      caption,
      hotspot,
      crop
    }
  }
`

// Adjacent projects for prev/next navigation
export const adjacentProjectsQuery = groq`{
  "prev": *[_type == "project" && year <= $year && slug.current != $slug] | order(year desc)[0] {
    title,
    slug
  },
  "next": *[_type == "project" && year >= $year && slug.current != $slug] | order(year asc)[0] {
    title,
    slug
  }
}`

// First project hero image (used as About page hero)
export const firstProjectHeroQuery = groq`
  *[_type == "project"] | order(year desc)[0] {
    "hero": images[0] {
      asset->,
      alt,
      hotspot,
      crop
    }
  }
`

// Process page (hero banner + intro + image1)
export const processPageQuery = groq`
  *[_type == "processPage"][0] {
    "heroBanner": heroBanner {
      asset->,
      alt,
      hotspot,
      crop
    },
    introduction,
    "image1": image1 {
      asset->,
      alt,
      hotspot,
      crop
    }
  }
`

// Testimonials (single doc with quotes array)
export const testimonialsQuery = groq`
  *[_type == "testimonials"][0] {
    quotes[] {
      _key,
      quote,
      name,
      title
    }
  }
`

// Staff bios
export const staffBiosQuery = groq`
  *[_type == "staffBio"] | order(name asc) {
    _id,
    name,
    title,
    bio,
    portrait {
      asset->,
      alt,
      hotspot,
      crop
    },
    fijiPhone,
    nzPhone,
    email
  }
`
