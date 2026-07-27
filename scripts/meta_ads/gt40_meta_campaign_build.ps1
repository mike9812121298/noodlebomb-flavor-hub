<#
.SYNOPSIS
  NoodleBomb Meta (Facebook/Instagram) Ads build script - PowerShell port
  of nb_meta_ads_build.py.

.DESCRIPTION
  Creates a conversion-focused Meta ad campaign for the NoodleBomb ramen
  sauces using the Meta Marketing (Graph) API. One campaign, one ad set
  plus one link ad per product. Creatives reuse the studio product photos
  already committed under uploads/.

  SAFETY: everything is created with status PAUSED - campaign, ad sets,
  and ads. Nothing spends money or goes live until you activate it by
  hand in Meta Ads Manager. This script never sets anything ACTIVE.

.PARAMETER DryRun
  Print the plan and validate inputs. Makes no API calls.

.PARAMETER Execute
  Create the campaign, ad sets, and ads in Meta (all PAUSED).

.PARAMETER Budget
  Daily budget in USD per ad set. Default 20.

.PARAMETER Yes
  Skip the confirmation prompt for -Execute.

.EXAMPLE
  .\gt40_meta_campaign_build.ps1 -DryRun
  .\gt40_meta_campaign_build.ps1 -Execute
  .\gt40_meta_campaign_build.ps1 -Execute -Yes -Budget 35

.NOTES
  Environment variables (required for -Execute):
    META_ACCESS_TOKEN   Long-lived / system-user token with ads_management.
    META_AD_ACCOUNT_ID  Ad account id, e.g. act_1234567890 (act_ optional).
    META_PAGE_ID        Facebook Page id the ads are published from.
    META_PIXEL_ID       (optional) Meta Pixel id. If set, the campaign
                        optimizes for purchases (OUTCOME_SALES); if absent
                        it falls back to link-click traffic.
    META_API_VERSION    (optional) Graph API version, default v21.0.
