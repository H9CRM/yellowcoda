from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

root = Path(__file__).resolve().parents[1]
public = root / 'public'
(public / 'icons').mkdir(parents=True, exist_ok=True)

def icon(size):
    im = Image.new('RGB', (size,size), '#17201b')
    d = ImageDraw.Draw(im)
    stroke = max(3, size // 35)
    pad = size // 5
    d.rounded_rectangle((pad, size//9, size-pad, size-size//9), radius=size//10, outline='#d4b971', width=stroke)
    d.line((size//2, size//9, size//2, size-size//9), fill='#d4b971', width=stroke)
    d.ellipse((size//2-size//17, size//2-size//17, size//2+size//17, size//2+size//17), fill='#d4b971')
    return im

icon(192).save(public / 'icons' / 'icon-192.png')
icon(512).save(public / 'icons' / 'icon-512.png')
icon(64).save(public / 'favicon.ico', sizes=[(16,16),(32,32),(48,48),(64,64)])

card = Image.new('RGB', (1200,630), '#17201b')
d = ImageDraw.Draw(card)
try:
    font_large = ImageFont.truetype('C:/Windows/Fonts/georgia.ttf', 78)
    font_mid = ImageFont.truetype('C:/Windows/Fonts/arial.ttf', 25)
    font_small = ImageFont.truetype('C:/Windows/Fonts/arial.ttf', 19)
except OSError:
    font_large = font_mid = font_small = ImageFont.load_default()
d.rectangle((0,0,1200,16), fill='#d4b971')
d.rectangle((645,57,1151,571), outline='#6c654d', width=2)
strap = Image.open(public / 'images' / 'hero-two-leather-straps.webp').convert('RGBA')
strap.thumbnail((500,500), Image.Resampling.LANCZOS)
card.paste(strap, (648 + (500 - strap.width)//2, 58 + (500 - strap.height)//2), strap)
d.text((72,80),'YellowCada.',font=font_large,fill='#f6f4ec')
d.text((78,199),'HANDMADE LEATHER WATCH STRAPS',font=font_small,fill='#d4b971')
d.text((72,284),'The strap is',font=font_large,fill='#f6f4ec')
d.text((72,375),'the story.',font=font_large,fill='#d4b971')
d.text((78,527),'Explore a direction. Enquire for your fit.',font=font_mid,fill='#c3c9be')
d.text((811,574),'ILLUSTRATIVE DIRECTION',font=font_small,fill='#d4b971')
card.save(public / 'og-image.jpg', quality=88, optimize=True)
print('Created favicon, icons and social preview.')
