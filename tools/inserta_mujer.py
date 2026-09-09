# -*- coding: utf-8 -*-
"""Inserta el bloque MUJER en un data.<lang>.js, justo antes del `return`, y
ensancha ese return con los bloques nuevos. Es idempotente: si el fichero ya
lleva el bloque, lo sustituye por el nuevo (para reaplicar una traduccion).

Uso: python inserta_mujer.py <data.js> <bloque.js>
"""
import io, sys, re

ruta, bloque = sys.argv[1], sys.argv[2]
t = io.open(ruta, encoding='utf-8').read()
b = io.open(bloque, encoding='utf-8').read().rstrip('\n') + '\n'

INI = '  /* ---------- MUJER: embarazo, posparto y ciclo ----------'
FIN = '  /* ---------- fin MUJER ---------- */\n'
if INI in t:
    i = t.index(INI); j = t.index(FIN, i) + len(FIN)
    t = t[:i] + t[j:]

ANCLA = '  return {META, FASES, CAL, HITOS_SEMANA, SESIONES,'
EXTRA = ('  return {SUELO_PELVICO: MUJER.SUELO_PELVICO, CALENTAMIENTO_EMB: MUJER.CALENTAMIENTO_EMB, '
         'FASES_EMB: MUJER.FASES_EMB, FASES_PP: MUJER.FASES_PP, REGLAS_EMB: MUJER.REGLAS_EMB, '
         'REGLAS_PP: MUJER.REGLAS_PP, CIENCIA_EMB: MUJER.CIENCIA_EMB, CIENCIA_PP: MUJER.CIENCIA_PP, '
         'SENALES_EMB: MUJER.SENALES_EMB, SENALES_PP: MUJER.SENALES_PP,\n'
         '    META, FASES, CAL, HITOS_SEMANA, SESIONES,')
if EXTRA not in t:
    assert t.count(ANCLA) == 1, 'ancla del return x%d' % t.count(ANCLA)
    t = t.replace(ANCLA, EXTRA, 1)
i = t.index(EXTRA)
t = t[:i] + b + t[i:]
io.open(ruta, 'w', encoding='utf-8', newline='\n').write(t)
print('%s: bloque MUJER insertado (%d lineas)' % (ruta, b.count('\n')))
