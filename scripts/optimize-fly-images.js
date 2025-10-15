import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = path.join(__dirname, '..', 'public', 'assets', 'mobile', 'images', 'fly-images');

// All images from the Fly component
const imagesToOptimize = [
  '1.webp',
  '2.jpg',
  '3.jpg',
  '4.webp',
  '5.jpg',
  '6.jpg',
  '7.webp',
  '8.webp',
  '9.webp',
  '10.webp'
];

async function optimizeImage(filename) {
  const inputPath = path.join(sourceDir, filename);
  const baseName = path.parse(filename).name;
  const ext = path.parse(filename).ext;
  
  console.log(`\nProcessing: ${filename}`);
  
  if (!fs.existsSync(inputPath)) {
    console.log(`  ⚠️  File not found: ${inputPath}`);
    return;
  }
  
  const originalStats = fs.statSync(inputPath);
  const originalSize = (originalStats.size / 1024).toFixed(1);
  const metadata = await sharp(inputPath).metadata();
  
  console.log(`  Original: ${metadata.width}x${metadata.height}, ${originalSize} KB`);
  
  // Create optimized WebP version
  const outputFilename = `${baseName}.webp`;
  const outputPath = path.join(sourceDir, outputFilename);
  
  // Use temp file if input is already WebP (to avoid same input/output)
  const tempPath = path.join(sourceDir, `${baseName}_temp.webp`);
  const finalPath = ext === '.webp' ? tempPath : outputPath;
  
  // Optimize with high quality WebP
  // For fly images on mobile, we want good quality at smaller file size
  await sharp(inputPath)
    .webp({ 
      quality: 82,  // Good balance between quality and size
      effort: 6     // Higher effort for better compression
    })
    .toFile(finalPath);
  
  // If we used a temp file, replace the original
  if (ext === '.webp') {
    // On Windows, use copyFile + unlinkSync to avoid file locking issues
    fs.copyFileSync(tempPath, outputPath);
    try {
      fs.unlinkSync(tempPath);
    } catch (e) {
      // Ignore if temp file can't be deleted immediately
    }
  }
  
  const newStats = fs.statSync(outputPath);
  const newSize = (newStats.size / 1024).toFixed(1);
  const savings = ((originalStats.size - newStats.size) / 1024).toFixed(1);
  const savingsPercent = (((originalStats.size - newStats.size) / originalStats.size) * 100).toFixed(1);
  
  console.log(`  ✅ Optimized: ${newSize} KB (saved ${savings} KB, ${savingsPercent}%)`);
  
  return {
    filename,
    originalSize: parseFloat(originalSize),
    newSize: parseFloat(newSize),
    savings: parseFloat(savings)
  };
}

async function main() {
  console.log('🖼️  Optimizing Fly component images...\n');
  console.log('=' .repeat(60));
  
  const results = [];
  
  for (const image of imagesToOptimize) {
    try {
      const result = await optimizeImage(image);
      if (result) results.push(result);
    } catch (error) {
      console.error(`  ❌ Error optimizing ${image}:`, error.message);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ Fly images optimization complete!\n');
  
  const totalOriginal = results.reduce((sum, r) => sum + r.originalSize, 0);
  const totalNew = results.reduce((sum, r) => sum + r.newSize, 0);
  const totalSavings = results.reduce((sum, r) => sum + r.savings, 0);
  
  console.log(`📊 Summary:`);
  console.log(`   Total original size: ${totalOriginal.toFixed(1)} KB`);
  console.log(`   Total optimized size: ${totalNew.toFixed(1)} KB`);
  console.log(`   Total savings: ${totalSavings.toFixed(1)} KB (${((totalSavings / totalOriginal) * 100).toFixed(1)}%)`);
}

main().catch(console.error);

