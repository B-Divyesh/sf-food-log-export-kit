$ErrorActionPreference = "Stop"
$repo = "B-Divyesh/sf-food-log-export-kit"
$release = Invoke-RestMethod "https://api.github.com/repos/$repo/releases/latest"
$asset = $release.assets | Where-Object { $_.name -match '_x64_en-US\.msi$' } | Select-Object -First 1
if (!$asset) { $asset = $release.assets | Where-Object { $_.name -match '_x64-setup\.exe$' } | Select-Object -First 1 }
$sums = $release.assets | Where-Object { $_.name -eq 'SHA256SUMS' } | Select-Object -First 1
if (!$asset -or !$sums) { throw "Desktop downloads are still being published." }
$installDir = if ($env:FOOD_LOG_INSTALL_DIR) { $env:FOOD_LOG_INSTALL_DIR } else { Join-Path $env:LOCALAPPDATA "Food Log Export Kit\Installer" }
New-Item -ItemType Directory -Force -Path $installDir | Out-Null
$target = Join-Path $installDir $asset.name
Invoke-WebRequest $asset.browser_download_url -OutFile $target
$sumText = (Invoke-WebRequest $sums.browser_download_url).Content
$expected = (($sumText -split "`n") | Where-Object { $_ -match [regex]::Escape($asset.name) } | Select-Object -First 1) -split '\s+' | Select-Object -First 1
$actual = (Get-FileHash $target -Algorithm SHA256).Hash.ToLower()
if ($expected.ToLower() -ne $actual) { throw "Checksum failed for $($asset.name)" }
Write-Output "Downloaded and verified $($asset.name)."
Write-Output "Starting the Windows installer from $target"
Start-Process -FilePath $target
