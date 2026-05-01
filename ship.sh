#!/usr/bin/env bash
# AXIOM · teleprompter — ship.sh
# Deploys the project at $HOME/dev/axiom-teleprompter to GitHub + Netlify.
#
# Usage:
#   bash ship.sh                # full pipeline
#   bash ship.sh --redeploy     # rebuild + netlify deploy --prod only
#
# Pre-reqs (assumed present from sibling AXIOM ships):
#   - node + npm
#   - gh CLI authenticated (`gh auth status`)
#   - netlify CLI auth (we install netlify-cli locally via package.json)

set -euo pipefail

REPO_NAME="axiom-teleprompter"
PROJECT_DIR="$HOME/dev/$REPO_NAME"
LOG="$PROJECT_DIR/.ship.log"
REDEPLOY=0

if [[ "${1:-}" == "--redeploy" ]]; then
  REDEPLOY=1
fi

mkdir -p "$PROJECT_DIR"
cd "$PROJECT_DIR"
: >"$LOG"

log() { echo "[ship] $*" | tee -a "$LOG"; }

# Local netlify-cli (no sudo, no global install).
NTL=( "$PROJECT_DIR/node_modules/.bin/netlify" )

log "Project: $PROJECT_DIR"
log "Node: $(node --version 2>/dev/null || echo 'missing')"
log "npm:  $(npm --version 2>/dev/null || echo 'missing')"
log "gh:   $(gh --version 2>/dev/null | head -n1 || echo 'missing')"

# ---------- install ----------
if [[ ! -d node_modules ]]; then
  log "Installing dependencies (this brings in netlify-cli locally)..."
  npm install --no-audit --no-fund 2>&1 | tee -a "$LOG"
else
  log "node_modules present — skipping install (delete to force reinstall)."
fi

if [[ -x "${NTL[0]}" ]]; then
  log "ntl:  $("${NTL[@]}" --version 2>/dev/null | head -n1)"
else
  log "ERROR: netlify-cli not installed. Aborting."
  exit 1
fi

# ---------- build ----------
log "Building..."
npm run build 2>&1 | tee -a "$LOG"

if [[ $REDEPLOY -eq 1 ]]; then
  log "Redeploy mode — pushing build to Netlify..."
  "${NTL[@]}" deploy --prod --dir=dist 2>&1 | tee -a "$LOG"
  log "Done."
  exit 0
fi

# ---------- git ----------
if [[ ! -d .git ]]; then
  log "Initializing git repo..."
  git init -b main 2>&1 | tee -a "$LOG"
fi

git add -A
if git diff --cached --quiet; then
  log "No staged changes."
else
  git -c user.email="percyhendrux123@gmail.com" \
      -c user.name="Percy" \
      commit -m "ship: AXIOM teleprompter" 2>&1 | tee -a "$LOG"
fi

# ---------- github repo ----------
if ! git remote get-url origin >/dev/null 2>&1; then
  log "Creating GitHub repo..."
  gh repo create "$REPO_NAME" --public --source=. --remote=origin --push 2>&1 | tee -a "$LOG"
else
  log "Pushing to existing origin..."
  git push -u origin main 2>&1 | tee -a "$LOG" || git push origin main 2>&1 | tee -a "$LOG"
fi

REPO_URL="$(gh repo view --json url -q .url 2>/dev/null || echo '')"
log "Repo: $REPO_URL"

# ---------- netlify ----------
SITE_NAME="$REPO_NAME-$(printf '%04x' $((RANDOM % 65536)))"
NTL_TEAM="${NTL_TEAM:-percyhendrux123}"

if [[ ! -f .netlify/state.json ]]; then
  log "Creating Netlify site: $SITE_NAME (team: $NTL_TEAM)"
  CREATE_OUT="$("${NTL[@]}" sites:create --name "$SITE_NAME" --account-slug "$NTL_TEAM" 2>&1 || true)"
  echo "$CREATE_OUT" | tee -a "$LOG"

  SITE_ID="$(echo "$CREATE_OUT" | sed -n 's/.*Site Id:[[:space:]]*\([a-f0-9-]*\).*/\1/p' | head -n1)"
  if [[ -z "$SITE_ID" ]]; then
    SITE_ID="$(echo "$CREATE_OUT" | sed -n 's/.*\"id\":[[:space:]]*\"\([a-f0-9-]*\)\".*/\1/p' | head -n1)"
  fi

  if [[ -n "$SITE_ID" ]]; then
    log "Linking project to site id: $SITE_ID"
    "${NTL[@]}" link --id "$SITE_ID" 2>&1 | tee -a "$LOG" || true
  else
    log "Could not parse site id; trying link by name."
    "${NTL[@]}" link --name "$SITE_NAME" 2>&1 | tee -a "$LOG" || true
  fi
fi

# Defensive — verify state.json points to OUR new site, not a stale link.
if [[ -f .netlify/state.json ]]; then
  LINKED_ID="$(sed -n 's/.*"siteId":[[:space:]]*"\([^"]*\)".*/\1/p' .netlify/state.json | head -n1)"
  log "Linked siteId: $LINKED_ID"
fi

log "Deploying to Netlify (production)..."
DEPLOY_OUTPUT="$("${NTL[@]}" deploy --prod --dir=dist --json 2>>"$LOG" || true)"
echo "$DEPLOY_OUTPUT" | tee -a "$LOG"

LIVE_URL="$(echo "$DEPLOY_OUTPUT" | sed -n 's/.*"url":[[:space:]]*"\([^"]*\)".*/\1/p' | head -n1)"
if [[ -z "$LIVE_URL" ]]; then
  LIVE_URL="$(echo "$DEPLOY_OUTPUT" | sed -n 's/.*"deploy_url":[[:space:]]*"\([^"]*\)".*/\1/p' | head -n1)"
fi

log "================================================================"
log "Live URL: ${LIVE_URL:-<see netlify dashboard>}"
log "Repo URL: ${REPO_URL:-<see gh dashboard>}"
log "================================================================"

# Write summary to ~/Desktop for easy retrieval
SUMMARY="$HOME/Desktop/axiom-teleprompter-ship.txt"
{
  echo "AXIOM · teleprompter — ship summary"
  echo "Live URL : ${LIVE_URL:-<see netlify dashboard>}"
  echo "Repo URL : ${REPO_URL:-<see gh dashboard>}"
  echo "Time     : $(date)"
} >"$SUMMARY"
log "Summary written to: $SUMMARY"
