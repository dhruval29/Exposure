# PowerShell cleanup script for unused files
Write-Host "Starting cleanup of unused files..." -ForegroundColor Green
Write-Host ""

# Navigate to project directory
Set-Location "C:\Users\dhruv\Pictures\Exposion-Exploders"

$deletedFiles = 0
$savedSpace = 0

Write-Host "Deleting unused videos (saves ~160MB)..." -ForegroundColor Yellow
$videoFiles = @(
    "public\videos\12374612-uhd_3840_2160_60fps.mp4",
    "public\videos\12500680_1920_1080_24fps.mp4",
    "public\videos\14094851_1920_1080_20fps.mp4",
    "public\videos\1550080-uhd_3840_2160_30fps.mp4",
    "public\videos\1580455-hd_1920_1080_30fps.mp4",
    "public\videos\2231485-uhd_3840_2160_24fps.mp4"
)

foreach ($file in $videoFiles) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        $deletedFiles++
        Write-Host "  Deleted: $file" -ForegroundColor Red
    }
}

Write-Host "Deleting duplicate images in root public..." -ForegroundColor Yellow
$duplicateImages = @(
    "public\1221.png",
    "public\66b90841dac09204196c2799eb092dfc82cb4d49.png",
    "public\7f12ea1300756f144a0fb5daaf68dbfc01103a46.png",
    "public\80cd277005dfbb076b97f3443adc9855fec1e19c.png",
    "public\a4127d727720d4c092e45fefaf0b05c0c79fe2d4.png",
    "public\e6598e5c25c54119d943da26c46ea508e5daf7cf.png",
    "public\e7643725a3b70e0bc912211e0911b18522585aa2.png",
    "public\fea9ef66f94ec76e2005159a55ddfbe0fc03f4b9.png"
)

foreach ($file in $duplicateImages) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        $deletedFiles++
        Write-Host "  Deleted: $file" -ForegroundColor Red
    }
}

Write-Host "Deleting unused root files..." -ForegroundColor Yellow
$unusedFiles = @(
    "public\©.svg",
    "public\Arrow 8.svg",
    "public\arrrrow.svg",
    "public\Building.png",
    "public\cat.svg",
    "public\dog.svg",
    "public\forest.png",
    "public\Rectangle 11.svg",
    "public\snail.svg",
    "public\sony9.glb",
    "public\VIDEO.mp4",
    "public\vite.svg"
)

foreach ($file in $unusedFiles) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        $deletedFiles++
        Write-Host "  Deleted: $file" -ForegroundColor Red
    }
}

Write-Host "Deleting entire unused directories..." -ForegroundColor Yellow
$unusedDirs = @("public\pictures", "public\IMAGES")

foreach ($dir in $unusedDirs) {
    if (Test-Path $dir) {
        Remove-Item $dir -Recurse -Force
        Write-Host "  Deleted directory: $dir" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Cleanup completed!" -ForegroundColor Green
Write-Host "Files deleted: $deletedFiles" -ForegroundColor Cyan
Write-Host "Total estimated space saved: ~200+ MB" -ForegroundColor Cyan
Write-Host ""
Write-Host "Ready to commit and push changes to GitHub..." -ForegroundColor Green
Write-Host ""
Write-Host "Run these commands to push changes:" -ForegroundColor Yellow
Write-Host "git add ." -ForegroundColor White
Write-Host "git commit -m 'Remove unused files to reduce repository size'" -ForegroundColor White
Write-Host "git push" -ForegroundColor White
Write-Host ""
Read-Host "Press Enter to continue"
