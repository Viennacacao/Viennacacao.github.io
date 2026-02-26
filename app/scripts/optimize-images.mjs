import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const inputDir = path.resolve(process.cwd(), 'public/images')
const outputDir = path.resolve(process.cwd(), 'public/images/optimized')

const widths = [96, 128, 160, 256, 320, 384, 480, 512, 640, 768, 960, 1024, 1280, 1600, 1920, 2560]
const widthSet = new Set(widths)
const rasterExts = ['jpg', 'jpeg', 'png']

async function fileExists(filePath) {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

async function shouldSkip(inputPath, outputPaths) {
  const inputStat = await fs.stat(inputPath)
  const outputsExist = await Promise.all(outputPaths.map((p) => fileExists(p)))
  if (outputsExist.some((exists) => !exists)) return false
  const outputStats = await Promise.all(outputPaths.map((p) => fs.stat(p)))
  return outputStats.every((s) => s.mtimeMs >= inputStat.mtimeMs)
}

function getBaseName(filename) {
  const ext = path.extname(filename)
  return { name: filename.slice(0, -ext.length), ext: ext.slice(1).toLowerCase() }
}

function parseOptimizedFilename(file) {
  const match = file.match(/^(.*)-(\d+)\.(webp|jpg|png)$/i)
  if (!match) return null
  const baseName = match[1]
  const width = Number(match[2])
  const ext = match[3].toLowerCase()
  if (!widthSet.has(width)) return null
  return { baseName, width, ext }
}

async function cleanupStaleOutputs() {
  let entries
  try {
    entries = await fs.readdir(outputDir)
  } catch {
    return
  }

  await Promise.all(
    entries.map(async (file) => {
      const parsed = parseOptimizedFilename(file)
      if (!parsed) return
      const sourceChecks = await Promise.all(
        rasterExts.map((ext) => fileExists(path.join(inputDir, `${parsed.baseName}.${ext}`)))
      )
      const hasSource = sourceChecks.some(Boolean)
      if (hasSource) return
      await fs.rm(path.join(outputDir, file), { force: true })
    })
  )
}

async function optimizeOne({ file, force }) {
  const { name, ext } = getBaseName(file)
  if (!rasterExts.includes(ext)) return
  if (file.startsWith('optimized/')) return

  const inputPath = path.join(inputDir, file)
  const outExt = ext === 'jpeg' ? 'jpg' : ext

  const outputPaths = widths.flatMap((w) => [
    path.join(outputDir, `${name}-${w}.webp`),
    path.join(outputDir, `${name}-${w}.${outExt}`),
  ])

  if (!force) {
    const skip = await shouldSkip(inputPath, outputPaths)
    if (skip) return
  }

  const inputBuffer = await fs.readFile(inputPath)
  const base = sharp(inputBuffer, { failOnError: false })

  await Promise.all(
    widths.map(async (w) => {
      const resized = base.clone().resize({ width: w })

      const webpOut = path.join(outputDir, `${name}-${w}.webp`)
      await resized
        .clone()
        .webp({ quality: 78 })
        .toFile(webpOut)

      const rasterOut = path.join(outputDir, `${name}-${w}.${outExt}`)
      if (outExt === 'png') {
        await resized.clone().png({ compressionLevel: 9 }).toFile(rasterOut)
        return
      }
      await resized
        .clone()
        .jpeg({ quality: 80, progressive: true, mozjpeg: true })
        .toFile(rasterOut)
    })
  )
}

async function runPool(items, worker, concurrency) {
  const queue = [...items]
  const workers = Array.from({ length: concurrency }, async () => {
    while (queue.length) {
      const item = queue.shift()
      if (!item) return
      await worker(item)
    }
  })
  await Promise.all(workers)
}

async function main() {
  const args = new Set(process.argv.slice(2))
  const clean = args.has('--clean')
  const force = args.has('--force')

  if (clean) {
    await fs.rm(outputDir, { recursive: true, force: true })
  }

  await fs.mkdir(outputDir, { recursive: true })
  await cleanupStaleOutputs()
  const entries = await fs.readdir(inputDir)
  await runPool(
    entries.map((file) => ({ file, force })),
    optimizeOne,
    4
  )
}

await main()
