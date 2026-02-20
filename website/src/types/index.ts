export interface SanityImage {
  asset: { _ref: string; url?: string }
  alt?: string
  caption?: string
  hotspot?: { x: number; y: number }
  crop?: { top: number; bottom: number; left: number; right: number }
}

export interface Project {
  _id: string
  title: string
  slug: { current: string }
  category: 'residential' | 'commercial'
  architect?: string
  location?: string
  description?: string
  size?: string
  year?: number
  collaborators?: string[]
  heroImage?: SanityImage
  images?: SanityImage[]
}

export interface StaffBio {
  _id: string
  name: string
  title?: string
  bio?: string
  portrait?: SanityImage
  fijiPhone?: string
  nzPhone?: string
  email?: string
}

export interface HomepageImageDoc {
  image: SanityImage
}

export interface ServiceItem {
  _key: string
  heading: string
  description?: string
  buttonText?: string
  buttonLink?: string
}
