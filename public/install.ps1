$ErrorActionPreference = "Stop"
$repo = "B-Divyesh/sf-food-log-export-kit"
$expectedSourceCommit = "6f4bb7f207528aa36ed7e1a2e8f13ace474f4066"
$api = if ($env:FOOD_LOG_RELEASE_API_URL) { $env:FOOD_LOG_RELEASE_API_URL } else { "https://api.github.com/repos/$repo/releases/latest" }
$release = Invoke-RestMethod $api
if ($release.target_commitish -ne $expectedSourceCommit) { throw "The published download does not match this app version." }
$asset = $release.assets | Where-Object { $_.name -match '_x64_en-US\.msi$' } | Select-Object -First 1
if (!$asset) { $asset = $release.assets | Where-Object { $_.name -match '_x64-setup\.exe$' } | Select-Object -First 1 }
$sums = $release.assets | Where-Object { $_.name -eq 'SHA256SUMS' } | Select-Object -First 1
if (!$asset -or !$sums) { throw "Desktop downloads are still being published." }
$installDir = if ($env:FOOD_LOG_INSTALL_DIR) { $env:FOOD_LOG_INSTALL_DIR } else { Join-Path $env:LOCALAPPDATA "Food Log Export Kit\Installer" }
New-Item -ItemType Directory -Force -Path $installDir | Out-Null
$target = Join-Path $installDir $asset.name
$workDir = Join-Path ([System.IO.Path]::GetTempPath()) ("food-log-export-kit-" + [guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Force -Path $workDir | Out-Null
$download = Join-Path $workDir $asset.name

try {
  Invoke-WebRequest $asset.browser_download_url -OutFile $download
  $sumText = (Invoke-WebRequest $sums.browser_download_url).Content
  $expected = ($sumText -split "`r?`n" | ForEach-Object {
    if ($_ -match '^(?<hash>[0-9a-fA-F]{64})\s+\*?(?<name>.+?)\s*$' -and $Matches.name -eq $asset.name) {
      $Matches.hash.ToLower()
    }
  } | Select-Object -First 1)
  if (!$expected) { throw "SHA256SUMS has no entry for $($asset.name)." }
  $actual = (Get-FileHash $download -Algorithm SHA256).Hash.ToLower()
  if ($expected -ne $actual) { throw "Checksum failed for $($asset.name)" }
  Move-Item -Force $download $target
  Write-Output "Downloaded and verified $($asset.name)."
  Write-Output "Starting the Windows installer from $target"
  Start-Process -FilePath $target
} finally {
  Remove-Item -Recurse -Force $workDir -ErrorAction SilentlyContinue
}
