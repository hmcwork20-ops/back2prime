# -*- coding: utf-8 -*-
"""
Pictogramas de patrón de movimiento como imagen (plan B del SVG por código).

Uso:
    python tools/pictos.py --prompts                 # imprime los 13 prompts
    python tools/pictos.py --import C:/ruta/carpeta  # importa <clave>.png|jpg|webp
    python tools/pictos.py                           # con API (GEMINI_API_KEY): genera los que falten
    python tools/pictos.py --force                   # regenera todos

Salida: assets/pictos/<clave>.webp (256×256, ~8-15 KB) + assets/pictos.js
La app usa la imagen si existe en el manifiesto; si no, cae al SVG.
"""
import io, os, sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SALIDA = os.path.join(RAIZ, 'assets', 'pictos')
MANIFIESTO = os.path.join(RAIZ, 'assets', 'pictos.js')
LADO = 256

ESTILO = ("Minimal flat fitness pictogram icon, square composition. One solid off-white human silhouette "
          "(color #F2F4F0) with smooth rounded anatomical forms, side view, centered, performing the exercise. "
          "The equipment (barbell, dumbbell, bar, bench, cable) drawn as clean bright lime-green shapes "
          "(color #C8F24E). Plain very dark background (color #12161C), completely flat: no gradients, no floor "
          "shadow, no text, no labels, no border, no watermark. Thick simple geometric shapes, consistent "
          "icon-set style, high contrast.")

PATRONES = {
    'eh':   'performing a barbell bench press: lying on a flat bench, arms pressing the barbell straight up',
    'ev':   'performing a standing overhead barbell press, bar locked out above the head, feet shoulder-width',
    'th':   'performing a bent-over barbell row: torso hinged forward 45 degrees, flat back, pulling the bar toward the torso',
    'tv':   'performing a pull-up: hanging from a high bar, chin approaching the bar, knees bent back',
    'rod':  'performing a barbell back squat at parallel depth: hips back, bar resting on the shoulders',
    'bis':  'performing a Romanian deadlift: nearly straight legs, flat back hinged forward, barbell hanging at mid-shin',
    'zan':  'performing a forward lunge: front knee bent 90 degrees, back knee near the floor, one dumbbell in each hand',
    'core': 'holding a forearm plank: body in one straight line, elbows under the shoulders',
    'flex': 'performing an abdominal crunch: lying on the floor, knees bent, shoulders curling up toward the knees',
    'curl': 'performing a standing dumbbell biceps curl: elbow pinned to the side, forearm curling the dumbbell up',
    'ext':  'performing a cable triceps pushdown: standing, elbow pinned to the side, forearm pressing the handle down',
    'gem':  'performing a standing calf raise on the edge of a step: heels lifted high, body vertical',
    'ais':  'a single dumbbell shown on its own, side view, as an icon',
}


def transparenta(im, tol=55):
    """Fondo oscuro fuera por flood-fill desde los bordes (los oscuros
    interiores de la silueta sobreviven), con feather de 1 px."""
    from PIL import Image, ImageFilter
    from collections import deque
    im = im.convert('RGB'); W, H = im.size; px = im.load()
    esquinas = [px[0, 0], px[W - 1, 0], px[0, H - 1], px[W - 1, H - 1]]
    bg = tuple(sorted(c[i] for c in esquinas)[1] for i in range(3)); t2 = tol * tol
    def cerca(p):
        dr = p[0] - bg[0]; dg = p[1] - bg[1]; db = p[2] - bg[2]
        return dr * dr + dg * dg + db * db < t2
    mask = bytearray(W * H); dq = deque()
    for x in range(W):
        for y in (0, H - 1):
            if not mask[y * W + x] and cerca(px[x, y]): mask[y * W + x] = 1; dq.append((x, y))
    for y in range(H):
        for x in (0, W - 1):
            if not mask[y * W + x] and cerca(px[x, y]): mask[y * W + x] = 1; dq.append((x, y))
    while dq:
        x, y = dq.popleft()
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < W and 0 <= ny < H and not mask[ny * W + nx] and cerca(px[nx, ny]):
                mask[ny * W + nx] = 1; dq.append((nx, ny))
    a = Image.new('L', (W, H)); a.putdata(bytes(0 if m else 255 for m in mask))
    a = a.filter(ImageFilter.BoxBlur(1))
    out = im.convert('RGBA'); out.putalpha(a)
    return out


def comprime(img_bytes, destino):
    from PIL import Image
    im = Image.open(io.BytesIO(img_bytes)).convert('RGB')
    w, h = im.size
    lado = min(w, h)
    im = im.crop(((w - lado) // 2, (h - lado) // 2, (w - lado) // 2 + lado, (h - lado) // 2 + lado))
    im = im.resize((LADO, LADO), Image.LANCZOS)
    transparenta(im).save(destino, 'WEBP', quality=85, method=6)
    return os.path.getsize(destino)


def escribe_manifiesto():
    ids = sorted(f[:-5] for f in os.listdir(SALIDA) if f.endswith('.webp')) if os.path.isdir(SALIDA) else []
    with io.open(MANIFIESTO, 'w', encoding='utf-8', newline='\n') as f:
        f.write('/* generado por tools/pictos.py — qué patrones tienen pictograma en assets/pictos/ */\n')
        f.write('window.B2P_PICTOS = ' + str(ids).replace("u'", "'") + ';\n')
    return ids


def importa(carpeta):
    os.makedirs(SALIDA, exist_ok=True)
    n = 0
    for nombre in sorted(os.listdir(carpeta)):
        base, ext = os.path.splitext(nombre)
        if ext.lower() not in ('.png', '.jpg', '.jpeg', '.webp'):
            continue
        if base not in PATRONES:
            print('  (ignorado: %s no es una clave de patrón)' % nombre); continue
        with open(os.path.join(carpeta, nombre), 'rb') as f:
            kb = comprime(f.read(), os.path.join(SALIDA, base + '.webp')) / 1024.0
        print('  %-6s %5.0f KB' % (base, kb)); n += 1
    ids = escribe_manifiesto()
    print('importados %d · manifiesto: %d pictogramas' % (n, len(ids)))


def main():
    args = sys.argv[1:]
    if '--prompts' in args:
        for k, desc in PATRONES.items():
            print('== %s.png ==\n%s The exercise: %s.\n' % (k, ESTILO, desc))
        return
    if '--import' in args:
        importa(args[args.index('--import') + 1]); return
    # via API: reutiliza el motor de fotos
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    import fotos
    api_key = fotos.clave()
    if not api_key:
        print('Falta la clave (o usa --import). GEMINI_API_KEY en el entorno o en ~/.gemini/.env')
        sys.exit(2)
    os.makedirs(SALIDA, exist_ok=True)
    forzar = '--force' in args
    pendientes = [k for k in PATRONES if forzar or not os.path.exists(os.path.join(SALIDA, k + '.webp'))]
    print('a generar: %d' % len(pendientes))
    import time
    for i, k in enumerate(pendientes, 1):
        try:
            png = fotos.genera(api_key, ESTILO + ' The exercise: ' + PATRONES[k] + '.')
            kb = comprime(png, os.path.join(SALIDA, k + '.webp')) / 1024.0
            print('  %2d/%d  %-6s %5.0f KB' % (i, len(pendientes), k, kb))
        except Exception as e:
            print('  %2d/%d  %-6s ERROR: %s' % (i, len(pendientes), k, str(e)[:140]))
        time.sleep(1.5)
    escribe_manifiesto()


if __name__ == '__main__':
    main()
