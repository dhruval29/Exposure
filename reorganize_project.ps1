# Professional Project Reorganization Script
Write-Host "Starting project reorganization..." -ForegroundColor Green
Write-Host ""

# Navigate to project directory
Set-Location "C:\Users\dhruv\Pictures\Exposion-Exploders"

Write-Host "Creating clean directory structure..." -ForegroundColor Yellow

# Create clean public structure
$publicDirs = @(
    "public\assets\images\backgrounds",
    "public\assets\images\gallery", 
    "public\assets\images\photos",
    "public\assets\images\ui",
    "public\assets\icons",
    "public\assets\videos",
    "public\assets\models",
    "public\assets\fonts",
    "public\assets\animations"
)

foreach ($dir in $publicDirs) {
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "  Created: $dir" -ForegroundColor Cyan
    }
}

Write-Host ""
Write-Host "Moving and organizing assets..." -ForegroundColor Yellow

# Move background images
$backgrounds = @(
    "public\New folder\images\backgrounds\1221.png",
    "public\New folder\images\backgrounds\Building.png", 
    "public\New folder\images\backgrounds\forest.png"
)

foreach ($file in $backgrounds) {
    if (Test-Path $file) {
        $filename = Split-Path $file -Leaf
        Move-Item $file "public\assets\images\backgrounds\$filename" -Force
        Write-Host "  Moved: $filename to backgrounds/" -ForegroundColor Green
    }
}

# Move gallery images
$galleryImages = @(
    "public\New folder\images\gallery\66b90841dac09204196c2799eb092dfc82cb4d49.png",
    "public\New folder\images\gallery\7f12ea1300756f144a0fb5daaf68dbfc01103a46.png",
    "public\New folder\images\gallery\80cd277005dfbb076b97f3443adc9855fec1e19c.png",
    "public\New folder\images\gallery\a4127d727720d4c092e45fefaf0b05c0c79fe2d4.png",
    "public\New folder\images\gallery\e6598e5c25c54119d943da26c46ea508e5daf7cf.png",
    "public\New folder\images\gallery\e7643725a3b70e0bc912211e0911b18522585aa2.png",
    "public\New folder\images\gallery\f5e2cfa883ff3d24c1567c79d5a6e57231b2ef45.png",
    "public\New folder\images\gallery\fea9ef66f94ec76e2005159a55ddfbe0fc03f4b9.png"
)

foreach ($file in $galleryImages) {
    if (Test-Path $file) {
        $filename = Split-Path $file -Leaf
        Move-Item $file "public\assets\images\gallery\$filename" -Force
        Write-Host "  Moved: $filename to gallery/" -ForegroundColor Green
    }
}

# Move sliding content images
if (Test-Path "public\New folder\images\sliding content") {
    Get-ChildItem "public\New folder\images\sliding content" | ForEach-Object {
        Move-Item $_.FullName "public\assets\images\ui\" -Force
        Write-Host "  Moved: $($_.Name) to ui/" -ForegroundColor Green
    }
}

# Move zoom reveal image
if (Test-Path "public\New folder\images\zoom reveal.webp") {
    Move-Item "public\New folder\images\zoom reveal.webp" "public\assets\images\ui\zoom-reveal.webp" -Force
    Write-Host "  Moved: zoom reveal.webp to ui/zoom-reveal.webp" -ForegroundColor Green
}

# Move icons
if (Test-Path "public\New folder\icons") {
    Get-ChildItem "public\New folder\icons" | ForEach-Object {
        Move-Item $_.FullName "public\assets\icons\" -Force
        Write-Host "  Moved: $($_.Name) to icons/" -ForegroundColor Green
    }
}

# Move videos
if (Test-Path "public\New folder\videos") {
    Get-ChildItem "public\New folder\videos" | ForEach-Object {
        Move-Item $_.FullName "public\assets\videos\" -Force
        Write-Host "  Moved: $($_.Name) to videos/" -ForegroundColor Green
    }
}

# Move models
if (Test-Path "public\New folder\models") {
    Get-ChildItem "public\New folder\models" | ForEach-Object {
        Move-Item $_.FullName "public\assets\models\" -Force
        Write-Host "  Moved: $($_.Name) to models/" -ForegroundColor Green
    }
}

# Move fonts
if (Test-Path "public\fonts") {
    Get-ChildItem "public\fonts" | ForEach-Object {
        Move-Item $_.FullName "public\assets\fonts\" -Force
        Write-Host "  Moved: $($_.Name) to fonts/" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "Cleaning up root directory..." -ForegroundColor Yellow

# Remove scattered files from root
$rootFiles = @(
    "0b12245b8b6a19630f4e749b5b877bb74312fe11.svg",
    "6b61e12a70862f8fc8c06f2e8b17c4c4084cd4cf.svg", 
    "762ac57a4ac9284f310e39b16960df6a0b0fd4c5.svg",
    "7f12ea1300756f144a0fb5daaf68dbfc01103a46.png",
    "82afd242e69d3b904251725d9964fe7d9c79707e.svg",
    "851b09cec4f1102c4214240df8f5afc4f3e209ad.svg",
    "956c3b1f01376664ae35bf291d86dc40eb569929.svg",
    "a4d5f6b2467a0d0b37368cb895e85cda5ca45f51.svg",
    "b4c9c741d7be2b748edc4d7676866bf531b33d44.svg",
    "Building.png",
    "card (1).glb",
    "da7c0490fd6c59ba6d0382723a42266fbc212c36.svg",
    "e1950cf3ee61d929ce1c4192b1c79409dff067dc.svg"
)

foreach ($file in $rootFiles) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "  Removed: $file" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Removing old directories..." -ForegroundColor Yellow

# Remove old directories
$oldDirs = @("public\New folder", "W", "gallery", "dist")

foreach ($dir in $oldDirs) {
    if (Test-Path $dir) {
        Remove-Item $dir -Recurse -Force
        Write-Host "  Removed directory: $dir" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Reorganization completed!" -ForegroundColor Green
Write-Host "New structure created:" -ForegroundColor Cyan
Write-Host "  public/assets/images/backgrounds/" -ForegroundColor White
Write-Host "  public/assets/images/gallery/" -ForegroundColor White  
Write-Host "  public/assets/images/photos/" -ForegroundColor White
Write-Host "  public/assets/images/ui/" -ForegroundColor White
Write-Host "  public/assets/icons/" -ForegroundColor White
Write-Host "  public/assets/videos/" -ForegroundColor White
Write-Host "  public/assets/models/" -ForegroundColor White
Write-Host "  public/assets/fonts/" -ForegroundColor White
Write-Host ""
Write-Host "Next step: Update import paths in components" -ForegroundColor Yellow
Write-Host ""
Read-Host "Press Enter to continue"
