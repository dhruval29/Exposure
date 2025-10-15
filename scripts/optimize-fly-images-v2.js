import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = path.join(__dirname, '..', 'public', 'assets', 'mobile', 'images', 'fly-images');

// Images that are already WebP - just optimize them
const webpToOptimize = [1, 4, 7, 8, 9, 10];

// JPG images to convert - already done in previous run, but keeping for reference
const jpgsConverted = [2, 3, 5, 6];

async function optimizeExistingWebP(number) {
  const filename = `${number}.webp`;
  const inputPath = path.join(sourceDir, filename);
  const outputPath = path.join(sourceDir, `${number}-optimized.webp`);
  
  console.log(`\nProcessing: ${filename}`);
  
  if (!fs.existsSync(inputPath)) {
    console.log(`  ⚠️  File not found`);
    return null;
  }
  
  const originalStats = fs.statSync(inputPath);
  const originalSize = (originalStats.size / 1024).toFixed(1);
  const metadata = await sharp(inputPath).metadata();
  
  console.log(`  Original: ${metadata.width}x${metadata.height}, ${originalSize} KB`);
  
  // Create optimized version
  await sharp(inputPath)
    .webp({ 
      quality: 82,
      effort: 6
    })
    .toFile(outputPath);
  
  const newStats = fs.statSync(outputPath);
  const newSize = (newStats.size / 1024).toFixed(1);
  const savings = ((originalStats.size - newStats.size) / 1024).toFixed(1);
  const savingsPercent = (((originalStats.size - newStats.size) / originalStats.size) * 100).toFixed(1);
  
  console.log(`  ✅ Created optimized: ${newSize} KB (saved ${savings} KB, ${savingsPercent}%)`);
  console.log(`  💡 Will replace ${filename} with ${number}-optimized.webp`);
  
  return {
    number,
    filename,
    originalSize: parseFloat(originalSize),
    newSize: parseFloat(newSize),
    savings: parseFloat(savings)
  };
}

async function main() {
  console.log('🖼️  Optimizing WebP fly images...\n');
  console.log('=' .repeat(60));
  
  const results = [];
  
  for (const num of webpToOptimize) {
    try {
      const result = await optimizeExistingWebP(num);
      if (result) results.push(result);
    } catch (error) {
      console.error(`  ❌ Error optimizing ${num}.webp:`, error.message);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ Optimization complete!\n');
  
  if (results.length > 0) {
    const totalOriginal = results.reduce((sum, r) => sum + r.originalSize, 0);
    const totalNew = results.reduce((sum, r) => sum + r.newSize, 0);
    const totalSavings = results.reduce((sum, r) => sum + r.savings, 0);
    
    console.log(`📊 Summary:`);
    console.log(`   Files processed: ${results.length}`);
    console.log(`   Total original size: ${totalOriginal.toFixed(1)} KB`);
    console.log(`   Total optimized size: ${totalNew.toFixed(1)} KB`);
    console.log(`   Total savings: ${totalSavings.toFixed(1)} KB`);
    
    console.log(`\n📝 Manual step needed:`);
    console.log(`   Delete the old files and rename the -optimized versions:`);
    results.forEach(r => {
      console.log(`   - Delete ${r.number}.webp, rename ${r.number}-optimized.webp to ${r.number}.webp`);
    });
  }
}

main().catch(console.error);

