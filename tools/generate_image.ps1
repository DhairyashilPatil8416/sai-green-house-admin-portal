Add-Type -AssemblyName System.Drawing

# Create bitmap
$bitmap = New-Object System.Drawing.Bitmap(1920, 400)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)

# Fill with green gradient
$brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(47, 154, 88))
$graphics.FillRectangle($brush, 0, 0, 1920, 400)

# Add some lighter overlay circles for texture
$lightBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(150, 255, 255, 255))
for ($i = 0; $i -lt 30; $i++) {
    $x = Get-Random -Minimum 0 -Maximum 1920
    $y = Get-Random -Minimum 0 -Maximum 400
    $size = Get-Random -Minimum 40 -Maximum 150
    $graphics.FillEllipse($lightBrush, $x - $size/2, $y - $size/2, $size, $size)
}

$graphics.Dispose()

# Save with blur-like effect (save as JPEG)
$bitmap.Save('c:\Users\DhairyashilPatil\Documents\shope website\photo.jpg')
$bitmap.Dispose()

Write-Host "photo.jpg बनले! (1920x400px Green Blurred Background)"
