#!/usr/bin/env python3
"""Owner-only catalog editor for Termux. No public administration endpoint."""
from __future__ import annotations
import argparse
from decimal import Decimal, InvalidOperation
import json
import re
import shutil
from pathlib import Path
from uuid import uuid4

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / 'data' / 'products.json'
IMAGES = ROOT / 'assets' / 'products'
CATEGORIES = {'home','technology','fashion','beauty','tools','kids','fitness','auto','pets'}
EXTENSIONS = {'.jpg','.jpeg','.png','.webp'}


def read():
    raw = json.loads(DATA.read_text(encoding='utf-8'))
    if not isinstance(raw, list):
        raise ValueError('Ο κατάλογος πρέπει να περιέχει λίστα.')
    return raw


def write(rows):
    temp = DATA.with_suffix('.tmp')
    temp.write_text(json.dumps(rows, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    temp.replace(DATA)


def ask(prompt, required=True):
    while True:
        x = input(prompt).strip()
        if x or not required:
            return x
        print('Το πεδίο είναι υποχρεωτικό.')


def valid_image(p):
    header = p.open('rb').read(12)
    ext = p.suffix.lower()
    return (ext in {'.jpg','.jpeg'} and header.startswith(b'\xff\xd8\xff')) or (ext == '.png' and header.startswith(b'\x89PNG\r\n\x1a\n')) or (ext == '.webp' and header.startswith(b'RIFF') and header[8:12] == b'WEBP')


def add():
    print('ΠΡΟΣΘΗΚΗ ΔΙΚΟΥ ΣΟΥ ΠΡΟΪΟΝΤΟΣ — Αρχικά αποθηκεύεται ως πρόχειρο.')
    title_el = ask('Όνομα στα ελληνικά: ')
    title_en = ask('Όνομα στα αγγλικά (προαιρετικό): ', required=False)
    print('Κατηγορίες:', ', '.join(sorted(CATEGORIES)))
    while True:
        category = ask('Κατηγορία: ').lower()
        if category in CATEGORIES:
            break
        print('Διάλεξε μία από τις παραπάνω κατηγορίες.')
    while True:
        try:
            value = Decimal(ask('Τιμή σε ευρώ (π.χ. 19.90): ').replace(',', '.'))
            if not value.is_finite() or not (Decimal('0') <= value <= Decimal('1000000')):
                raise ValueError
            amount = float(value.quantize(Decimal('0.01')))
            break
        except (InvalidOperation,ValueError):
            print('Η τιμή πρέπει να είναι μη αρνητικός αριθμός έως 1000000.')
    while True:
        src = Path(ask('Διαδρομή δικής σου φωτογραφίας (π.χ. ~/storage/downloads/proion.jpg): ')).expanduser()
        if src.is_file() and valid_image(src):
            break
        print('Δεν βρέθηκε έγκυρη φωτογραφία JPG, PNG ή WEBP.')
    desc_el = ask('Περιγραφή στα ελληνικά (προαιρετικά): ',required=False)
    desc_en = ask('Περιγραφή στα αγγλικά (προαιρετικά): ',required=False)
    IMAGES.mkdir(parents=True,exist_ok=True)
    identifier='gmp-'+uuid4().hex[:12]
    filename=identifier+src.suffix.lower()
    shutil.copyfile(src, IMAGES / filename)
    row={'id':identifier,'category':category,'price_eur':amount,'image':'assets/products/'+filename,'name':{'el':title_el},'description':{},'published':False}
    if title_en: row['name']['en']=title_en
    if desc_el: row['description']['el']=desc_el
    if desc_en: row['description']['en']=desc_en
    rows=read();rows.append(row);write(rows)
    print('Δημιουργήθηκε πρόχειρο:',identifier)
    print('Για να εμφανιστεί δημόσια: python tools/products.py publish',identifier)


def main():
    p=argparse.ArgumentParser(description='Διαχείριση προϊόντων GMP Store, μόνο από Termux.')
    p.add_argument('action',choices=['add','list','publish','hide','remove','translate'])
    p.add_argument('--lang',choices=['el','en','de','fr','es','it','pt','nl','ja','ar'])
    p.add_argument('--name',help='Μεταφρασμένος τίτλος')
    p.add_argument('--description',help='Μεταφρασμένη περιγραφή')
    p.add_argument('id',nargs='?')
    args=p.parse_args()
    if args.action=='add':
        add();return
    rows=read()
    if args.action=='list':
        for row in rows:
            print(row['id'],'|', 'ΔΗΜΟΣΙΟ' if row.get('published') else 'ΠΡΟΧΕΙΡΟ','|',row['name'].get('el') or row['name'].get('en'))
        print('Σύνολο:',len(rows));return
    if not args.id:
        p.error('Χρειάζεται αναγνωριστικό προϊόντος.')
    match=next((r for r in rows if r['id']==args.id),None)
    if match is None:
        p.error('Το προϊόν δεν βρέθηκε.')
    if args.action=='translate':
        if not args.lang or not args.name: p.error('Για μετάφραση βάλε --lang και --name.')
        match.setdefault('name',{})[args.lang]=args.name.strip()
        if args.description is not None: match.setdefault('description',{})[args.lang]=args.description.strip()
    elif args.action=='publish':match['published']=True
    elif args.action=='hide':match['published']=False
    elif args.action=='remove':
        if ask('Γράψε ΔΙΑΓΡΑΦΗ για επιβεβαίωση: ')!='ΔΙΑΓΡΑΦΗ':
            print('Ακυρώθηκε.');return
        rows.remove(match)
        photo=ROOT/match.get('image','')
        if photo.parent.resolve()==IMAGES.resolve() and photo.is_file():photo.unlink()
    write(rows)
    print('Ολοκληρώθηκε:',args.action,args.id)

if __name__=='__main__':
    main()
