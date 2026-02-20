import { client } from '@/lib/sanity.client'
import { brandAssetsQuery } from '@/lib/queries'

interface Typeface {
  name: string
  weight: string
  url: string
}

/** Strip common weight descriptors from the end of a font name to get the family name.
 *  e.g. "Aktiv Grotesk Bold" → "Aktiv Grotesk"
 *       "Helvetica Neue Roman" → "Helvetica Neue"
 */
function getFontFamily(name: string): string {
  const suffixes = [
    'Thin', 'ExtraLight', 'UltraLight', 'Light', 'Regular', 'Roman', 'Book',
    'Medium', 'SemiBold', 'DemiBold', 'Bold', 'ExtraBold', 'UltraBold',
    'Black', 'Heavy', 'Italic', 'Oblique', 'Condensed', 'Extended',
  ]
  for (const suffix of suffixes) {
    if (name.endsWith(' ' + suffix)) {
      return name.slice(0, -(suffix.length + 1)).trim()
    }
  }
  return name
}

function getFormat(url: string): string {
  if (url.endsWith('.woff2')) return 'woff2'
  if (url.endsWith('.woff')) return 'woff'
  if (url.endsWith('.ttf')) return 'truetype'
  return 'opentype' // .otf
}

export default async function FontLoader() {
  const data: { typefaces: Typeface[] } | null = await client.fetch(
    brandAssetsQuery,
    {},
    { next: { revalidate: 3600 } }
  )

  if (!data?.typefaces?.length) return null

  const css = data.typefaces
    .filter((t) => t.url)
    .map((t) => {
      const family = getFontFamily(t.name)
      const weight = parseInt(t.weight) || 400
      const format = getFormat(t.url)
      return `@font-face {
  font-family: '${family}';
  src: url('${t.url}') format('${format}');
  font-weight: ${weight};
  font-style: normal;
  font-display: swap;
}`
    })
    .join('\n\n')

  return <style dangerouslySetInnerHTML={{ __html: css }} />
}
