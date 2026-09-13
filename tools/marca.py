# -*- coding: utf-8 -*-
# El logo como código, con un solo origen.
#
# Escribe, a partir de tools/marca-glifos.json (B y P de la Barlow Condensed 700
# como trazados) y de la geometría del 2-flecha que vive aquí:
#   assets/marca.js           window.B2P_MARCA: anillo(), logotipo(), mono()...
#   icons/favicon.svg         el anillo B2P sobre su placa
#   marca/imagotipo.svg       isotipo + logotipo (fondo oscuro), fuente incrustada
#   marca/imagotipo-claro.svg lo mismo para fondo claro
#
# Los PNG del PWA los dibuja icons/make-icons.html leyendo assets/marca.js, así
# que también salen de aquí. Uso:  python tools/marca.py
#
# Marco: la altura de mayúscula es 100 y la línea base y=100. El 2-flecha se
# dibuja en su propia caja (la de A1 «Pulido» estilizada: 39×65 con trazo 10,
# punta enrasada con la curva) y se mete en ese marco con T(tx): queda un 12 %
# más alto que las mayúsculas. En el nombre completo lleva el trazo 11.
import io, json, os, re

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
G = json.load(io.open(os.path.join(RAIZ, 'tools', 'marca-glifos.json'), encoding='utf-8'))
B, P = G['B']['d'], G['P']['d']

VOLT, TINTA, HUESO = '#C8F24E', '#0B0D10', '#F2F4F0'
DOS_M = 'M20.94 31.75A14.5 14.5 0 1 1 45.38 32.82L21 61H40'      # monograma, trazo 10
PUNTA_M = 'M40 52L53 61L40 70Z'
DOS_W = 'M20.94 31.75A14.5 14.5 0 1 1 45.38 32.82L21 61H39.2'    # nombre completo, trazo 11
PUNTA_W = 'M39.2 51L53.5 61L39.2 71Z'
T = lambda tx: 'translate(%s -10) scale(1.836) translate(-14 -5)' % tx

# Monograma: B en 0, el 2 con su tinta de 73.71 a 145.3, P con la tinta desde
# 155.3 (huecos de 10 a cada lado del 2). Caja de tinta: 6.29 .. 212.73.
DOS_TX, P_TX = 73.71, 149.16
MONO_W, MONO_CX = 206.44, 109.51
ARCO = 'M26.62 58.09A24 24 0 0 1 18.45 52.37'     # destello abajo a la izquierda, caja de 72

def mono(c, tinta_dos=None):
    """Interior del monograma B2P (marco de mayúscula 100)."""
    cd = tinta_dos or c
    return ('<path d="%s" fill="%s"/>' % (B, c)
            + '<g transform="%s"><path d="%s" fill="none" stroke="%s" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/><path d="%s" fill="%s"/></g>'
              % (T(DOS_TX), DOS_M, cd, PUNTA_M, cd)
            + '<path d="%s" fill="%s" transform="translate(%s 0)"/>' % (P, c, P_TX))

def anillo_interior(cx, cy, c):
    """Anillo + destello + monograma, centrados en (cx, cy) con radio 24."""
    e = 0.155                          # 32 de tinta en los 42 interiores, como el B2P de antes
    arco = 'M%.2f %.2fA24 24 0 0 1 %.2f %.2f' % (cx - 9.38, cy + 22.09, cx - 17.55, cy + 16.37)
    return ('<circle cx="%s" cy="%s" r="24" fill="none" stroke="%s" stroke-width="6" opacity=".34"/>' % (cx, cy, c)
            + '<path d="%s" fill="none" stroke="%s" stroke-width="6" stroke-linecap="round"/>' % (arco, c)
            + '<g transform="translate(%.2f %.2f) scale(%s)">%s</g>' % (cx - MONO_CX * e, cy - 50 * e, e, mono(c)))

def dos_nombre(x, y, k, c):
    """El 2-flecha del nombre completo: tinta desde x, línea base en y, mayúscula k."""
    return ('<g transform="translate(%.2f %.2f) scale(%s)"><g transform="%s"><path d="%s" fill="none" stroke="%s" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/><path d="%s" fill="%s"/></g></g>'
            % (x + 0.9 * k, y - 100 * k, k, T(0), DOS_W, c, PUNTA_W, c))

def escribe(ruta, t):
    io.open(os.path.join(RAIZ, ruta), 'w', encoding='utf-8', newline='\n').write(t)
    print('  %s' % ruta)

