# Fix API Routes for Dynamic Rendering
# This script adds the necessary configuration to prevent static generation errors

$apiRoutes = Get-ChildItem -Path "src\app\api" -Recurse -Filter "route.ts"

$dynamicConfig = @"
// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

"@

foreach ($route in $apiRoutes) {
    $content = Get-Content $route.FullName -Raw
    
    # Skip if already has dynamic configuration
    if ($content -match "export const dynamic") {
        Write-Host "Skipping $($route.FullName) - already configured"
        continue
    }
    
    # Find the first import statement and add config after imports
    $lines = $content -split "`n"
    $insertIndex = 0
    
    for ($i = 0; $i -lt $lines.Length; $i++) {
        if ($lines[$i] -match "^import" -or $lines[$i] -match "^$") {
            $insertIndex = $i + 1
        } elseif ($lines[$i] -match "^export|^//|^/\*") {
            break
        }
    }
    
    # Insert dynamic configuration
    $newLines = @()
    $newLines += $lines[0..($insertIndex-1)]
    $newLines += ""
    $newLines += $dynamicConfig.Trim() -split "`n"
    $newLines += $lines[$insertIndex..($lines.Length-1)]
    
    $newContent = $newLines -join "`n"
    Set-Content -Path $route.FullName -Value $newContent -NoNewline
    
    Write-Host "Fixed $($route.FullName)"
}

Write-Host "All API routes have been configured for dynamic rendering!"
