import { existsSync, readdirSync, readFileSync, statSync, unlinkSync, writeFileSync } from 'node:fs'
import { join, parse, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const distDir = join(__dirname, '../.vitepress/dist')

const supportedExtensions = ['.png', '.jpg', '.jpeg', '.gif']

// 排除的文件（保留原格式，如 favicon）
const excludeFiles = ['app_icon.png']

// 存储转换映射 { 原文件名: 新文件名 }
const convertedFiles = new Map()

/**
 * 递归获取目录下所有支持的图片文件
 */
function getImageFiles(dir, files = []) {
  if (!existsSync(dir)) {
    console.log(`目录不存在: ${dir}`)
    return files
  }

  const items = readdirSync(dir)
  for (const item of items) {
    const fullPath = join(dir, item)
    const stat = statSync(fullPath)
    if (stat.isDirectory()) {
      getImageFiles(fullPath, files)
    } else {
      const ext = parse(item).ext.toLowerCase()
      if (supportedExtensions.includes(ext) && !excludeFiles.includes(item)) {
        files.push(fullPath)
      }
    }
  }
  return files
}

/**
 * 递归获取所有 HTML 文件
 */
function getHtmlFiles(dir, files = []) {
  if (!existsSync(dir)) return files

  const items = readdirSync(dir)
  for (const item of items) {
    const fullPath = join(dir, item)
    const stat = statSync(fullPath)
    if (stat.isDirectory()) {
      getHtmlFiles(fullPath, files)
    } else if (item.endsWith('.html')) {
      files.push(fullPath)
    }
  }
  return files
}

/**
 * 转换单个图片为 WebP
 */
async function convertToWebp(inputPath) {
  const parsed = parse(inputPath)
  const outputPath = join(parsed.dir, `${parsed.name}.webp`)

  try {
    await sharp(inputPath)
      .webp({ quality: 80 })
      .toFile(outputPath)

    // 删除原文件
    unlinkSync(inputPath)

    const relativePath = relative(distDir, inputPath)
    console.log(`✓ ${relativePath} -> ${parsed.name}.webp`)

    // 记录转换映射
    convertedFiles.set(parsed.base, `${parsed.name}.webp`)
    return true
  } catch (error) {
    console.error(`✗ 转换失败: ${inputPath}`, error.message)
    return false
  }
}

/**
 * 更新 HTML 文件中的图片引用
 */
function updateHtmlReferences(htmlFile) {
  let content = readFileSync(htmlFile, 'utf-8')
  let modified = false

  for (const [original, webp] of convertedFiles) {
    // 匹配 src="/xxx.png" 或 src="/xxx.png" 等模式
    const patterns = [
      new RegExp(`src="([^"]*${original.replace('.', '\\.')})"`, 'g'),
      new RegExp(`src='([^']*${original.replace('.', '\\.')})'`, 'g'),
      new RegExp(`href="([^"]*${original.replace('.', '\\.')})"`, 'g'),
      new RegExp(`href='([^']*${original.replace('.', '\\.')})'`, 'g'),
    ]

    for (const pattern of patterns) {
      const newContent = content.replace(pattern, (match, path) => {
        modified = true
        return match.replace(original, webp)
      })
      if (newContent !== content) {
        content = newContent
      }
    }
  }

  if (modified) {
    writeFileSync(htmlFile, content)
    console.log(`📝 更新引用: ${relative(distDir, htmlFile)}`)
  }
}

async function main() {
  console.log('\n🖼️  开始转换图片为 WebP 格式...\n')

  const images = getImageFiles(distDir)

  if (images.length === 0) {
    console.log('没有找到需要转换的图片')
    return
  }

  console.log(`找到 ${images.length} 张图片待转换\n`)

  // 转换图片
  let successCount = 0
  for (const image of images) {
    const success = await convertToWebp(image)
    if (success) successCount++
  }

  // 更新 HTML 引用
  if (convertedFiles.size > 0) {
    console.log('\n📝 更新 HTML 文件中的图片引用...\n')
    const htmlFiles = getHtmlFiles(distDir)
    for (const htmlFile of htmlFiles) {
      updateHtmlReferences(htmlFile)
    }
  }

  console.log(`\n✅ 完成! 成功转换 ${successCount}/${images.length} 张图片\n`)
}

main().catch(console.error)