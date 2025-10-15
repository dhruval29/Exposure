import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Images to convert from Desktop Merged Frame
const imagesToConvert = [
  'DSC_8925 (1).jpg',
  'IMG_20241227_151324.jpg',
  'DSC_6125 (1) (1).jpg',
  'Gemini_Generated_Image_j9982tj9982tj998.jpg',
  'RUDR (2).jpg'
];

const sourceDir = path.join(__dirname, '..', 'public', 'assets', 'images', 'Sliding Page', 'Desktop Merged Frame');
const outputDir = sourceDir; // Output to same directory

// Responsive sizes for different viewports
const sizes = [
  { suffix: '', width: null, quality: 85 },        // Original size, WebP
  { suffix: '-md', width: 1200, quality: 85 },     // Medium devices
  { suffix: '-sm', width: 800, quality: 85 }       // Small devices/mobile
];

async function convertImage(filename) {
  const inputPath = path.join(sourceDir, filename);
  const baseName = path.parse(filename).name;
  
  console.log(`\nProcessing: ${filename}`);
  
  if (!fs.existsSync(inputPath)) {
    console.log(`  ⚠️  File not found: ${inputPath}`);
    return;
  }
  
  const metadata = await sharp(inputPath).metadata();
  console.log(`  Original: ${metadata.width}x${metadata.height}, ${(metadata.size / 1024).toFixed(1)} KB`);
  
  for (const size of sizes) {
    const outputFilename = `${baseName}${size.suffix}.webp`;
    const outputPath = path.join(outputDir, outputFilename);
    
    let sharpInstance = sharp(inputPath);
    
    if (size.width) {
      sharpInstance = sharpInstance.resize(size.width, null, {
        withoutEnlargement: true,
        fit: 'inside'
      });
    }
    
    await sharpInstance
      .webp({ quality: size.quality })
      .toFile(outputPath);
    
    const stats = fs.statSync(outputPath);
    const sizeKB = (stats.size / 1024).toFixed(1);
    const suffix = size.suffix || '-original';
    console.log(`  ✅ Created ${suffix}: ${sizeKB} KB`);
  }
}

async function main() {
  console.log('🖼️  Converting Desktop Merged Frame images to WebP...\n');
  console.log('=' .repeat(60));
  
  for (const image of imagesToConvert) {
    try {
      await convertImage(image);
    } catch (error) {
      console.error(`  ❌ Error converting ${image}:`, error.message);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ Image optimization complete!');
  console.log('\n💡 Note: Original JPG files are kept. Update your code to use .webp versions.');
}

main().catch(console.error);

