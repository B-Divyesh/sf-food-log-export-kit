param(
  [Parameter(Mandatory = $true)][string]$InstallerPath,
  [Parameter(Mandatory = $true)][string]$ReleasePath,
  [Parameter(Mandatory = $true)][string]$IdentityPath,
  [Parameter(Mandatory = $true)][string]$AssetsPath,
  [Parameter(Mandatory = $true)][string]$LaunchLog
)

function Invoke-RestMethod {
  param([Parameter(Position = 0)][string]$Uri)
  if ($Uri -eq $env:FOOD_LOG_RELEASE_API_URL) { return (Get-Content -Raw $ReleasePath | ConvertFrom-Json) }
  if ($Uri -eq $env:FOOD_LOG_RELEASE_IDENTITY_URL) { return (Get-Content -Raw $IdentityPath | ConvertFrom-Json) }
  throw "Unexpected release URL: $Uri"
}

function Invoke-WebRequest {
  param(
    [Parameter(Position = 0)][string]$Uri,
    [string]$OutFile
  )
  $name = [System.Uri]::UnescapeDataString(($Uri -split '/')[-1])
  $source = Join-Path $AssetsPath $name
  if (!(Test-Path $source)) { throw "Unexpected download: $Uri" }
  if ($OutFile) {
    Copy-Item $source $OutFile
    return
  }
  [pscustomobject]@{ Content = Get-Content -Raw $source }
}

function Start-Process {
  param([Parameter(Mandatory = $true)][string]$FilePath)
  Set-Content -NoNewline -Path $LaunchLog -Value $FilePath
}

. $InstallerPath
