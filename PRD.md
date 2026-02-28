# PRD - Space Invaders: Pantalla Completa, Responsivo y Tactil

## Objetivo

Adaptar el juego Space Invaders existente (HTML5 Canvas + Vanilla JS) para que:
1. Ocupe la pantalla completa del dispositivo.
2. Se adapte correctamente a cualquier resolucion y orientacion (desktop, tablet, movil).
3. Sea jugable en pantallas tactiles mediante controles virtuales en pantalla.

---

## Estado actual (problemas a resolver)

| Problema | Ubicacion |
|---|---|
| Canvas fijo a 900x600 px | `lib/space_invaders.js` lineas 4-6 y `css/index.css` en `#container` |
| Elementos UI posicionados con pixeles absolutos | `css/index.css` — todos los `position: absolute` con `left`/`bottom` en px fijos |
| Sin meta viewport | `index.html` head — navegadores moviles aplican zoom por defecto |
| Sin control tactil | `lib/game_view.js` — solo maneja `keydown`/`keyup` de teclado |
| Sin proteccion contra scroll tactil | Tocar la pantalla durante el juego activa el scroll del navegador |

---

## Requisitos funcionales

### RF-01 — Pantalla completa (Full Viewport Canvas)

- El canvas mantiene dimensiones logicas internas fijas de **900x600** (las coordenadas del juego no cambian) para no refactorizar la fisica.
- El canvas se escala visualmente con CSS para ocupar **100vw x 100vh**, preservando la relacion de aspecto 3:2.
- El contenedor padre (`#container`) ocupa el viewport completo.
- No se usa la Fullscreen API del navegador; el canvas simplemente ocupa el viewport con CSS.

CSS clave a implementar:

```css
html, body {
  margin: 0; padding: 0;
  width: 100%; height: 100%;
  overflow: hidden;
  background: #000;
}
#container {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
#game-canvas {
  max-width: 100%;
  max-height: 100%;
  aspect-ratio: 3 / 2;
}
```

En `space_invaders.js` el canvas se sigue inicializando con `canvas.width = 900; canvas.height = 600`. La escala visual la maneja CSS exclusivamente, sin cambios en JS.

---

### RF-02 — Elementos UI responsivos

Todos los elementos HTML superpuestos sobre el canvas estan posicionados con pixeles absolutos relativos al contenedor de 900x600. Al escalar el contenedor con CSS, estas posiciones deben convertirse a **porcentajes relativos al `#container`**.

| Elemento | Posicion actual | Posicion objetivo |
|---|---|---|
| `#main-logo` | `left: 215px; top: 10px` | `left: 24%; top: 1.6%` |
| `#menu-button` | `left: 420px; top: 11px` | `left: 47%; top: 1.8%` |
| `#play-game` | `bottom: 30px; left: 307px` | `bottom: 5%; left: 34%` |
| `#invader-info` | `bottom: 230px; left: 415px` | `bottom: 38%; left: 46%` |
| `#splash-instruction` | `bottom: 170px; left: 215px` | `bottom: 28%; left: 24%` |
| `#menu-container` | `bottom: 100px; left: 300px` | `bottom: 17%; left: 33%` |
| `#about`, `#instructions` | `bottom: 100px; left: 300px` | `bottom: 17%; left: 33%` |
| `#audio`, `#mute` | `bottom: 10px; right: 10px` | `bottom: 1.7%; right: 1.1%` |
| `#music-on`, `#music-off` | `bottom: 10px; right: 60px` | `bottom: 1.7%; right: 7%` |
| `#game-over` | `bottom: 150px; left: 180px` | `bottom: 25%; left: 20%` |
| Sprites splash (`#grunt-1`, `#soldier-1`, `#invader-1`, `#ufo`) | posiciones fijas en px | convertir a % |

Tamanos de fuente en CSS deben escalar con `clamp()`:

```css
font-size: clamp(12px, 2.5vw, 23px);
```

---

### RF-03 — Meta viewport y prevencion de comportamientos del navegador

Agregar en `index.html` dentro de `<head>`:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
```

En CSS, deshabilitar comportamientos que interfieren con el juego:

```css
#game-canvas {
  touch-action: none;        /* Desactiva gestos del navegador sobre el canvas */
  user-select: none;
  -webkit-user-select: none;
}
body {
  overscroll-behavior: none; /* Evita scroll rebote en iOS/Android */
}
```

---

### RF-04 — Controles tactiles en pantalla

Agregar botones virtuales sobre el canvas, visibles unicamente en dispositivos tactiles (`@media (hover: none) and (pointer: coarse)`).

Layout de controles (superpuestos sobre el canvas):

```
+--------------------------------------------------+
|                  [GAME CANVAS]                   |
|                                                  |
|  +--------+  +--------+        +--------------+  |
|  |   ◀   |  |   ▶   |        |      ●       |  |
|  +--------+  +--------+        +--------------+  |
+--------------------------------------------------+
```

- **Inferior izquierda:** boton izquierda y boton derecha, separados entre si.
- **Inferior derecha:** boton grande de disparo.
- Tamano minimo de cada boton: 70x70 px para facilitar la pulsacion.
- Posicionados con `position: absolute` sobre `#container`, con `z-index` alto.