#>
#Requires -Version 5.1
[CmdletBinding()]
param(
    [switch]$DryRun,
    [switch]$Execute,
    [double]$Budget = 20.0,
    [switch]$Yes
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if ($DryRun -eq $Execute) {
    Write-Error 'Specify exactly one of -DryRun or -Execute.'
    exit 2
}
if ($Budget -le 0) {
    Write-Error '-Budget must be greater than 0.'
    exit 2
}

# --------------------------------------------------------------------------
# Config
# --------------------------------------------------------------------------
$ApiVersion = if ($env:META_API_VERSION) { $env:META_API_VERSION } else { 'v21.0' }
$Graph = "https://graph.facebook.com/$ApiVersion"

$RepoRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$Uploads = Join-Path $RepoRoot 'uploads'
$Site = 'https://noodlebomb.co'

$CampaignName = 'NoodleBomb - Ramen Sauce'

# Broad US targeting. Advantage+ audience lets Meta find buyers rather than
# hard-coding brittle interest ids that drift over time.
$Targeting = @{
    geo_locations        = @{ countries = @('US') }
    age_min              = 21
    age_max              = 60
    targeting_automation = @{ advantage_audience = 1 }
}

$Products = @(
    [ordered]@{
        key         = 'original'
        name        = 'Original Ramen Sauce'
        path        = '/original-ramen-sauce'
        price       = '$11.99'
        image       = 'nb-original-front-studio-v1.jpg'
        headline    = 'Restaurant Ramen, At Home'
        primaryText = "One spoonful turns instant noodles into the bowl you'd order out. NoodleBomb Original - deep, savory umami in seconds."
        description = 'Original Ramen Sauce - $11.99'
    },
    [ordered]@{
        key         = 'spicy'
        name        = 'Spicy Tokyo Ramen Sauce'
        path        = '/spicy-tokyo-ramen-sauce'
        price       = '$11.99'
        image       = 'nb-spicy-front-studio-v1.jpg'
        headline    = 'Tokyo Heat in One Pour'
        primaryText = 'Crave the spicy ramen bowl from your favorite Tokyo shop? NoodleBomb Spicy Tokyo brings the slow-building chili heat home - no recipe required.'
        description = 'Spicy Tokyo Ramen Sauce - $11.99'
    },
    [ordered]@{
        key         = 'citrus'
        name        = 'Citrus Shoyu Ramen Sauce'
        path        = '/citrus-shoyu-ramen-sauce'
        price       = '$11.99'
        image       = 'nb-citrus-front-studio-v1.jpg'
        headline    = 'Bright, Citrusy, Crave-Worthy'
        primaryText = 'Yuzu-bright shoyu that wakes up any bowl of noodles. NoodleBomb Citrus Shoyu - balanced, zesty, ridiculously good.'
        description = 'Citrus Shoyu Ramen Sauce - $11.99'
    },
    [ordered]@{
        key         = 'trio'
        name        = 'The NoodleBomb Trio'
        path        = '/'
        price       = '$29.99'
        image       = 'nb-hero-trio-studio-v1.jpg'
        headline    = 'All 3 Flavors. One Box.'
        primaryText = "Can't pick a favorite? The NoodleBomb Trio has Original, Spicy Tokyo, and Citrus Shoyu - your whole ramen night sorted. Save when you bundle."
        description = 'The NoodleBomb Trio - $29.99'
    }
)

# Credentials (script scope so the API helpers can read them).
$script:Token      = $env:META_ACCESS_TOKEN
$script:AccountRaw = $env:META_AD_ACCOUNT_ID
$script:PageId     = $env:META_PAGE_ID
$script:PixelId    = $env:META_PIXEL_ID
$script:Account    = if ($script:AccountRaw) {
    if ($script:AccountRaw.StartsWith('act_')) { $script:AccountRaw } else { "act_$($script:AccountRaw)" }
} else { $null }

# --------------------------------------------------------------------------
# Plan
# --------------------------------------------------------------------------
function Get-ProductUrl {
    param($Product)
    $sep = if ($Product.path -match '\?') { '&' } else { '?' }
    "$Site$($Product.path)${sep}utm_source=facebook&utm_medium=paid&utm_campaign=nb-ramen-sauce&utm_content=$($Product.key)"
}

function Build-Plan {
    param([double]$BudgetUsd, [bool]$UseConversions)
    $objective = if ($UseConversions) { 'OUTCOME_SALES' } else { 'OUTCOME_TRAFFIC' }
    $optGoal   = if ($UseConversions) { 'OFFSITE_CONVERSIONS' } else { 'LINK_CLICKS' }
    $adsets = foreach ($p in $Products) {
        [ordered]@{
            product          = $p
            adsetName        = "NB | $($p.name)"
            adName           = "NB | $($p.name) | Link Ad"
            creativeName     = "NB Creative | $($p.name)"
            url              = Get-ProductUrl $p
            imagePath        = Join-Path $Uploads $p.image
            dailyBudgetCents = [int][math]::Round($BudgetUsd * 100)
            optimizationGoal = $optGoal
        }
    }
    [ordered]@{
        campaignName   = $CampaignName
        objective      = $objective
        useConversions = $UseConversions
        dailyBudgetUsd = $BudgetUsd
        adsets         = @($adsets)
    }
}

function Show-Plan {
    param($Plan)
    $line = '=' * 68
    Write-Host $line
    Write-Host '  NoodleBomb Meta Ads build plan'
    Write-Host $line
    Write-Host "  Campaign      : $($Plan.campaignName)"
    Write-Host "  Objective     : $($Plan.objective)"
    $mode = if ($Plan.useConversions) { 'purchase conversions (pixel)' } else { 'link-click traffic (no pixel)' }
    Write-Host "  Optimization  : $mode"
    Write-Host "  Ad sets       : $($Plan.adsets.Count)"
    Write-Host ("  Budget        : `${0:N2}/day per ad set" -f $Plan.dailyBudgetUsd)
    $total = $Plan.dailyBudgetUsd * $Plan.adsets.Count
    Write-Host ("  Total at full spend: `${0:N2}/day  (only once activated by hand)" -f $total)
    Write-Host '  Status        : everything created PAUSED'
    Write-Host ('-' * 68)
    $missing = New-Object System.Collections.Generic.List[string]
    foreach ($a in $Plan.adsets) {
        $p = $a.product
        $exists = Test-Path -LiteralPath $a.imagePath
        $flag = if ($exists) { 'ok' } else { 'MISSING' }
        if (-not $exists) { $missing.Add([string]$a.imagePath) }
        Write-Host "  - $($a.adsetName)"
        Write-Host "      url      : $($a.url)"
        Write-Host "      image    : uploads/$($p.image)  [$flag]"
        Write-Host "      headline : $($p.headline)"
        Write-Host "      body     : $($p.primaryText)"
        Write-Host ("      goal     : {0}  budget `${1:N2}/day" -f $a.optimizationGoal, ($a.dailyBudgetCents / 100))
    }
    Write-Host $line
    return , @($missing)
}

# --------------------------------------------------------------------------
# Meta Graph API
# --------------------------------------------------------------------------
function Invoke-MetaPost {
    param([string]$Path, [hashtable]$Body)
    $payload = $Body.Clone()
    $payload['access_token'] = $script:Token
    try {
        return Invoke-RestMethod -Method Post -Uri "$Graph/$Path" -Body $payload `
            -ContentType 'application/x-www-form-urlencoded'
    } catch {
        $detail = $null
        if ($_.ErrorDetails -and $_.ErrorDetails.Message) {
            $detail = $_.ErrorDetails.Message
        } elseif ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $detail = $reader.ReadToEnd()
        } else {
            $detail = $_.Exception.Message
        }
        throw "POST $Path failed: $detail"
    }
}

function Invoke-MetaImageUpload {
    param([string]$ImagePath)
    $bytes = [System.IO.File]::ReadAllBytes($ImagePath)
    $b64 = [Convert]::ToBase64String($bytes)
    $resp = Invoke-MetaPost -Path "$($script:Account)/adimages" -Body @{ bytes = $b64 }
    $img = $resp.images.PSObject.Properties | Select-Object -First 1
    if (-not $img) { throw "Image upload returned no hash for $ImagePath" }
    return $img.Value.hash
}

function New-MetaCampaign {
    param([string]$Name, [string]$Objective)
    $resp = Invoke-MetaPost -Path "$($script:Account)/campaigns" -Body @{
        name                   = $Name
        objective              = $Objective
        status                 = 'PAUSED'
        special_ad_categories  = '[]'
    }
    return $resp.id
}

function New-MetaAdSet {
    param([string]$CampaignId, [string]$Name, [int]$BudgetCents,
          [string]$OptGoal, [bool]$UseConversions)
    $body = @{
        name              = $Name
        campaign_id       = $CampaignId
        daily_budget      = $BudgetCents
        billing_event     = 'IMPRESSIONS'
        optimization_goal = $OptGoal
        bid_strategy      = 'LOWEST_COST_WITHOUT_CAP'
        status            = 'PAUSED'
        targeting         = ($Targeting | ConvertTo-Json -Depth 10 -Compress)
    }
    if ($UseConversions) {
        $body['destination_type'] = 'WEBSITE'
        $body['promoted_object'] = (@{
            pixel_id          = $script:PixelId
            custom_event_type = 'PURCHASE'
        } | ConvertTo-Json -Compress)
    }
    return (Invoke-MetaPost -Path "$($script:Account)/adsets" -Body $body).id
}

function New-MetaCreative {
    param([string]$Name, [string]$Url, [string]$Headline,
          [string]$PrimaryText, [string]$Description, [string]$ImageHash)
    $objectStorySpec = @{
        page_id   = $script:PageId
        link_data = @{
            link           = $Url
            message        = $PrimaryText
            name           = $Headline
            description    = $Description
            image_hash     = $ImageHash
            call_to_action = @{ type = 'SHOP_NOW'; value = @{ link = $Url } }
        }
    }
    $resp = Invoke-MetaPost -Path "$($script:Account)/adcreatives" -Body @{
        name              = $Name
        object_story_spec = ($objectStorySpec | ConvertTo-Json -Depth 10 -Compress)
    }
    return $resp.id
}

function New-MetaAd {
    param([string]$Name, [string]$AdSetId, [string]$CreativeId)
    $resp = Invoke-MetaPost -Path "$($script:Account)/ads" -Body @{
        name     = $Name
        adset_id = $AdSetId
        creative = (@{ creative_id = $CreativeId } | ConvertTo-Json -Compress)
        status   = 'PAUSED'
    }
    return $resp.id
}

# --------------------------------------------------------------------------
# Execute
# --------------------------------------------------------------------------
function Invoke-Build {
    param($Plan)
    $created = New-Object System.Collections.Generic.List[object]
    try {
        Write-Host ''
        Write-Host "Creating campaign '$($Plan.campaignName)' (PAUSED)..."
        $campaignId = New-MetaCampaign $Plan.campaignName $Plan.objective
        $created.Add([pscustomobject]@{ kind = 'campaign'; id = $campaignId })
        Write-Host "  campaign id: $campaignId"

        foreach ($a in $Plan.adsets) {
            $p = $a.product
            Write-Host ''
            Write-Host $p.name
            Write-Host "  uploading uploads/$($p.image)..."
            $imageHash = Invoke-MetaImageUpload $a.imagePath
            Write-Host "    image_hash: $imageHash"

            Write-Host '  creating ad set (PAUSED)...'
            $adsetId = New-MetaAdSet $campaignId $a.adsetName $a.dailyBudgetCents `
                $a.optimizationGoal $Plan.useConversions
            $created.Add([pscustomobject]@{ kind = 'adset'; id = $adsetId })
            Write-Host "    adset id: $adsetId"

            Write-Host '  creating ad creative...'
            $creativeId = New-MetaCreative $a.creativeName $a.url $p.headline `
                $p.primaryText $p.description $imageHash
            $created.Add([pscustomobject]@{ kind = 'creative'; id = $creativeId })
            Write-Host "    creative id: $creativeId"

            Write-Host '  creating ad (PAUSED)...'
            $adId = New-MetaAd $a.adName $adsetId $creativeId
            $created.Add([pscustomobject]@{ kind = 'ad'; id = $adId })
            Write-Host "    ad id: $adId"
        }
    } catch {
        Write-Host ''
        Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
        if ($created.Count -gt 0) {
            Write-Host 'Objects created before the failure (all PAUSED - review/delete in Ads Manager):'
            foreach ($c in $created) { Write-Host "  $($c.kind): $($c.id)" }
        }
        exit 1
    }
    $line = '=' * 68
    Write-Host ''
    Write-Host $line
    Write-Host '  Done. All objects created PAUSED - nothing is spending.'
    Write-Host '  Review and activate them in Meta Ads Manager when ready.'
    Write-Host $line
    foreach ($c in $created) { Write-Host "  $($c.kind): $($c.id)" }
}

# --------------------------------------------------------------------------
# Main
# --------------------------------------------------------------------------
$useConversions = [bool]$script:PixelId
$plan = Build-Plan -BudgetUsd $Budget -UseConversions $useConversions
$missing = Show-Plan $plan

if ($DryRun) {
    Write-Host ''
    Write-Host 'DRY RUN - no API calls were made.'
    Write-Host 'Credentials check:'
    foreach ($pair in @(
        @{ Name = 'META_ACCESS_TOKEN';  Value = $script:Token },
        @{ Name = 'META_AD_ACCOUNT_ID'; Value = $script:AccountRaw },
        @{ Name = 'META_PAGE_ID';       Value = $script:PageId })) {
        $state = if ($pair.Value) { 'set' } else { 'MISSING (required for -Execute)' }
        Write-Host ("  {0,-20}: {1}" -f $pair.Name, $state)
    }
    $pixelState = if ($script:PixelId) {
        'set - campaign will optimize for purchases'
    } else {
        'not set - campaign falls back to traffic'
    }
    Write-Host ("  {0,-20}: {1}" -f 'META_PIXEL_ID', $pixelState)
    if ($missing.Count -gt 0) {
        Write-Host ''
        Write-Host 'WARNING: missing creative image files:'
        foreach ($m in $missing) { Write-Host "  $m" }
    }
    exit 0
}

# -Execute
if ($missing.Count -gt 0) {
    Write-Host ''
    Write-Host 'ERROR: cannot execute - missing creative image files:' -ForegroundColor Red
    foreach ($m in $missing) { Write-Host "  $m" }
    exit 1
}

$absent = @()
if (-not $script:Token)      { $absent += 'META_ACCESS_TOKEN' }
if (-not $script:AccountRaw) { $absent += 'META_AD_ACCOUNT_ID' }
if (-not $script:PageId)     { $absent += 'META_PAGE_ID' }
if ($absent.Count -gt 0) {
    Write-Error ('Missing required environment variables: ' + ($absent -join ', '))
    exit 1
}

if (-not $Yes) {
    if (-not [Environment]::UserInteractive) {
        Write-Error 'Refusing to -Execute non-interactively. Re-run with -Yes to confirm.'
        exit 1
    }
    $total = '{0:N2}' -f ($Budget * $plan.adsets.Count)
    $answer = Read-Host "Create this campaign with $($plan.adsets.Count) ad sets in Meta? All PAUSED; potential `$$total/day once activated. [y/N]"
    if ($answer -notmatch '^(y|yes)$') {
        Write-Host 'Aborted.'
        exit 1
    }
}

Invoke-Build $plan
