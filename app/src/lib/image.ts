export type ImageFormat = 'jpg' | 'jpeg' | 'png'

export type ImageVariant = {
  type: string
  srcSet: string
  sizes?: string
}

const OPTIMIZED_DIR = '/images/optimized'

const DEFAULT_WIDTHS = [320, 480, 640, 768, 960, 1024, 1280, 1600, 1920, 2560] as const

function parseImagePath(src: string): { name: string; ext: ImageFormat } | null {
  const match = src.match(/^\/images\/(.+)\.(jpg|jpeg|png)$/i)
  if (!match) return null
  const name = match[1]
  const ext = match[2].toLowerCase() as ImageFormat
  return { name, ext }
}

function buildSrcSet(name: string, ext: string, widths: readonly number[]): string {
  return widths.map((w) => `${OPTIMIZED_DIR}/${name}-${w}.${ext} ${w}w`).join(', ')
}

export function getOptimizedImageSources(options: {
  src: string
  sizes?: string
  widths?: readonly number[]
}): { sources: ImageVariant[]; imgSrc: string; imgSrcSet?: string; imgSizes?: string } {
  const parsed = parseImagePath(options.src)
  const widths = options.widths ?? DEFAULT_WIDTHS

  if (!parsed) {
    return {
      sources: [],
      imgSrc: options.src,
      imgSizes: options.sizes,
    }
  }

  const rasterExt = parsed.ext === 'png' ? 'png' : 'jpg'
  const rasterType = rasterExt === 'png' ? 'image/png' : 'image/jpeg'

  const sources: ImageVariant[] = [
    {
      type: 'image/webp',
      srcSet: buildSrcSet(parsed.name, 'webp', widths),
      sizes: options.sizes,
    },
    {
      type: rasterType,
      srcSet: buildSrcSet(parsed.name, rasterExt, widths),
      sizes: options.sizes,
    },
  ]

  const defaultWidth = widths[Math.floor(widths.length / 2)] ?? 1280
  const imgSrc = `${OPTIMIZED_DIR}/${parsed.name}-${defaultWidth}.${rasterExt}`

  return {
    sources,
    imgSrc,
    imgSrcSet: sources[1]?.srcSet,
    imgSizes: options.sizes,
  }
}

export function getImageLoadingProps(options: { priority?: boolean } = {}) {
  return {
    loading: options.priority ? ('eager' as const) : ('lazy' as const),
    decoding: 'async' as const,
    fetchPriority: options.priority ? ('high' as const) : ('low' as const),
  }
}