HTML a agregar en `index.html` (dentro de `#container`, antes del cierre `</div>`):

```html
<div id="touch-controls">
  <div id="touch-left"  class="touch-btn">&#9664;</div>
  <div id="touch-right" class="touch-btn">&#9654;</div>
  <div id="touch-fire"  class="touch-btn">&#9679;</div>
</div>
```

CSS para los controles tactiles:

```css
#touch-controls {
  display: none; /* oculto por defecto, activado via media query */
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 20%;
  z-index: 10;
}

@media (hover: none) and (pointer: coarse) {
  #touch-controls { display: block; }
}

.touch-btn {
  position: absolute;
  bottom: 10px;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.4);
  color: #fff;
  font-size: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  -webkit-user-select: none;
}

#touch-left  { left: 20px; }
#touch-right { left: 110px; }
#touch-fire  { right: 20px; width: 80px; height: 80px; font-size: 36px; }
```

Logica JS a agregar en `lib/game_view.js` — nuevo metodo `addTouchListeners()`:

```js
GameView.prototype.addTouchListeners = function() {
  var self = this;

  document.getElementById('touch-left').addEventListener('touchstart', function(e) {
    e.preventDefault(); self.leftPressed = true;
  }, { passive: false });
  document.getElementById('touch-left').addEventListener('touchend', function(e) {
    e.preventDefault(); self.leftPressed = false;
  }, { passive: false });

  document.getElementById('touch-right').addEventListener('touchstart', function(e) {
    e.preventDefault(); self.rightPressed = true;
  }, { passive: false });
  document.getElementById('touch-right').addEventListener('touchend', function(e) {
    e.preventDefault(); self.rightPressed = false;
  }, { passive: false });

  document.getElementById('touch-fire').addEventListener('touchstart', function(e) {
    e.preventDefault(); self.spacePressed = true;
  }, { passive: false });
  document.getElementById('touch-fire').addEventListener('touchend', function(e) {
    e.preventDefault(); self.spacePressed = false;
  }, { passive: false });
};
```

Llamar `this.addTouchListeners()` al final del constructor de `GameView`.

**Sin cambios en la logica del juego:** `moveDefender()` ya lee `leftPressed`, `rightPressed` y `spacePressed` en cada tick del game loop — los controles tactiles reutilizan exactamente ese mecanismo.

---

### RF-05 — Adaptacion por orientacion

- **Portrait (vertical):** el canvas se centra con bandas negras arriba/abajo (letterbox); los controles tactiles quedan debajo del area de juego visual.
- **Landscape (horizontal):** el canvas ocupa la mayor parte de la pantalla; los controles tactiles se superponen en las esquinas inferiores sobre el canvas.
- Si el ancho disponible es menor a 360px en portrait, mostrar un aviso "Gira tu dispositivo" via media query CSS.
- En desktop los controles tactiles no son visibles: `@media (hover: hover) { #touch-controls { display: none; } }`.

---

### RF-06 — Texto dibujado en canvas

Los textos `SCORE`, `LIVES` y `LEVEL` dibujados con `ctx.fillText` en `game_view.js` escalan automaticamente junto con el canvas al usar CSS para el escalado visual. **No requieren cambios en JS.**

---

## Requisitos no funcionales

| ID | Requisito |
|---|---|
| RNF-01 | Mantener coordenadas logicas internas 900x600; no refactorizar la fisica ni la IA del juego |
| RNF-02 | Controles tactiles sin lag: activar en `touchstart`, no en `touchend` |
| RNF-03 | Compatible con Chrome/Safari iOS 15+ y Chrome/Firefox Android 10+ |
| RNF-04 | Sin dependencias nuevas; solo HTML, CSS y JS vanilla |
| RNF-05 | Las modificaciones preservan la funcionalidad de teclado en desktop sin regresiones |

---

## Archivos a modificar

| Archivo | Tipo de cambio |
|---|---|
| `index.html` | Agregar meta viewport (3 tags); agregar `<div id="touch-controls">` con 3 botones |
| `css/index.css` | Refactorizar `#container` a 100vh; convertir posiciones absolutas de px a %; agregar estilos de `#touch-controls` y `.touch-btn`; agregar media queries de orientacion y `hover: none` |
| `lib/game_view.js` | Agregar metodo `addTouchListeners()`; llamarlo desde el constructor de `GameView` |

---

## Criterios de aceptacion

- [ ] En iPhone SE (375x667) landscape, el canvas ocupa toda la pantalla sin scroll ni zoom involuntario.
- [ ] En iPad (768x1024) portrait, el canvas se centra con letterbox sin desbordamiento horizontal.
- [ ] Mantener pulsado el boton izquierdo mueve la nave continuamente hacia la izquierda; al soltar se detiene.
- [ ] Pulsar el boton de fuego dispara exactamente igual que la tecla espacio en teclado.
- [ ] En desktop (mouse/hover), los controles tactiles no son visibles.
- [ ] El canvas no activa scroll ni zoom del navegador al tocarlo.
- [ ] El juego funciona en Chrome, Safari iOS y Firefox Android sin errores en consola.
- [ ] El teclado sigue funcionando correctamente en desktop tras los cambios.
