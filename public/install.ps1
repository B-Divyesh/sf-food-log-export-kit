$ErrorActionPreference = "Stop"
$repo = "B-Divyesh/sf-food-log-export-kit"
$release = Invoke-RestMethod "https://api.github.com/repos/$repo/releases/latest"
$asset = $release.assets | Where-Object { $_.name -match '\.(msi|exe)$' } | Select-Object -First 1
$sums = $release.assets | Where-Object { $_.name -eq 'SHA256SUMS' } | Select-Object -First 1
if (!$asset -or !$sums) { throw "Desktop downloads are still being published." }
$target = Join-Path (Get-Location) $asset.name
Invoke-WebRequest $asset.browser_download_url -OutFile $target
$sumText = (Invoke-WebRequest $sums.browser_download_url).Content
$expected = (($sumText -split "`n") | Where-Object { $_ -match [regex]::Escape($asset.name) } | Select-Object -First 1) -split '\s+' | Select-Object -First 1
$actual = (Get-FileHash $target -Algorithm SHA256).Hash.ToLower()
if ($expected.ToLower() -ne $actual) { throw "Checksum failed for $($asset.name)" }
Write-Output "Downloaded and verified $($asset.name) in $(Get-Location). Open it to install Food Log Export Kit."
