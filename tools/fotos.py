# -*- coding: utf-8 -*-
"""
Genera las fotos de los platos con la API de Gemini (Nano Banana), las
comprime y escribe el manifiesto que la app lee para saber qué fotos existen.

Uso:
    python tools/fotos.py            # solo las recetas que aún no tienen foto
    python tools/fotos.py --ids curry-lentejas,bol-skyr   # unas concretas
    python tools/fotos.py --force    # regenera todas

Clave: variable GEMINI_API_KEY o GOOGLE_API_KEY, o un fichero
~/.gemini/.env con una línea GEMINI_API_KEY=...   (fuera del repo; nunca se
imprime ni se guarda aquí).

Modelo: gemini-2.5-flash-image (Nano Banana). ~0,04 $ por imagen.
Salida: assets/fotos/<id>.webp (640×640, ~40-60 KB) + assets/fotos.js
"""
import base64, io, json, os, sys, time, urllib.request, urllib.error

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SALIDA = os.path.join(RAIZ, 'assets', 'fotos')
MANIFIESTO = os.path.join(RAIZ, 'assets', 'fotos.js')
MODELO = 'gemini-2.5-flash-image'
LADO = 640

ESTILO = ("Overhead food photograph, top-down at a slight angle, a single serving plated in a matte dark "
          "ceramic dish on a dark slate surface, soft directional natural window light from the left, "
          "gentle shadows, shallow depth of field, appetizing and realistic, minimal styling with one or "
          "two fresh garnish details, muted dark background so the food is the only bright element. "
          "No text, no labels, no hands, no people, no cutlery clutter. Square composition.")

PLATOS = {
    'bol-skyr': 'a bowl of thick white skyr yogurt topped with berries, a few oat flakes and a drizzle of honey',
    'tortilla-pan': 'a golden Spanish omelette wedge next to a slice of toasted bread rubbed with tomato',
    'pollo-asado': 'roast chicken breast slices with oven-roasted potato wedges, red pepper and onion, paprika dusted',
    'lentejas-pollo': 'a rustic bowl of stewed lentils with diced chicken, carrot and a bay leaf',
    'salteado-ternera': 'a wok stir-fry of lean beef strips with broccoli, peppers and carrot over white rice',
    'merluza-patata': 'a grilled hake fillet over sliced boiled potatoes with olive oil and parsley',
    'ensalada-atun': 'a fresh salad bowl with tuna, hard-boiled egg, cherry tomatoes, cucumber and olives',
    'revuelto-gambas': 'scrambled eggs with shrimp and garlic on a plate with a small green salad',
    'salmon-arroz': 'a seared salmon fillet over rice with steamed green beans and a lemon wedge',
    'toma-noche': 'a small glass of thick white skyr with a spoon of nut butter and cinnamon, evening snack',
    'porridge-soja': 'a bowl of creamy oat porridge topped with banana slices and a dusting of cinnamon',
    'tofu-revuelto': 'turmeric-yellow scrambled tofu on two slices of toasted gluten-free bread with sliced tomato',
    'bol-soja-frutos': 'a bowl of soy yogurt topped with mixed berries, chia seeds and banana slices',
    'revuelto-espinacas': 'creamy scrambled eggs with wilted spinach and sliced mushrooms, toast and fruit on the side',
    'curry-lentejas': 'a red lentil coconut curry with basmati rice and fresh coriander in a dark bowl',
    'tofu-salteado': 'golden stir-fried tofu cubes with broccoli, pepper and carrot over brown rice, sesame seeds',
    'bol-garbanzos': 'a grain bowl of quinoa, crispy roasted chickpeas, hummus, roasted pepper and cucumber',
    'pasta-lentejas-tempeh': 'red lentil pasta with tempeh cubes in tomato sauce and fresh basil leaves',
    'tortilla-garbanzo': 'a golden chickpea-flour omelette with courgette slices next to a small green salad',
    'crema-calabaza-tofu': 'a smooth orange pumpkin soup with green edamame, seared tofu slices and pumpkin seeds',
    'ensalada-quinoa-alubias': 'a warm salad of quinoa, black beans, avocado, tomato, red onion and coriander with lime',
    'bolonesa-soja': 'courgette spaghetti topped with a rich textured-soy bolognese sauce and oregano',
}


