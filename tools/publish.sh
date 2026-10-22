#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  printf '%s\n' 'Δεν υπάρχει το ήδη συνδεδεμένο τοπικό αποθετήριο. Η δημοσίευση σταμάτησε.'
  exit 1
fi
if ! command -v gh >/dev/null || ! gh auth status >/dev/null 2>&1; then
  printf '%s\n' 'Συνδέσου πρώτα στο GitHub μέσα στο Termux: gh auth login --web -p https'
  exit 1
fi
if [[ "$(git branch --show-current)" != "main" ]]; then
  printf '%s\n' 'Ο τρέχων κλάδος δεν είναι main. Δεν θα αλλάξουμε κλάδο αυτόματα.'
  exit 1
fi
# Οι εννέα φωτογραφίες κατηγοριών ήταν ενδεικτικές της πρώτης έκδοσης.
# Πλέον η αρχική δείχνει μόνο εικονίδια κατηγοριών, όχι ξένα προϊόντα.
for category in home technology fashion beauty tools kids fitness auto pets; do
  rm -f -- "assets/categories/${category}.webp"
done
# ΜΗΝ διαγράψεις τον προσωπικό κατάλογο ή δικές σου φωτογραφίες.
if [ ! -f data/products.json ]; then
  printf '%s\n' 'Λείπει ο προσωπικός κατάλογος data/products.json. Διακοπή για προστασία δεδομένων.'
  exit 1
fi
python -m json.tool data/products.json >/dev/null
GH_REPO='https://github.com/moschidismoschos-hash/gmp-store.git'
if ! git remote get-url origin >/dev/null 2>&1; then
  git remote add origin "$GH_REPO"
fi
gh auth setup-git
git add -A
if ! git diff --cached --quiet; then
  git commit -m 'GMP Store v4: premium microinteractions, no-scroll, owner catalog'
else
  printf '%s\n' 'Δεν υπάρχουν τοπικές αλλαγές.'
fi
git push -u origin main
printf '\n%s\n' 'Η έκδοση 4 ανέβηκε. Άνοιξε την ενημερωμένη διεύθυνση:'
printf '%s\n' 'https://moschidismoschos-hash.github.io/gmp-store/?v=4'
