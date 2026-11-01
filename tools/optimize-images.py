#!/usr/bin/env python3
"""
Turn raw screenshots into the files the site expects.

USAGE (from the repository folder):
    pip install pillow
    python tools/optimize-images.py path/to/my-screenshots assets/images/projects/my-new-game

What it does with every .png / .jpg / .jpeg / .webp in the input folder (sorted by name):
    - resizes it to at most 1600px wide and saves it as  shot-1.webp, shot-2.webp ...
    - saves a small 320x180 version as                   thumb-1.webp, thumb-2.webp ...
Then put your square logo in the same folder as  logo.webp  and add the project to
assets/js/data/projects.js  (set `screenshots` to the number of files this script printed).
"""
import sys
from pathlib import Path
from PIL import Image

MAX_WIDTH = 1600
THUMB_SIZE = (320, 180)


def main():
    if len(sys.argv) != 3:
        print(__doc__)
        sys.exit(1)

    source, target = Path(sys.argv[1]), Path(sys.argv[2])
    target.mkdir(parents=True, exist_ok=True)

    files = sorted(p for p in source.iterdir() if p.suffix.lower() in {'.png', '.jpg', '.jpeg', '.webp'})
    if not files:
        print('No images found in', source)
        sys.exit(1)

    for number, path in enumerate(files, start=1):
        image = Image.open(path).convert('RGB')
        if image.width > MAX_WIDTH:
            image = image.resize((MAX_WIDTH, round(image.height * MAX_WIDTH / image.width)), Image.LANCZOS)
        image.save(target / f'shot-{number}.webp', 'WEBP', quality=80, method=6)
        image.resize(THUMB_SIZE, Image.LANCZOS).save(target / f'thumb-{number}.webp', 'WEBP', quality=75, method=6)
        print(f'{path.name} -> shot-{number}.webp + thumb-{number}.webp')

    print(f'\nDone: {len(files)} screenshots. Set  screenshots: {len(files)}  in assets/js/data/projects.js')


if __name__ == '__main__':
    main()
