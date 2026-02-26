import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const inputDir = path.resolve(process.cwd(), 'public/images')
const outputDir = path.resolve(process.cwd(), 'public/images/optimized')

const widths = [96, 128, 160, 256, 320, 384, 480, 512, 640, 768, 960, 1024, 1280, 1600, 1920, 2560]

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

async function optimizeOne(file) {
  const { name, ext } = getBaseName(file)
  if (!['jpg', 'jpeg', 'png'].includes(ext)) return
  if (file.startsWith('optimized/')) return

  const inputPath = path.join(inputDir, file)
  const outExt = ext === 'jpeg' ? 'jpg' : ext

  const outputPaths = widths.flatMap((w) => [
    path.join(outputDir, `${name}-${w}.webp`),
    path.join(outputDir, `${name}-${w}.${outExt}`),
  ])

  const skip = await shouldSkip(inputPath, outputPaths)
  if (skip) return

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
  await fs.mkdir(outputDir, { recursive: true })
  const entries = await fs.readdir(inputDir)
  await runPool(entries, optimizeOne, 4)
}

await main()

