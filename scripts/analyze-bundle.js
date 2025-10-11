#!/usr/bin/env node

/**
 * Bundle analysis script for performance optimization
 * Run with: node scripts/analyze-bundle.js
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🔍 Analyzing bundle size...\n');

try {
  // Build the project first
  console.log('📦 Building project...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Analyze bundle size
  console.log('\n📊 Bundle analysis:');
  
  const distPath = './dist';
  if (fs.existsSync(distPath)) {
    const files = fs.readdirSync(distPath, { recursive: true });
    
    let totalSize = 0;
    const fileSizes = [];
    
    files.forEach(file => {
      const filePath = path.join(distPath, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isFile()) {
        const size = stats.size;
        totalSize += size;
        fileSizes.push({
          name: file,
          size: size,
          sizeKB: (size / 1024).toFixed(2)
        });
      }
    });
    
    // Sort by size
    fileSizes.sort((a, b) => b.size - a.size);
    
    console.log(`\n📈 Total bundle size: ${(totalSize / 1024 / 1024).toFixed(2)} MB\n`);
    
    console.log('🏆 Largest files:');
    fileSizes.slice(0, 10).forEach((file, index) => {
      const icon = index < 3 ? '🔴' : index < 6 ? '🟡' : '🟢';
      console.log(`${icon} ${file.name}: ${file.sizeKB} KB`);
    });
    
    // Check for large images
    const largeImages = fileSizes.filter(file => 
      /\.(png|jpg|jpeg|webp|gif|svg)$/i.test(file.name) && file.size > 100 * 1024
    );
    
    if (largeImages.length > 0) {
      console.log('\n🖼️  Large images (>100KB):');
      largeImages.forEach(img => {
        console.log(`   ${img.name}: ${img.sizeKB} KB`);
      });
    }
    
    // Check for large JS files
    const largeJS = fileSizes.filter(file => 
      file.name.endsWith('.js') && file.size > 500 * 1024
    );
    
    if (largeJS.length > 0) {
      console.log('\n📜 Large JS files (>500KB):');
      largeJS.forEach(js => {
        console.log(`   ${js.name}: ${js.sizeKB} KB`);
      });
    }
    
    // Recommendations
    console.log('\n💡 Recommendations:');
    
    if (totalSize > 5 * 1024 * 1024) {
      console.log('   ⚠️  Bundle size is large (>5MB). Consider:');
      console.log('   - Further code splitting');
      console.log('   - Image optimization');
      console.log('   - Tree shaking unused code');
    }
    
    if (largeImages.length > 0) {
      console.log('   🖼️  Optimize large images:');
      console.log('   - Convert to WebP format');
      console.log('   - Use responsive images');
      console.log('   - Implement lazy loading');
    }
    
    if (largeJS.length > 0) {
      console.log('   📜 Optimize large JS files:');
      console.log('   - Split into smaller chunks');
      console.log('   - Remove unused dependencies');
      console.log('   - Use dynamic imports');
    }
    
  } else {
    console.log('❌ Dist folder not found. Run "npm run build" first.');
  }
  
} catch (error) {
  console.error('❌ Analysis failed:', error.message);
  process.exit(1);
}