def clave():
    k = os.environ.get('GEMINI_API_KEY') or os.environ.get('GOOGLE_API_KEY')
    if k:
        return k
    ruta = os.path.join(os.path.expanduser('~'), '.gemini', '.env')
    if os.path.exists(ruta):
        for linea in io.open(ruta, encoding='utf-8'):
            linea = linea.strip()
            if linea.startswith('GEMINI_API_KEY=') or linea.startswith('GOOGLE_API_KEY='):
                return linea.split('=', 1)[1].strip().strip('"\'')
    return None


def genera(api_key, prompt):
    url = 'https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent' % MODELO
    cuerpo = json.dumps({
        'contents': [{'parts': [{'text': prompt}]}],
        'generationConfig': {'responseModalities': ['IMAGE'], 'imageConfig': {'aspectRatio': '1:1'}}
    }).encode('utf-8')
    req = urllib.request.Request(url, data=cuerpo, method='POST', headers={
        'Content-Type': 'application/json', 'x-goog-api-key': api_key})
    for intento in range(3):
        try:
            with urllib.request.urlopen(req, timeout=120) as r:
                data = json.loads(r.read().decode('utf-8'))
            for cand in data.get('candidates', []):
                for parte in cand.get('content', {}).get('parts', []):
                    if 'inlineData' in parte:
                        return base64.b64decode(parte['inlineData']['data'])
            raise RuntimeError('respuesta sin imagen: ' + json.dumps(data)[:300])
        except urllib.error.HTTPError as e:
            detalle = e.read().decode('utf-8', 'ignore')[:300]
            if e.code in (429, 500, 503) and intento < 2:
                time.sleep(8 * (intento + 1)); continue
            raise RuntimeError('HTTP %d: %s' % (e.code, detalle))


def comprime(png_bytes, destino):
    from PIL import Image
    im = Image.open(io.BytesIO(png_bytes)).convert('RGB')
    w, h = im.size
    lado = min(w, h)
    im = im.crop(((w - lado) // 2, (h - lado) // 2, (w - lado) // 2 + lado, (h - lado) // 2 + lado))
    im = im.resize((LADO, LADO), Image.LANCZOS)
    im.save(destino, 'WEBP', quality=78, method=6)
    return os.path.getsize(destino)


def escribe_manifiesto():
    ids = sorted(f[:-5] for f in os.listdir(SALIDA) if f.endswith('.webp')) if os.path.isdir(SALIDA) else []
    with io.open(MANIFIESTO, 'w', encoding='utf-8', newline='\n') as f:
        f.write('/* generado por tools/fotos.py — qué platos tienen foto en assets/fotos/ */\n')
        f.write('window.B2P_FOTOS = ' + json.dumps(ids, ensure_ascii=False) + ';\n')
    return ids


def main():
    args = sys.argv[1:]
    forzar = '--force' in args
    solo = None
    if '--ids' in args:
        solo = set(args[args.index('--ids') + 1].split(','))
    api_key = clave()
    if not api_key:
        print('Falta la clave: GEMINI_API_KEY en el entorno o en ~/.gemini/.env')
        sys.exit(2)
    os.makedirs(SALIDA, exist_ok=True)
    pendientes = [i for i in PLATOS if (solo is None or i in solo) and (forzar or not os.path.exists(os.path.join(SALIDA, i + '.webp')))]
    print('a generar: %d plato(s)' % len(pendientes))
    total = 0
    for i, pid in enumerate(pendientes, 1):
        destino = os.path.join(SALIDA, pid + '.webp')
        try:
            png = genera(api_key, ESTILO + ' The dish: ' + PLATOS[pid] + '.')
            kb = comprime(png, destino) / 1024.0
            total += kb
            print('  %2d/%d  %-24s %5.0f KB' % (i, len(pendientes), pid, kb))
        except Exception as e:
            print('  %2d/%d  %-24s ERROR: %s' % (i, len(pendientes), pid, str(e)[:160]))
        time.sleep(1.5)
    ids = escribe_manifiesto()
    print('manifiesto: %d fotos · %.0f KB nuevas' % (len(ids), total))


if __name__ == '__main__':
    main()
