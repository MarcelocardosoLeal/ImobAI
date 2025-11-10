<#
ImobAI Dev Helper
Uso:
  .\dev.ps1 start     # Inicia Postgres (Docker Compose), aguarda pronto, abre Strapi em nova janela e o Admin
  .\dev.ps1 stop      # Derruba os serviços (docker compose down)
  .\dev.ps1 status    # Mostra containers e porta
  .\dev.ps1 restart   # Reinicia DB e abre Strapi
  .\dev.ps1 open      # Abre http://localhost:1337/admin
  .\dev.ps1 logs      # Segue logs do DB
#>

param(
  [ValidateSet('start','stop','status','restart','open','logs','help')]
  [string]$action = 'help'
)

$repoRoot = Split-Path -Parent $PSCommandPath
$strapiDir = Join-Path $repoRoot 'strapi-starter-v5\apps\strapi'

function Ensure-Docker {
  try {
    docker info | Out-Null
  } catch {
    Write-Host 'Docker não está acessível. Abra o Docker Desktop e aguarde ficar verde.' -ForegroundColor Yellow
    throw
  }
}

function Start-Db {
  Push-Location $strapiDir
  Write-Host 'Subindo Postgres via Docker Compose...' -ForegroundColor Cyan
  docker compose up -d db
  Pop-Location
}

function Wait-DbReady {
  Push-Location $strapiDir
  $cid = (docker compose ps -q db)
  if (-not $cid) { Start-Sleep -Seconds 2; $cid = (docker compose ps -q db) }
  $max = 30
  for ($i=0; $i -lt $max; $i++) {
    if ($cid) {
      docker exec $cid pg_isready -U postgres | Out-Null
      if ($LASTEXITCODE -eq 0) { Write-Host 'Postgres pronto.' -ForegroundColor Green; Pop-Location; return }
    }
    Start-Sleep -Seconds 2
  }
  Write-Host 'Aviso: Postgres pode não estar pronto ainda, mas continuaremos.' -ForegroundColor Yellow
  Pop-Location
}

function Start-Strapi {
  Write-Host 'Abrindo Strapi (npm run develop) em nova janela...' -ForegroundColor Cyan
  Start-Process powershell -ArgumentList '-NoExit','-Command','npm run develop' -WorkingDirectory $strapiDir
}

function Stop-Db {
  Push-Location $strapiDir
  Write-Host 'Derrubando serviços (docker compose down)...' -ForegroundColor Cyan
  docker compose down
  Pop-Location
}

function Show-Status {
  Write-Host 'Containers ativos:' -ForegroundColor Cyan
  docker ps --format 'table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}'
}

function Open-Admin {
  Start-Process 'http://localhost:1337/admin'
}

function Follow-DbLogs {
  Push-Location $strapiDir
  docker compose logs -f db
  Pop-Location
}

switch ($action) {
  'start'   { Ensure-Docker; Start-Db; Wait-DbReady; Start-Strapi; Open-Admin }
  'stop'    { Ensure-Docker; Stop-Db }
  'status'  { Ensure-Docker; Show-Status }
  'restart' { Ensure-Docker; Stop-Db; Start-Db; Wait-DbReady; Start-Strapi; Open-Admin }
  'open'    { Open-Admin }
  'logs'    { Ensure-Docker; Follow-DbLogs }
  default   { Write-Host 'Uso: .\dev.ps1 start|stop|status|restart|open|logs' -ForegroundColor Yellow }
}