#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo 'Δεν βρέθηκε το υπάρχον τοπικό αποθετήριο GitHub. Δεν θα δημιουργήσουμε νέο ή θα κάνουμε βίαιη αντικατάσταση.'
  exit 1
fi
if ! command -v gh >/dev/null || ! gh auth status >/dev/null 2>&1; then
  echo 'Χρειάζεται σύνδεση GitHub στο Termux: gh auth login --web -p https'
  exit 1
fi
gh auth setup-git
# Αφαιρούμε ΜΟΝΟ τα έξι αρχεία ενδεικτικών προϊόντων της προηγούμενης δοκιμαστικής έκδοσης.
for item in cookware drill earbuds fountain vacuum watch; do
  rm -f -- "assets/products/${item}.webp"
done
if [ ! -f data/products.json ]; then
  echo 'Λείπει το αρχείο καταλόγου data/products.json.'
  exit 1
fi
git add -A
if ! git diff --cached --quiet; then
  git commit -m 'GMP Store v2: no-scroll homepage and owner-only catalog'
else
  echo 'Δεν υπάρχουν νέες αλλαγές για αποθήκευση.'
fi
if ! git remote get-url origin >/dev/null 2>&1; then
  git remote add origin https://github.com/moschidismoschos-hash/gmp-store.git
fi
git push -u origin main
printf '\nΗ ενημέρωση ανέβηκε. Έλεγξε την ιστοσελίδα: https://moschidismoschos-hash.github.io/gmp-store/\n'
