param(
  [string]$RepoPath = "A:\noodlebomb-repo",
  [string]$TaskName = "NoodleBomb-Revenue-Watchdog",
  [string]$Time = "07:10"
)

$resolvedRepo = Resolve-Path -LiteralPath $RepoPath
$actionCommand = "Set-Location -LiteralPath '$resolvedRepo'; npm run revenue:watch"
$action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-NoProfile -ExecutionPolicy Bypass -Command `"$actionCommand`""
$trigger = New-ScheduledTaskTrigger -Daily -At $Time
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -DontStopIfGoingOnBatteries -ExecutionTimeLimit (New-TimeSpan -Minutes 10)

Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger $trigger -Settings $settings -Description "Runs the NoodleBomb autonomous revenue watchdog every morning." -Force | Out-Null
Write-Host "Registered $TaskName for daily $Time from $resolvedRepo"
