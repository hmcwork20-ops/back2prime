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
import io, json, os, sys

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
    'fondos': 'performing parallel-bar dips: body upright between two parallel bars, elbows bent at 90 degrees lowering the torso, the bars drawn in lime-green',
    # --- peso corporal y banda: el patron dibujaba la barra que esta gente NO tiene ---
    'flexiones': 'performing a push-up on the floor: body in one straight line from head to heels, palms flat '
                 'under the shoulders, elbows bent lowering the chest, side view, NO equipment of any kind',
    'sentadilla-pc': 'performing a bodyweight squat at parallel depth, both arms extended forward at shoulder '
                     'height for balance, side view, NO equipment of any kind',
    'puente': 'performing a glute bridge: lying face up on the floor, knees bent, feet flat, hips lifted so the '
              'body is a straight line from knees to shoulders, side view, NO equipment of any kind',
    'zancada-pc': 'performing a bodyweight forward lunge: front knee bent 90 degrees, back knee close to the '
                  'floor, torso upright with hands on the hips, side view, NO equipment of any kind',
    'banda': 'performing a resistance-band row while sitting directly ON THE FLOOR with the legs extended '
             'forward: torso upright, the band looped around the feet, both arms pulling the band back '
             'toward the ribs, elbows close to the body. The band drawn as a bright lime-green stretched '
             'line. NO bench, NO chair, NO furniture of any kind: the person sits on the floor',

    # --- los 15 que heredaban una barra o una polea que no usan ---
    'remo-toalla': 'standing towel row: leaning back with the arms straight, holding both ends of a towel looped '
                   'around a door handle, then pulling the elbows back to the ribs. The towel drawn as a bright '
                   'lime-green strip and the door edge as a simple lime-green vertical line. NO barbell',
    'remo-mesa': 'inverted row under a sturdy table: lying face up beneath the table, body in a straight plank from '
                 'heels to shoulders, arms pulling the chest up to the table edge, elbows close to the sides. The '
                 'table drawn as a simple lime-green horizontal slab on one leg. NO barbell',
    'jalon-toalla': 'self-resisted towel pulldown seen from THREE QUARTERS with the feet apart: a towel held taut '
                    'overhead, one arm pulling its end down and OUT to the side of the ribs with the elbow well away '
                    'from the body, the other arm resisting above the head. The towel drawn as a bright lime-green '
                    'strip. NO pull-up bar. WIDE open pose that FILLS the square frame, never a narrow profile',
    'pike-flexiones': 'pike push-up: body in an inverted V with the hips high, hands and feet close together, the '
                      'head lowering between the hands, elbows at 45 degrees, side view, NO equipment of any kind',
    'pino-pared': 'wall handstand push-up: upside down and near vertical, the feet resting against a wall, hands on '
                  'the floor slightly wider than the shoulders, elbows bent lowering the head toward the floor. The '
                  'wall drawn as a simple lime-green vertical line. NO equipment of any kind',
    'elev-laterales': 'standing dumbbell lateral raise seen from the FRONT, arms stopping EXACTLY at shoulder height so '
                      'that arms and shoulders form one straight horizontal line, elbows slightly bent, hands no higher '
                      'than the shoulders and never above the head. The two dumbbells drawn in lime-green',
    'fondos-silla': 'bench dip on a chair: back to the chair, both hands on the front edge of the seat behind the '
                    'body, legs extended forward on the floor, elbows bent to 90 degrees lowering the hips. The '
                    'chair drawn as a simple lime-green seat on one leg. NO parallel bars',
    'press-frances-mc': 'floor lying dumbbell triceps extension caught MID-REP with the ELBOW CLEARLY BENT: lying face '
                        'up ON THE FLOOR, the upper arms vertical and still with the elbows pointing straight at '
                        'the ceiling, the forearms folded back about 90 degrees so the two dumbbells rest beside '
                        'the ears. It must NOT look like a straight-arm chest press. The dumbbells drawn in '
                        'lime-green. NO cable, NO bench, NO barbell',
    'rdl-1p': 'single-leg Romanian deadlift: standing on one leg, torso hinged forward flat like a table top, the '
              'free leg extended straight back in line with the torso, arms hanging down toward the floor, side '
              'view, NO equipment of any kind',
    'curl-mochila': 'biceps curl holding a BACKPACK by its top handle with both hands, elbows pinned to the sides, '
                    'forearms curling the backpack up to chest height, side view. The backpack drawn as a simple '
                    'lime-green bag. NO dumbbell',
    'curl-toalla': 'self-resisted towel biceps curl seen from THREE QUARTERS in a split stance: the front foot pinning '
                   'one end of a towel to the floor with the leg clearly forward, the opposite hand curling the other '
                   'end up to chest height, elbow at the side. The towel drawn as a bright lime-green strip. NO '
                   'dumbbell. WIDE open pose that FILLS the square frame, never a narrow profile',
    'abduccion-lado': 'side-lying hip abduction: lying on one side on the floor, body in one straight line, the top '
                      'leg raised up toward the ceiling with the toes pointing forward, side view, NO equipment of '
                      'any kind',
    'elev-y-suelo': 'prone Y raise seen from DIRECTLY ABOVE: the whole body lying face down and straight, legs together '
                    'and visible, head down, both arms extended overhead and lifted, forming a clear wide letter Y with '
                    'the body as its stem. Simple readable anatomy, NO equipment of any kind',
    'curl-nordico': 'assisted nordic hamstring curl: kneeling upright with the ankles held down under a fixed edge, '
                    'the body lowering forward from the knees with hips and shoulders in one straight line, hands '
                    'reaching for the floor to catch, side view. The anchor over the ankles drawn as a simple '
                    'lime-green fixed edge',
    'encogimiento-mochila': 'shoulder shrug at the TOP of the movement, seen from the FRONT with the feet apart: the '
                            'shoulders pulled UP HIGH toward the ears so the neck looks short and the trapezius is '
                            'bunched, arms hanging straight holding a BACKPACK in front of the hips. The backpack drawn '
                            'as a simple lime-green bag. NO barbell. Pose that FILLS the square frame',
}

