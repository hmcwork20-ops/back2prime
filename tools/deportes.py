# -*- coding: utf-8 -*-
"""
Pictogramas de deporte para las cartas del mazo (mismo plan B que tools/pictos.py).

Uso:
    python tools/deportes.py --prompts                 # imprime los 10 prompts
    python tools/deportes.py --import C:/ruta/carpeta  # importa <id>.png|jpg|webp
    python tools/deportes.py                           # con API: genera los que falten
    python tools/deportes.py --force                   # regenera todos

Salida: assets/deportes/<id>.webp (256×256, ~8-15 KB) + assets/deportes.js
La app usa la imagen si existe en el manifiesto; si no, cae al emoji.
"""
import io, os, sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SALIDA = os.path.join(RAIZ, 'assets', 'deportes')
MANIFIESTO = os.path.join(RAIZ, 'assets', 'deportes.js')
LADO = 256

ESTILO = ("Minimal flat fitness pictogram icon, square composition. One solid off-white human silhouette "
          "(color #F2F4F0) with smooth rounded anatomical forms, side view, centered, performing the sport. "
          "Any equipment or ball drawn as clean bright lime-green shapes (color #C8F24E). Plain very dark "
          "background (color #12161C), completely flat: no gradients, no floor shadow, no text, no labels, "
          "no border, no watermark. Thick simple geometric shapes, consistent icon-set style, high contrast.")

DEPORTES = {
    'running':    'a runner at speed, mid-stride, arms bent at 90 degrees',
    'natacion':   'a freestyle swimmer mid-stroke, one arm reaching forward, a simple lime-green wavy water line below',
    'ciclismo':   'a cyclist riding a road bike with drop handlebars, the bike drawn in lime-green',
    'padel':      'a player hitting a forehand with a padel racket, the perforated racket drawn in lime-green',
    'futbol':     'a player striking a football with the instep, the ball drawn in lime-green',
    'baloncesto': 'a player mid-jump shooting a basketball with one hand, the ball drawn in lime-green',
    'volley':     'a player jumping to spike a volleyball above the head, the ball drawn in lime-green',
    'yoga':       'a person in warrior II yoga pose, calm wide stance, arms extended',
    'calistenia': 'an athlete doing a muscle-up over a straight bar, the bar drawn in lime-green',
    'boxeo':      'a boxer throwing a straight cross punch wearing gloves, the gloves drawn in lime-green',
}


def comprime(img_bytes, destino):
    from PIL import Image
    im = Image.open(io.BytesIO(img_bytes)).convert('RGB')
    w, h = im.size
    lado = min(w, h)
    im = im.crop(((w - lado) // 2, (h - lado) // 2, (w - lado) // 2 + lado, (h - lado) // 2 + lado))
    im = im.resize((LADO, LADO), Image.LANCZOS)
    im.save(destino, 'WEBP', quality=80, method=6)
    return os.path.getsize(destino)


def escribe_manifiesto():
    ids = sorted(f[:-5] for f in os.listdir(SALIDA) if f.endswith('.webp')) if os.path.isdir(SALIDA) else []
    with io.open(MANIFIESTO, 'w', encoding='utf-8', newline='\n') as f:
        f.write('/* generado por tools/deportes.py — qué deportes tienen pictograma en assets/deportes/ */\n')
        f.write('window.B2P_DEPORTES = ' + str(ids).replace("u'", "'") + ';\n')
    return ids


def importa(carpeta):
    os.makedirs(SALIDA, exist_ok=True)
    n = 0
    for nombre in sorted(os.listdir(carpeta)):
        base, ext = os.path.splitext(nombre)
        if ext.lower() not in ('.png', '.jpg', '.jpeg', '.webp'):
            continue
        if base not in DEPORTES:
            print('  (ignorado: %s no es un id de deporte)' % nombre); continue
        with open(os.path.join(carpeta, nombre), 'rb') as f:
            kb = comprime(f.read(), os.path.join(SALIDA, base + '.webp')) / 1024.0
        print('  %-11s %5.0f KB' % (base, kb)); n += 1
    ids = escribe_manifiesto()
    print('importados %d · manifiesto: %d pictogramas' % (n, len(ids)))


def main():
    args = sys.argv[1:]
    if '--prompts' in args:
        for k, desc in DEPORTES.items():
            print('== %s.png ==\n%s The sport: %s.\n' % (k, ESTILO, desc))
        return
    if '--import' in args:
        importa(args[args.index('--import') + 1]); return
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    import fotos
    api_key = fotos.clave()
    if not api_key:
        print('Falta la clave (o usa --import). GEMINI_API_KEY en el entorno o en ~/.gemini/.env')
        sys.exit(2)
    os.makedirs(SALIDA, exist_ok=True)
    forzar = '--force' in args
    pendientes = [k for k in DEPORTES if forzar or not os.path.exists(os.path.join(SALIDA, k + '.webp'))]
    print('a generar: %d' % len(pendientes))
    import time
    for i, k in enumerate(pendientes, 1):
        try:
            png = fotos.genera(api_key, ESTILO + ' The sport: ' + DEPORTES[k] + '.')
            kb = comprime(png, os.path.join(SALIDA, k + '.webp')) / 1024.0
            print('  %2d/%d  %-11s %5.0f KB' % (i, len(pendientes), k, kb))
        except Exception as e:
            print('  %2d/%d  %-11s ERROR: %s' % (i, len(pendientes), k, str(e)[:140]))
        time.sleep(1.5)
    escribe_manifiesto()


if __name__ == '__main__':
    main()
