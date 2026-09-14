from pathlib import Path
import sys
from PIL import Image

root = Path(__file__).resolve().parents[1]
source = Path('C:/Users/wonen/Documents/포토샵/Website')
output = root / 'public/characters'

def frame(name):
    rgb = Image.open(source / name).convert('RGB')
    # Match the established transparent two-frame character treatment.
    rgb = rgb.resize((250, 830), Image.Resampling.LANCZOS)
    indexed = rgb.quantize(colors=255)
    palette = indexed.getpalette()
    palette += [0] * (768 - len(palette))
    indexed.putpalette(palette)
    indexed.putdata([
        255 if min(color) > 231 else index
        for index, color in zip(indexed.getdata(), rgb.getdata())
    ])
    indexed.info['transparency'] = 255
    return indexed

if '--portrait-only' not in sys.argv:
    frames = [frame('EgyptCat1.jpg'), frame('EgyptCat2.jpg')]
    frames[0].save(output / 'egypt-cat-face-fast.gif', save_all=True,
                   append_images=frames[1:], duration=160, loop=0,
                   disposal=2, transparency=255, optimize=False)

click_frames = [frame('EgyptCat3.jpg'), frame('EgyptCat4.jpg')]
click_frames[0].save(output / 'egypt-cat-portrait-idle-v2.gif', save_all=True,
                     append_images=click_frames[1:], duration=320, loop=0,
                     disposal=2, transparency=255, optimize=False)
