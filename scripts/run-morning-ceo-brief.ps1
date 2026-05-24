param(
  [string]$RepoPath = "A:\noodlebomb-repo"
)

$resolvedRepo = Resolve-Path -LiteralPath $RepoPath
Set-Location -LiteralPath $resolvedRepo

$steps = @(
  @{ Name = "Revenue Watchdog"; Command = "npm run revenue:watch" },
  @{ Name = "Dead Product Detector"; Command = "npm run catalog:dead-products" },
  @{ Name = "Shelf Impact Analyzer"; Command = "npm run shelf:analyze" },
  @{ Name = "Retail Sell-Through Predictor"; Command = "npm run retail:predict" },
  @{ Name = "Mike Today Engine"; Command = "npm run ops:today" }
)

foreach ($step in $steps) {
  Write-Host "=== $($step.Name) ==="
  powershell.exe -NoProfile -ExecutionPolicy Bypass -Command $step.Command
  if ($LASTEXITCODE -ne 0) {
    Write-Warning "$($step.Name) exited with code $LASTEXITCODE"
  }
}

Write-Host "Morning CEO brief complete."
