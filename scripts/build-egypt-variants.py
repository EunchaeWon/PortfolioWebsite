from pathlib import Path
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

frames = [frame('EgyptCat2.jpg'), frame('EgyptCat1.jpg')]
for name, duration in [('egypt-cat-face-walk.gif', 320)]:
    frames[0].save(output / name, save_all=True, append_images=frames[1:],
                   duration=duration, loop=0, disposal=2, transparency=255, optimize=False)
for name in ['egypt-cat-face-walk.gif']:
    image = Image.open(output / name)
    print(name, image.size, image.n_frames, image.info.get('duration'))
