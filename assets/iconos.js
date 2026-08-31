/* ============================================================
   BACK2PRIME · iconos.js — el set de línea de la casa
   Mismo idioma que los tabs y el header: 24×24, trazo 1.8,
   currentColor, sin relleno. Nada de emojis en el cromo (las
   banderas de idioma son la única excepción, a propósito).
   window.B2P_ICO[nombre] = contenido interno del <svg>.
   ============================================================ */
window.B2P_IMG_V = 3;   // súbelo al re-procesar pictogramas: invalida SW y caché HTTP
window.B2P_ICO = {
  flame: '<path d="M12 22c4.4 0 7-2.8 7-6.5 0-2.5-1.2-4.2-2.6-5.9C15 8 14 6.5 14 4c-3 1.5-4.5 4-4.2 6.5-1-.5-1.7-1.3-2.2-2.5C6.2 9.7 5 11.6 5 15.5 5 19.2 7.6 22 12 22z"/>',
  taza: '<path d="M17 8h1a3 3 0 0 1 0 6h-1"/><path d="M3 8h14v7a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z"/>',
  cubiertos: '<path d="M5 2v6M9 2v6M7 2v20M7 8a2 2 0 0 0 2-2"/><path d="M17 2c-2 3-2 7 0 9v11"/>',
  pez: '<path d="M6.5 12c3-4.5 8-5.5 11.5-5.5-.5 3.5-2 8.5-6.5 9.5-2 .5-4-.5-5-2l-3.5 2 1.5-4-1.5-4 3.5 2z"/><circle cx="15.5" cy="10.5" r=".5"/>',
  luna: '<path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/>',
  actividad: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
  capas: '<path d="M12 2 2 7l10 5 10-5-10-5z"/><path d="M2 12l10 5 10-5"/><path d="M2 17l10 5 10-5"/>',
  bascula: '<circle cx="12" cy="12" r="9"/><path d="M12 12l3.5-3.5"/><path d="M12 3v2"/>',
  cinta: '<rect x="3" y="8" width="18" height="8" rx="1"/><path d="M7 8v3M11 8v4M15 8v3"/>',
  caja: '<path d="M21 8v13H3V8"/><path d="M1 3h22v5H1z"/><path d="M10 12h4"/>',
  camara: '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>',
  portapapeles: '<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/>',
  cartas: '<rect x="3" y="7" width="12" height="14" rx="2"/><path d="M8 3h13v14"/>',
  repetir: '<path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.5 9a9 9 0 0 1 14.9-3.4L23 10"/><path d="M1 14l4.6 4.4A9 9 0 0 0 20.5 15"/>',
  pin: '<path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  mancuerna: '<path d="M6.5 6.5v11M17.5 6.5v11M3 9v6M21 9v6M6.5 12h11"/>',
  ojo: '<path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12Z"/><circle cx="12" cy="12" r="2.8"/>',
  ojoNo: '<path d="M2 12s3.6-6.5 10-6.5c1.6 0 3 .4 4.2 1M22 12s-3.6 6.5-10 6.5c-1.6 0-3-.4-4.2-1"/><path d="M9.4 9.6a2.8 2.8 0 0 0 3.9 3.9"/><path d="M3.5 3.5l17 17"/>',
  cerebro: '<path d="M9.5 2A2.5 2.5 0 0 0 7 4.5v1A3.5 3.5 0 0 0 4 9c0 .8.3 1.6.7 2.2A3.5 3.5 0 0 0 4 13.5 3.5 3.5 0 0 0 7 17v.5A2.5 2.5 0 0 0 9.5 20a2.5 2.5 0 0 0 2.5-2.5v-13A2.5 2.5 0 0 0 9.5 2z"/><path d="M14.5 2A2.5 2.5 0 0 1 17 4.5v1A3.5 3.5 0 0 1 20 9c0 .8-.3 1.6-.7 2.2a3.5 3.5 0 0 1 .7 2.3 3.5 3.5 0 0 1-3 3.5v.5a2.5 2.5 0 0 1-5 0v-13A2.5 2.5 0 0 1 14.5 2z"/>',
  engranaje: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  guardar: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h8"/>',
  matraz: '<path d="M9 3h6"/><path d="M10 3v6L4.5 19a2 2 0 0 0 1.8 3h11.4a2 2 0 0 0 1.8-3L14 9V3"/><path d="M7.5 15h9"/>',
  globo: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a13.5 13.5 0 0 1 0 18 13.5 13.5 0 0 1 0-18z"/>',
  reloj: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  corazon: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/>',
  rayo: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
  diana: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  calendario: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  hecho: '<circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/>',
  baja: '<path d="M2 7l8.5 8.5 5-5L22 17"/><path d="M16 17h6v-6"/>',
  sube: '<path d="M2 17l8.5-8.5 5 5L22 7"/><path d="M16 7h6v6"/>',
  medalla: '<circle cx="12" cy="9" r="6"/><path d="M9 14.5 7 22l5-3 5 3-2-7.5"/>',
  trofeo: '<path d="M8 21h8M12 17v4"/><path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 6H4a2 2 0 0 0 2 5h1M17 6h3a2 2 0 0 1-2 5h-1"/>',
  bandera: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><path d="M4 22v-7"/>',
  montana: '<path d="M3 20 10 8l4 6 3-4 4 10z"/>',
  corona: '<path d="M2 17h20"/><path d="M3 17 2 8l5 4 5-7 5 7 5-4-1 9z"/>',
  escudo: '<path d="M12 22s8-3.5 8-10V5l-8-3-8 3v7c0 6.5 8 10 8 10z"/>',
  abierto: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>',
  barra: '<path d="M3 5h18M7 5v4M17 5v4M12 5v7"/><circle cx="12" cy="14" r="2"/><path d="M12 16v3"/>',
  diamante: '<path d="M6 3h12l4 6-10 12L2 9z"/><path d="M2 9h20M12 21 8 9l4-6M12 21l4-12-4-6"/>',
  plato: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/>',
  pulgar: '<path d="M7 10v12"/><path d="M15 5.9 14 10h5.2a2 2 0 0 1 1.9 2.6l-2 6.8a2 2 0 0 1-1.9 1.4H7V10l4-7a2.4 2.4 0 0 1 4 1.9z"/>'
};
