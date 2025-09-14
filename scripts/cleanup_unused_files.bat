@echo off
echo Starting cleanup of unused files...
echo.

REM Navigate to project directory
cd /d "C:\Users\dhruv\Pictures\Exposion-Exploders"

echo Deleting unused videos (saves ~160MB)...
del "public\videos\12374612-uhd_3840_2160_60fps.mp4" 2>nul
del "public\videos\12500680_1920_1080_24fps.mp4" 2>nul
del "public\videos\14094851_1920_1080_20fps.mp4" 2>nul
del "public\videos\1550080-uhd_3840_2160_30fps.mp4" 2>nul
del "public\videos\1580455-hd_1920_1080_30fps.mp4" 2>nul
del "public\videos\2231485-uhd_3840_2160_24fps.mp4" 2>nul

echo Deleting duplicate images in root public...
del "public\1221.png" 2>nul
del "public\66b90841dac09204196c2799eb092dfc82cb4d49.png" 2>nul
del "public\7f12ea1300756f144a0fb5daaf68dbfc01103a46.png" 2>nul
del "public\80cd277005dfbb076b97f3443adc9855fec1e19c.png" 2>nul
del "public\a4127d727720d4c092e45fefaf0b05c0c79fe2d4.png" 2>nul
del "public\e6598e5c25c54119d943da26c46ea508e5daf7cf.png" 2>nul
del "public\e7643725a3b70e0bc912211e0911b18522585aa2.png" 2>nul
del "public\fea9ef66f94ec76e2005159a55ddfbe0fc03f4b9.png" 2>nul

echo Deleting unused root files...
del "public\©.svg" 2>nul
del "public\Arrow 8.svg" 2>nul
del "public\arrrrow.svg" 2>nul
del "public\Building.png" 2>nul
del "public\cat.svg" 2>nul
del "public\dog.svg" 2>nul
del "public\forest.png" 2>nul
del "public\Rectangle 11.svg" 2>nul
del "public\snail.svg" 2>nul
del "public\sony9.glb" 2>nul
del "public\VIDEO.mp4" 2>nul
del "public\vite.svg" 2>nul

echo Deleting entire unused directories...
rmdir /s /q "public\pictures" 2>nul
rmdir /s /q "public\IMAGES" 2>nul

echo.
echo Cleanup completed!
echo.
echo Files deleted:
echo - 6 unused videos (~160MB saved)
echo - 8 duplicate images
echo - 12 unused root files
echo - 2 entire unused directories (pictures/ and IMAGES/)
echo.
echo Total estimated space saved: ~200+ MB
echo.
echo Ready to commit and push changes to GitHub...
echo.
pause
