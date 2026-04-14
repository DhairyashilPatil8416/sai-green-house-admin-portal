Add-Type -AssemblyName System.Drawing

function New-Canvas([int]$width, [int]$height, [string]$filePath, [scriptblock]$drawBlock) {
    $bitmap = New-Object System.Drawing.Bitmap($width, $height)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    & $drawBlock $graphics $bitmap
    $graphics.Dispose()
    $bitmap.Save($filePath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $bitmap.Dispose()
}

New-Canvas 420 260 'c:\Users\DhairyashilPatil\Documents\shope website\left.jpg' {
    param($g, $bmp)
    $g.Clear([System.Drawing.Color]::FromArgb(237, 247, 232))

    $baseBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(35, 116, 65))
    $topBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(75, 172, 98))
    $glassBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(170, 255, 255, 255))
    $linePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(90, 60, 120, 80), 3)
    $outlinePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(140, 25, 90, 45), 4)

    $g.FillEllipse($topBrush, 45, 50, 165, 120)
    $g.FillEllipse($baseBrush, 42, 58, 175, 128)
    $g.FillRectangle($glassBrush, 68, 75, 130, 90)
    $g.DrawArc($outlinePen, 68, 45, 130, 95, 180, 180)
    $g.DrawLine($linePen, 68, 112, 198, 112)
    $g.DrawLine($linePen, 85, 75, 85, 165)
    $g.DrawLine($linePen, 118, 75, 118, 165)
    $g.DrawLine($linePen, 151, 75, 151, 165)
    $g.DrawLine($linePen, 184, 75, 184, 165)

    $groundBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(67, 122, 52))
    $g.FillRectangle($groundBrush, 0, 185, 420, 75)
    $shineBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(70, 255, 255, 255))
    $g.FillEllipse($shineBrush, 205, 25, 110, 110)

    $font = New-Object System.Drawing.Font('Arial', 22, [System.Drawing.FontStyle]::Bold)
    $textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(20, 70, 35))
    $g.DrawString('Green House', $font, $textBrush, 220, 195)

    $baseBrush.Dispose()
    $topBrush.Dispose()
    $glassBrush.Dispose()
    $linePen.Dispose()
    $outlinePen.Dispose()
    $groundBrush.Dispose()
    $shineBrush.Dispose()
    $font.Dispose()
    $textBrush.Dispose()
}

New-Canvas 420 260 'c:\Users\DhairyashilPatil\Documents\shope website\right.jpg' {
    param($g, $bmp)
    $g.Clear([System.Drawing.Color]::FromArgb(250, 244, 230))

    $rollBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(245, 245, 245))
    $shadowBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(70, 0, 0, 0))
    $edgePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(180, 190, 190, 190), 3)
    $greenBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(45, 150, 80))
    $accentBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(220, 211, 155, 34))

    $g.FillEllipse($shadowBrush, 120, 35, 165, 165)
    $g.FillEllipse($rollBrush, 95, 30, 160, 160)
    $g.FillEllipse($edgePen.Brush, 120, 70, 85, 85)
    $g.FillEllipse([System.Drawing.Brushes]::White, 128, 78, 70, 70)
    $g.FillRectangle($greenBrush, 235, 95, 125, 68)
    $g.FillRectangle($greenBrush, 250, 80, 98, 26)
    $g.FillRectangle($accentBrush, 335, 110, 38, 28)
    $g.FillEllipse([System.Drawing.Brushes]::White, 315, 90, 30, 28)
    $g.FillEllipse([System.Drawing.Brushes]::LightGoldenrodYellow, 345, 98, 30, 20)

    $groundBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(74, 128, 61))
    $g.FillRectangle($groundBrush, 0, 190, 420, 70)

    $font = New-Object System.Drawing.Font('Arial', 20, [System.Drawing.FontStyle]::Bold)
    $textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(120, 85, 20))
    $g.DrawString('Paper Roll', $font, $textBrush, 20, 198)

    $rollBrush.Dispose()
    $shadowBrush.Dispose()
    $edgePen.Dispose()
    $greenBrush.Dispose()
    $accentBrush.Dispose()
    $groundBrush.Dispose()
    $font.Dispose()
    $textBrush.Dispose()
}

Write-Host 'Side images created.'
