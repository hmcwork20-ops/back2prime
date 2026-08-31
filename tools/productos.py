# -*- coding: utf-8 -*-
"""
Imágenes de la compra y de los suplementos: importa las que generes fuera
(web de Gemini o donde sea), las recorta a cuadrado, las comprime a webp y
escribe los dos manifiestos que la app lee.

Uso:
    python tools/productos.py --prompts
        Escribe PROMPTS-IMAGENES.txt en la raiz con el prompt de cada fichero
        que falte. Lo escribe el mismo, sin redirigir la salida: la consola de
        Windows deja el fichero vacio o se come los acentos.

    python tools/productos.py --import C:/Users/Hernan/Desktop/productos
        Importa <pid>.png|jpg|jpeg|webp de esa carpeta a assets/productos/
        (miniaturas de 192×192). Los suplementos van aparte:

    python tools/productos.py --import-supl C:/Users/Hernan/Desktop/suplementos
        Importa <id>.png|jpg|jpeg|webp a assets/supl/ (tarjetas de 480×360).

Después de importar, sube window.B2P_IMG_V en assets/iconos.js para que el
service worker y la caché HTTP recojan las imágenes nuevas.
"""
import io
import os
import re
import sys

from PIL import Image

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

PRODUCTOS = {
    # pid → cómo se llama el producto (para el prompt)
    'aceitunas': 'bol pequeño de aceitunas verdes',
    'aguacate': 'aguacate abierto por la mitad',
    'ajo': 'cabeza de ajo con un diente suelto',
    'alubias': 'bote de cristal de alubias negras cocidas',
    'aove': 'botella de aceite de oliva virgen extra',
    'arroz': 'bol de arroz crudo',
    'atun': 'lata de atún al natural abierta',
    'avena': 'bol de copos de avena',
    'bebida-soja': 'brik de bebida de soja',
    'brocoli': 'brócoli fresco entero',
    'calabacin': 'calabacín fresco entero',
    'calabaza': 'trozo de calabaza con dados cortados',
    'caldo': 'brik de caldo de verduras',
    'canela': 'canela en rama con un montoncito molido',
    'cebolla': 'cebolla entera y media cebolla',
    'champinones': 'champiñones frescos, uno laminado',
    'chia': 'cuenco pequeño de semillas de chía',
    'edamame': 'bol de vainas de edamame',
    'especias': 'tres botes pequeños de especias (pimentón, comino, orégano)',
    'espinacas': 'puñado de espinacas frescas',
    'fruta': 'frutero con plátano, manzana y naranja',
    'frutos-rojos': 'bol de frutos rojos (arándanos, frambuesas, fresas)',
    'gambas': 'gambas peladas crudas en un bol',
    'garbanzos': 'bote de cristal de garbanzos cocidos',
    'harina-garbanzo': 'bol de harina de garbanzo con cuchara',
    'huevos': 'media docena de huevos en su huevera',
    'hummus': 'bol de hummus con un hilo de aceite',
    'leche-coco': 'lata de leche de coco abierta',
    'lechuga': 'lechuga fresca con tomate y cebolla (base de ensalada)',
    'lentejas': 'bote de cristal de lentejas cocidas',
    'lentejas-rojas': 'bol de lentejas rojas secas',
    'levadura': 'bote de levadura nutricional en copos',
    'limon': 'limones, uno cortado por la mitad',
    'merluza': 'lomos de merluza fresca',
    'nueces': 'nueces peladas y una con cáscara',
    'pan': 'barra de pan integral con dos rebanadas',
    'pan-sg': 'pan de molde sin gluten',
    'pasta-lentejas': 'pasta seca de lentejas rojas',
    'patata': 'patatas enteras, una cortada en gajos',
    'pimiento': 'pimiento rojo y pimiento verde',
    'pipas': 'cuenco pequeño de pipas de calabaza',
    'platano': 'plátanos, uno pelado a medias',
    'pollo': 'pechuga de pollo cruda en una tabla',
    'prote-vegetal': 'bote de proteína vegetal en polvo con cazo',
    'quinoa': 'bol de quinoa cruda',
    'sal': 'salero pequeño con sal gruesa',
    'salsa-soja': 'botella pequeña de salsa de soja',
    'salmon': 'lomo de salmón fresco',
    'sesamo': 'cuenco pequeño de semillas de sésamo',
    'skyr': 'tarrina de skyr con cuchara',
    'soja-text': 'bol de soja texturizada fina seca',
    'tamari': 'botella pequeña de salsa tamari',
    'tempeh': 'bloque de tempeh con dos dados cortados',
    'ternera': 'tiras de ternera magra cruda en una tabla',
    'tofu': 'bloque de tofu firme con dos dados cortados',
    'tomate': 'tomates maduros, uno en rodajas',
    'tomate-triturado': 'bote de cristal de tomate triturado',
    'verduras': 'surtido de verduras (pimiento, cebolla, zanahoria, calabacín)',
    'whey': 'bote de proteína whey con cazo',
    'yogur-soja': 'tarrina de yogur de soja natural',
    'zanahoria': 'zanahorias frescas, una cortada en bastones',
}