# QUE MATERIAL DIBUJA cada pictograma, en la misma escala que el plan
# (nada / casa / gym). La app no le pone a un ejercicio un dibujo con mas
# material del que ese ejercicio pide: en la fila de la sesion el dibujo dice
# «esto es lo que haces», y una barra que no tienes es una promesa falsa (lo
# reporto un usuario que veia un press de banca encima de sus flexiones; con
# bandas pasaba igual, el remo se dibuja con barra).
NIVEL = {
    'eh': 'gym', 'ev': 'gym', 'th': 'gym', 'tv': 'gym', 'rod': 'gym', 'bis': 'gym',
    'ext': 'gym', 'fondos': 'gym',          # polea, barra olimpica, barras paralelas
    'zan': 'casa', 'curl': 'casa', 'ais': 'casa', 'banda': 'casa',   # mancuernas y bandas
    'core': 'nada', 'flex': 'nada', 'gem': 'nada',                   # suelo y escalon
    'flexiones': 'nada', 'sentadilla-pc': 'nada', 'puente': 'nada', 'zancada-pc': 'nada',
    # toalla, mochila, silla, mesa y pared son nivel «nada» para el plan
    'remo-toalla': 'nada', 'remo-mesa': 'nada', 'jalon-toalla': 'nada', 'pike-flexiones': 'nada',
    'pino-pared': 'nada', 'fondos-silla': 'nada', 'rdl-1p': 'nada', 'curl-mochila': 'nada',
    'curl-toalla': 'nada', 'abduccion-lado': 'nada', 'elev-y-suelo': 'nada', 'curl-nordico': 'nada',
    'encogimiento-mochila': 'nada',
    'elev-laterales': 'casa', 'press-frances-mc': 'casa',   # mancuernas de verdad
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


MARGEN = 0.06          # aire alrededor del dibujo, en fraccion del lado


def reencuadra(im):
    """Recorta a lo pintado (alfa > 0) y lo centra en el cuadro sin deformar."""
    from PIL import Image
    caja = im.split()[-1].getbbox()
    if not caja:
        return im
    dib = im.crop(caja)
    hueco = int(round(LADO * (1 - 2 * MARGEN)))
    escala = min(hueco / float(dib.width), hueco / float(dib.height))
    nueva = (max(1, int(round(dib.width * escala))), max(1, int(round(dib.height * escala))))
    dib = dib.resize(nueva, Image.LANCZOS)
    lienzo = Image.new('RGBA', (LADO, LADO), (0, 0, 0, 0))
    lienzo.paste(dib, ((LADO - nueva[0]) // 2, (LADO - nueva[1]) // 2))
    return lienzo


def comprime(img_bytes, destino):
    from PIL import Image
    im = Image.open(io.BytesIO(img_bytes))
    if im.mode in ('RGBA', 'LA') or 'transparency' in im.info:
        # ya recortado (un .webp del propio proyecto): solo se reencuadra
        rgba = im.convert('RGBA')
        lado = max(rgba.size)
        cuadro = Image.new('RGBA', (lado, lado), (0, 0, 0, 0))
        cuadro.paste(rgba, ((lado - rgba.width) // 2, (lado - rgba.height) // 2))
        rgba = cuadro.resize((LADO, LADO), Image.LANCZOS)
    else:
        im = im.convert('RGB')
        w, h = im.size
        lado = min(w, h)
        im = im.crop(((w - lado) // 2, (h - lado) // 2, (w - lado) // 2 + lado, (h - lado) // 2 + lado))
        im = im.resize((LADO, LADO), Image.LANCZOS)
        rgba = transparenta(im)
    reencuadra(rgba).save(destino, 'WEBP', quality=85, method=6)
    return os.path.getsize(destino)


def escribe_manifiesto():
    ids = sorted(f[:-5] for f in os.listdir(SALIDA) if f.endswith('.webp')) if os.path.isdir(SALIDA) else []
    with io.open(MANIFIESTO, 'w', encoding='utf-8', newline='\n') as f:
        f.write('/* generado por tools/pictos.py — qué patrones tienen pictograma en assets/pictos/ */\n')
        f.write('window.B2P_PICTOS = ' + str(ids).replace("u'", "'") + ';\n')
        f.write('window.B2P_PICTOS_NIV = ' + json.dumps({k: v for k, v in NIVEL.items() if k in ids}, sort_keys=True) + ' ; '.strip() + '\n')
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
