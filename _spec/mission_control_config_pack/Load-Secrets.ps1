# Load-Secrets.ps1 — the ONLY credential path for Mission Control PowerShell.
# Spec: Mission_Control_Morning_Brief_Spec_v2, section 5.2.
#
#   . "$PSScriptRoot\Load-Secrets.ps1"        (config pack ships it next to the
#                                              configs; the scaffold moves it to
#                                              scripts\ — adjust the dot-source)
#   $secrets = Get-MCSecrets
#   $token   = Get-MCSecret -Secrets $secrets -Path "shopify.gt40.admin_api_token"
#
# Secret VALUES must never reach the log, console, or an error message.

Set-StrictMode -Version Latest

$script:MCRoot       = "C:\Users\12534\NOODLEBOMB_ARCHIVE\mission_control"
$script:SecretsPath  = Join-Path $script:MCRoot "config\secrets.json"
$script:TemplatePath = Join-Path $script:MCRoot "config\secrets.template.json"
$script:SourcesPath  = Join-Path $script:MCRoot "config\sources.json"

function Get-MCLeafPaths {
    # Dotted paths of every non-underscore leaf under a parsed JSON object.
    param([Parameter(Mandatory)] $Node, [string] $Prefix = "")
    $paths = @()
    foreach ($prop in $Node.PSObject.Properties) {
        if ($prop.Name.StartsWith("_")) { continue }   # _readme / _note keys
        $dotted = if ($Prefix) { "$Prefix.$($prop.Name)" } else { $prop.Name }
        if ($prop.Value -is [System.Management.Automation.PSCustomObject]) {
            $paths += Get-MCLeafPaths -Node $prop.Value -Prefix $dotted
        } else {
            $paths += $dotted
        }
    }
    return $paths
}

function Get-MCSecret {
    param(
        [Parameter(Mandatory)] $Secrets,
        [Parameter(Mandatory)] [string] $Path
    )
    $node = $Secrets
    foreach ($part in $Path.Split(".")) {
        $prop = $node.PSObject.Properties[$part]
        if ($null -eq $prop) { throw "Secret path not found: $Path" }
        $node = $prop.Value
    }
    return $node
}

function Get-MCSecrets {
    [CmdletBinding()]
    param()

    if (-not (Test-Path $script:SecretsPath)) {
        throw "secrets.json not found at $script:SecretsPath — copy secrets.template.json, fill it, and lock it with icacls (spec 5.3)."
    }

    try {
        $secrets = Get-Content $script:SecretsPath -Raw | ConvertFrom-Json
    } catch {
        throw "secrets.json is not valid JSON: $($_.Exception.Message)"
    }
    try {
        $template = Get-Content $script:TemplatePath -Raw | ConvertFrom-Json
    } catch {
        throw "secrets.template.json missing or invalid at $script:TemplatePath — the validator needs it."
    }

    # Sources that are disabled in sources.json are exempt from the filled-value
    # check (their keys must still exist).
    $disabledPrefixes = @()
    if (Test-Path $script:SourcesPath) {
        $sources = Get-Content $script:SourcesPath -Raw | ConvertFrom-Json
        foreach ($prop in $sources.sources.PSObject.Properties) {
            if (-not $prop.Value.enabled) {
                # source ids map to secret roots: shopify_gt40 -> shopify.gt40, amazon_sp_api -> amazon_sp_api
                $disabledPrefixes += ($prop.Name -replace "^shopify_", "shopify.")
            }
        }
    }

    $missing = @(); $unfilled = @()
    foreach ($path in Get-MCLeafPaths -Node $template) {
        try { $value = Get-MCSecret -Secrets $secrets -Path $path }
        catch { $missing += $path; continue }

        $exempt = $false
        foreach ($prefix in $disabledPrefixes) {
            if ($path.StartsWith($prefix)) { $exempt = $true; break }
        }
        if (-not $exempt -and ($null -eq $value -or "$value" -eq "" -or "$value" -like "*REPLACE_ME*")) {
            $unfilled += $path
        }
    }

    if ($missing.Count -gt 0 -or $unfilled.Count -gt 0) {
        $parts = @()
        if ($missing.Count  -gt 0) { $parts += "missing keys: $($missing -join ', ')" }
        if ($unfilled.Count -gt 0) { $parts += "unfilled values: $($unfilled -join ', ')" }
        # Key names only — never values.
        throw "secrets.json failed validation — $($parts -join '; ')"
    }

    return $secrets
}
