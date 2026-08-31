# -*- coding: utf-8 -*-
# Fuentes para @capacitor/assets, a partir de los iconos que ya tiene la PWA.
# Genera en resources/:
#   icon.png            1024x1024, fondo opaco (iOS no admite transparencia)
#   icon-foreground.png 1024x1024, el dibujo centrado al 66% (adaptativo Android)
#   icon-background.png 1024x1024, el color de fondo del plan
#   splash.png          2732x2732 y su variante oscura, logo centrado
import io
import os
from PIL import Image

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ICONOS = os.path.join(RAIZ, 'icons')
SALIDA = os.path.join(RAIZ, 'resources')
FONDO = (11, 13, 16, 255)          # #0B0D10, el mismo del manifest y del splash

os.makedirs(SALIDA, exist_ok=True)

base = Image.open(os.path.join(ICONOS, 'icon-512.png')).convert('RGBA')

def sobre_fondo(img, lado, escala=1.0):
    """Pega img centrada sobre un lienzo opaco del color del plan."""
    lienzo = Image.new('RGBA', (lado, lado), FONDO)
    d = int(lado * escala)
    pieza = img.resize((d, d), Image.LANCZOS)
    lienzo.paste(pieza, ((lado - d) // 2, (lado - d) // 2), pieza)
    return lienzo

# Icono de app: el dibujo llena el cuadro, sin transparencia
sobre_fondo(base, 1024).convert('RGB').save(os.path.join(SALIDA, 'icon.png'))

# Adaptativo de Android: el sistema recorta hasta un 25% por cada lado, así que
# el dibujo va al 66% y nunca pierde un trozo, sea cual sea la forma del recorte.
capa = Image.new('RGBA', (1024, 1024), (0, 0, 0, 0))
d = int(1024 * 0.66)
capa.paste(base.resize((d, d), Image.LANCZOS), ((1024 - d) // 2, (1024 - d) // 2))
capa.save(os.path.join(SALIDA, 'icon-foreground.png'))
Image.new('RGBA', (1024, 1024), FONDO).save(os.path.join(SALIDA, 'icon-background.png'))

# Splash: cuadrado grande para que valga en cualquier pantalla y orientación.
# El logo ocupa poco: al recortar por los lados, lo que sobra es fondo.
splash = sobre_fondo(base, 2732, escala=0.22).convert('RGB')
splash.save(os.path.join(SALIDA, 'splash.png'))
splash.save(os.path.join(SALIDA, 'splash-dark.png'))

for f in sorted(os.listdir(SALIDA)):
    ruta = os.path.join(SALIDA, f)
    print('  %-24s %s  %d KB' % (f, Image.open(ruta).size, os.path.getsize(ruta) // 1024))
