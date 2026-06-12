param(
  [string]$RepoPath = "A:\noodlebomb-repo",
  [string]$TaskName = "NoodleBomb-Mike-Today-CEO-Brief",
  [string]$Time = "07:20"
)

$resolvedRepo = Resolve-Path -LiteralPath $RepoPath
$scriptPath = Join-Path $resolvedRepo "scripts\run-morning-ceo-brief.ps1"
$action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$scriptPath`" -RepoPath `"$resolvedRepo`""
$trigger = New-ScheduledTaskTrigger -Daily -At $Time
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -DontStopIfGoingOnBatteries -ExecutionTimeLimit (New-TimeSpan -Minutes 20)

Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger $trigger -Settings $settings -Description "Runs NoodleBomb morning watchdogs and writes Mike's top 5 CEO actions." -Force | Out-Null
Write-Host "Registered $TaskName for daily $Time from $resolvedRepo"
