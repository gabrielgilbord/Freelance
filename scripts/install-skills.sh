#!/usr/bin/env bash
# Instala las skills de diseño que usa COTA en .claude/skills (no se versionan: pesan ~60 MB
# y algunas no publican licencia de redistribución). skills-lock.json registra las versiones.
#   bash scripts/install-skills.sh
set -euo pipefail
cd "$(dirname "$0")/.."
export CI=1
npx -y skills@1.8.1 add https://github.com/anthropics/skills --skill frontend-design -a claude-code -y
npx -y skills@1.8.1 add https://github.com/vercel-labs/agent-skills --skill web-design-guidelines -a claude-code -y
npx -y skills@1.8.1 add nextlevelbuilder/ui-ux-pro-max-skill --skill ui-ux-pro-max -a claude-code -y
npx -y skills@1.8.1 add https://github.com/Teddarific/skills --skill anatomy-asset -a claude-code -y
npx -y impeccable@4.9.1 telemetry off
npx -y impeccable@4.9.1 install --project --providers=claude-code --no-hooks -y
echo "Skills instaladas en .claude/skills"
