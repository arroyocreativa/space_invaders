# Secuencia de Programación Orientada a Objetos

Este documento identifica fragmentos de código que demuestran la secuencia de uso de OOP en el proyecto Space Invaders.

---

## 1. DEFINICIÓN DE LA CLASE (con atributos y métodos)

**Archivo:** `lib/ship.js:7-28`

```javascript
// Constructor (define los ATRIBUTOS)
const Ship = function(options = { radius: 13 }) {
  this.id = options.id;
  this.name = options.name;
  this.game = options.game;
  this.canvasSize = options.canvasSize;
  this.img = options.img;
  this.pos = options.pos;
  this.vel = options.vel;
  this.radius = options.radius;
  this.side = options.side;
  this.currentBullet = false;
  this.isDead = false;
  this.hasThreeGuns = false;
  // ... más atributos

  MovingObject.call(this, options);  // Herencia
};

Util.inherits(Ship, MovingObject);  // Hereda de MovingObject
```

**Archivo:** `lib/ship.js:209-329` - Ejemplo de MÉTODO definido en el prototipo:

```javascript
Ship.prototype.fireBullet = function() {
  if (this.currentBullet) { return; }

  let bulletPosX = this.pos[0] - 2;
  let bulletPosY = this.pos[1] - 25;
  // ... lógica para disparar
};
```

---

## 2. INSTANCIACIÓN (creación del objeto)

**Archivo:** `lib/game.js:159-174` - Se crea un objeto Ship (el defensor del jugador):

```javascript
Game.prototype.addDefenderShip = function() {
  const defender = new Ship ({      // ← INSTANCIACIÓN con "new"
    name: 'defender',
    game: this,
    canvasSize: this.canvasSize,
    img: document.getElementById('defender'),
    radius: 16,
    pos: [
      (this.canvasSize[0] - 30) * .52,
      this.canvasSize[1] - 70
    ],
    vel: [0, 0],
    side: 'defender'
  });
  this.defender = defender;         // ← Se guarda la referencia al objeto
};
```

**Otro ejemplo** en `lib/game.js:115-129` - Se crean múltiples naves enemigas:

```javascript
let invaderShip = new Ship ({       // ← INSTANCIACIÓN
  id: invaderIdx,
  name: invaderShipName,
  game: this,
  canvasSize: this.canvasSize,
  img: invaderShipImage,
  radius: 12,
  pos: [x * 35, y],
  vel: vel,
  side: 'invader'
});
this.invaderShips.push(invaderShip);  // ← Se guarda en un array
```

---

## 3. USO DEL MÉTODO (llamando al método del objeto)

**Archivo:** `lib/game_view.js:168-178` - Se usa el método `fireBullet()` del objeto:

```javascript
GameView.prototype.moveDefender = function() {
  if (this.leftPressed) {
    this.defender.power([-3,0]);     // ← USO del método power()
  } else if (this.rightPressed) {
    this.defender.power([3,0]);      // ← USO del método power()
  }

  if (this.spacePressed) {
    this.defender.fireBullet();      // ← USO del método fireBullet()
  }
};
```

**Otro ejemplo** en `lib/game.js:285-289` - Enemigos disparan:

```javascript
this.invaderShips.forEach(invader => {
  let fire = Math.random() * fireChance;
  if (fire < 1) {
    invader.fireBullet();            // ← USO del método en cada objeto
    invader.currentBullet = false;
  }
});
```

---

## Resumen Visual de la Secuencia

| Paso | Qué ocurre | Ubicación |
|------|-----------|-----------|
| **1. Definición** | `const Ship = function(options) { this.name = ... }` | `ship.js:7-26` |
| **1b. Métodos** | `Ship.prototype.fireBullet = function() { ... }` | `ship.js:209-329` |
| **2. Instanciación** | `const defender = new Ship({ name: 'defender', ... })` | `game.js:160-173` |
| **3. Uso** | `this.defender.fireBullet()` | `game_view.js:177` |
