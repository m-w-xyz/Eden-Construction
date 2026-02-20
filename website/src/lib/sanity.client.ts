import { createClient } from 'next-sanity'
import { createImageUrlBuilder } from '@sanity/image-url'

export const config = {
  projectId: 'pyrxfvdm',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
}

export const client = createClient(config)

const builder = createImageUrlBuilder(config)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
  return builder.image(source)
}