# ---------- assets/marca.js ----------
js = '''/* ============================================================
   BACK2PRIME · marca.js — el logo como código
   GENERADO por tools/marca.py: no editar a mano. Los mismos trazados
   pintan el favicon, los iconos, la cabecera y la puerta de entrada.
   Marco: altura de mayúscula 100, línea base y=100.
   ============================================================ */
window.B2P_MARCA = (function () {
  'use strict';
  const B = '%(B)s';
  const P = '%(P)s';
  const DOS_M = '%(DOS_M)s', PUNTA_M = '%(PUNTA_M)s';   // monograma, trazo 10
  const DOS_W = '%(DOS_W)s', PUNTA_W = '%(PUNTA_W)s';   // nombre completo, trazo 11
  const T = tx => 'translate(' + tx + ' -10) scale(1.836) translate(-14 -5)';
  const DOS_TX = %(DOS_TX)s, P_TX = %(P_TX)s, MONO = { w: %(MONO_W)s, cx: %(MONO_CX)s };
  function mono(c) {
    return '<path d="' + B + '" fill="' + c + '"/>'
      + '<g transform="' + T(DOS_TX) + '"><path d="' + DOS_M + '" fill="none" stroke="' + c + '" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/><path d="' + PUNTA_M + '" fill="' + c + '"/></g>'
      + '<path d="' + P + '" fill="' + c + '" transform="translate(' + P_TX + ' 0)"/>';
  }
  /* El anillo B2P completo, en una caja de 72. o = { size, color, fondo, rx } */
  function anillo(o) {
    o = o || {};
    const c = o.color || '%(VOLT)s', s = o.size || 72, e = 0.155;
    const fondo = o.fondo ? '<rect width="72" height="72" rx="' + (o.rx == null ? 16 : o.rx) + '" fill="' + o.fondo + '"/>' : '';
    return '<svg viewBox="0 0 72 72" width="' + s + '" height="' + s + '" aria-hidden="true" focusable="false">' + fondo
      + '<circle cx="36" cy="36" r="24" fill="none" stroke="' + c + '" stroke-width="6" opacity=".34"/>'
      + '<path d="%(ARCO)s" fill="none" stroke="' + c + '" stroke-width="6" stroke-linecap="round"/>'
      + '<g transform="translate(' + (36 - MONO.cx * e).toFixed(2) + ' ' + (36 - 50 * e).toFixed(2) + ') scale(' + e + ')">' + mono(c) + '</g></svg>';
  }
  /* El 2-flecha para ir en línea dentro del nombre: hereda el color del texto;
     el alto y la posición los fija el CSS (.b2). */
  function dosInline(cls) {
    return '<svg class="' + (cls || 'b2') + '" viewBox="-0.9 -10.9 73.4 122.1" aria-hidden="true" focusable="false"><g transform="' + T(0) + '">'
      + '<path d="' + DOS_W + '" fill="none" stroke="currentColor" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/><path d="' + PUNTA_W + '" fill="currentColor"/></g></svg>';
  }
  const logotipo = () => 'BACK' + dosInline('b2') + 'PRIME';
  return { B, P, DOS_M, PUNTA_M, DOS_W, PUNTA_W, DOS_TX, P_TX, MONO, T, mono, anillo, dosInline, logotipo };
})();
''' % dict(B=B, P=P, DOS_M=DOS_M, PUNTA_M=PUNTA_M, DOS_W=DOS_W, PUNTA_W=PUNTA_W, DOS_TX=DOS_TX, P_TX=P_TX,
           MONO_W=MONO_W, MONO_CX=MONO_CX, VOLT=VOLT, ARCO=ARCO)
escribe('assets/marca.js', js)

# ---------- icons/favicon.svg ----------
escribe('icons/favicon.svg',
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">\n'
        '  <!-- generado por tools/marca.py: el anillo B2P con el 2-flecha; las letras son\n'
        '       trazados de la Barlow Condensed 700, así que no dependen de ninguna fuente -->\n'
        '  <rect width="64" height="64" rx="14" fill="%s"/>\n' % TINTA
        + '  ' + anillo_interior(32, 32, VOLT) + '\n</svg>\n')

# ---------- marca/imagotipo*.svg (conservan la fuente incrustada) ----------
def imagotipo(ruta, letra):
    viejo = io.open(os.path.join(RAIZ, ruta), encoding='utf-8').read()
    estilo = re.search(r'<style>.*?</style>', viejo, re.S).group(0)
    t = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 287 72" width="287" height="72" role="img" aria-label="BACK2PRIME">\n'
         '  <title>BACK2PRIME</title>\n'
         '  <!-- Generado por tools/marca.py. Imagotipo: el isotipo (anillo + monograma B2P\n'
         '       con el 2-flecha, tal cual icons/favicon.svg) y el logotipo al lado. El 2 del\n'
         '       nombre es el mismo trazado; BACK y PRIME van en Barlow Condensed 700\n'
         '       incrustada, y las letras del monograma son trazados. Fondo transparente. -->\n'
         '  <defs>\n    ' + estilo + '\n  </defs>\n'
         '  <g id="isotipo">\n    ' + anillo_interior(36, 36, VOLT) + '\n  </g>\n'
         '  <g id="logotipo" fill="%s" font-size="40" class="wm">\n' % letra
         + '    <text x="85" y="50">BACK</text>\n'
         + '    ' + dos_nombre(167.5, 50, 0.28, VOLT) + '\n'
         + '    <text x="188.3" y="50">PRIME</text>\n'
         '  </g>\n</svg>\n')
    escribe(ruta, t)

imagotipo('marca/imagotipo.svg', HUESO)
imagotipo('marca/imagotipo-claro.svg', TINTA)
print('marca generada')