SUPLEMENTOS = {
    'creatina': 'bote de creatina monohidrato en polvo con cazo',
    'whey': 'bote de proteína whey con cazo y un batido al lado',
    'cafeina': 'taza de café solo con granos de café alrededor',
    'vitamina-d': 'bote de cápsulas de vitamina D con unas perlas fuera',
    'omega-3': 'bote de omega-3 con cápsulas doradas fuera',
}

ESTILO = ('Fotografía de producto minimalista de {que}, centrado, sobre fondo '
          'gris oscuro casi negro (#14171C), luz suave de estudio desde arriba, '
          'realista, sin texto ni marcas ni etiquetas legibles, sin manos, '
          'encuadre cuadrado, el producto ocupa el 70% del encuadre.')


def manifiesto(ruta, variable, ids, nota):
    linea = ', '.join('"%s"' % x for x in sorted(ids))
    with io.open(ruta, 'w', encoding='utf-8', newline='\n') as f:
        f.write('/* generado por tools/productos.py — %s */\n' % nota)
        f.write('window.%s = [%s];\n' % (variable, linea))


def importa(origen, destino, lado_w, lado_h, calidad):
    hechas = []
    for nombre in sorted(os.listdir(origen)):
        m = re.match(r'([a-z0-9-]+)\.(png|jpe?g|webp)$', nombre, re.I)
        if not m:
            continue
        pid = m.group(1).lower()
        img = Image.open(os.path.join(origen, nombre)).convert('RGB')
        # recorte centrado a la proporción pedida y reducción
        w, h = img.size
        obj = lado_w / lado_h
        if w / h > obj:
            nw = int(h * obj)
            img = img.crop(((w - nw) // 2, 0, (w + nw) // 2, h))
        else:
            nh = int(w / obj)
            img = img.crop((0, (h - nh) // 2, w, (h + nh) // 2))
        img = img.resize((lado_w, lado_h), Image.LANCZOS)
        os.makedirs(destino, exist_ok=True)
        img.save(os.path.join(destino, pid + '.webp'), 'WEBP', quality=calidad)
        hechas.append(pid)
    return hechas


def existentes(carpeta):
    if not os.path.isdir(carpeta):
        return set()
    return {f[:-5] for f in os.listdir(carpeta) if f.endswith('.webp')}


if __name__ == '__main__':
    args = sys.argv[1:]
    dir_prod = os.path.join(RAIZ, 'assets', 'productos')
    dir_supl = os.path.join(RAIZ, 'assets', 'supl')

    if args and args[0] == '--prompts':
        ya_p, ya_s = existentes(dir_prod), existentes(dir_supl)
        faltan_p = [(k, v) for k, v in PRODUCTOS.items() if k not in ya_p]
        faltan_s = [(k, v) for k, v in SUPLEMENTOS.items() if k not in ya_s]
        L = ['PROMPTS DE IMAGEN - BACK2PRIME', '=' * 62, '',
             'Genera cada imagen con su prompt y guardala con EXACTAMENTE el',
             'nombre indicado (.png, .jpg o .webp: el formato da igual).', '',
             '  productos    ->  Escritorio, carpeta  productos',
             '  suplementos  ->  Escritorio, carpeta  suplementos', '',
             'No hace falta hacerlas todas de una vez: se importan las que haya',
             'y al volver a lanzar esto solo se listan las que sigan faltando.']
        grupos = (('PRODUCTOS DE LA COMPRA', faltan_p), ('SUPLEMENTOS', faltan_s))
        for titulo, faltan in grupos:
            L += ['', '', '=' * 62, '%s  (faltan %d)' % (titulo, len(faltan)), '=' * 62]
            for pid, que in faltan:
                L += ['', '--- %s.png' % pid, ESTILO.format(que=que)]
        destino = os.path.join(RAIZ, 'PROMPTS-IMAGENES.txt')
        with io.open(destino, 'w', encoding='utf-8', newline='\r\n') as f:
            f.write('\n'.join(L) + '\n')
        print('escrito: ' + destino)
        print('  productos que faltan:   %d' % len(faltan_p))
        print('  suplementos que faltan: %d' % len(faltan_s))
        sys.exit(0)

    if len(args) == 2 and args[0] == '--import':
        nuevas = importa(args[1], dir_prod, 192, 192, 78)
        todas = sorted(existentes(dir_prod))
        manifiesto(os.path.join(RAIZ, 'assets', 'productos.js'), 'B2P_PRODUCTOS', todas,
                   'qué productos de la compra tienen imagen en assets/productos/')
        print('importadas %d · manifiesto con %d productos' % (len(nuevas), len(todas)))
        desconocidas = [p for p in nuevas if p not in PRODUCTOS]
        if desconocidas:
            print('AVISO: ids fuera del diccionario (no las usará nadie): ' + ', '.join(desconocidas))
        sys.exit(0)

    if len(args) == 2 and args[0] == '--import-supl':
        nuevas = importa(args[1], dir_supl, 480, 360, 80)
        todas = sorted(existentes(dir_supl))
        manifiesto(os.path.join(RAIZ, 'assets', 'supl.js'), 'B2P_SUPL', todas,
                   'qué suplementos tienen imagen en assets/supl/')
        print('importadas %d · manifiesto con %d suplementos' % (len(nuevas), len(todas)))
        sys.exit(0)

    print(__doc__)
