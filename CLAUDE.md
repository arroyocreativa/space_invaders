# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Browser-based Space Invaders game using vanilla JavaScript and HTML5 Canvas. No frameworks - uses prototypal inheritance and the module pattern via Webpack.

## Build Commands

```bash
# Build the bundle (compiles lib/space_invaders.js → bundle.js)
webpack

# Run the game
# Open index.html in a browser (no server required)
```

## Architecture

### Core Classes

- **GameView** (`lib/game_view.js`) - Rendering loop, input handling, UI updates. Manages the main game loop at 100Hz (`setInterval` 10ms) and enemy sprite animation at 2Hz (500ms). Holds `isPaused`, `isMuted`, and input state (`leftPressed`, `rightPressed`, `spacePressed`). Uses [Howler.js](https://howlerjs.com/) (`new Howl`) for background music.

- **Game** (`lib/game.js`) - Game state and rules engine. Manages collections: `invaderShips`, `bullets`, `shields`, `shieldPieces`, `powerUps`, `stars`, and a single `ufo`. Canvas is fixed at 900×600. The `step()` method runs every game tick: `moveObjects → checkCollisions → enemyFire → winRound`.

- **MovingObject** (`lib/moving_object.js`) - Base class for all moving entities. Provides shared `draw`/`move`/`isCollidedWith` logic using circular radius-based collision.

- **Ship** (`lib/ship.js`) - Used for both player and enemies. Ship types: `defender` (player), `grunt`, `soldier`, `invader`, `ufo`. Each type has a `side` property (`'defender'` or `'invader'`). Weapon upgrades are tracked on the Ship: `hasThreeGuns`, `hasFiveGuns`, `speedUp`, `speedUp2`. Enemy speed increments by `0.001` per kill via `increaseSpeed()`.

- **Bullet** (`lib/bullet.js`) - Projectiles. Carries `shipSide` to prevent friendly fire (bullets skip collision if `shipSide === otherObject.side`). Uses Howler.js for shot sounds.

- **Shield** / **ShieldPiece** (`lib/shield.js`, `lib/shield_piece.js`) - Each Shield spawns 20 ShieldPiece tiles drawn in a rectangular loop. ShieldPieces are individually tracked in `game.shieldPieces` and destroyed on hit.

- **PowerUp** (`lib/power_up.js`) - Dropped when UFO dies. 50% chance to spawn; if spawned, equal chance of `'gun'` (magenta) or `'speed'` (light blue). Disappears after 5 seconds. Stacks: two `gun` pickups unlock `hasFiveGuns`; two `speed` pickups unlock `speedUp2`.

- **Star** (`lib/star.js`) - Background decoration. 50 stars that wrap around canvas edges.

- **Note** (`lib/note.js`) - Web Audio API oscillator wrapper (currently unused in main game flow; legacy audio system).

### Game Flow

```
space_invaders.js (entry point, DOM init, UI event listeners)
    ↓
GameView (creates Game, manages game loop and input)
    ↓
Game (state machine: step → move, collide, enemy AI, level check)
    ↓
Entity classes (Ship, Bullet, PowerUp, Shield/ShieldPiece, Star)
```

### Key Patterns

- **Prototypal inheritance** via `Util.inherits(child, parent)` in `lib/util.js` — sets up the prototype chain using a surrogate constructor.
- **Sprites are DOM `<img>` elements** referenced by ID (e.g., `document.getElementById('defender')`). All images must exist in `index.html` before the game starts. Enemy sprites toggle between two images (e.g., `grunt-1`/`grunt-2`) for animation.
- **Collision validation** is centralized in `Util.validCollision()`, which gates collisions by type pair (Bullet↔Ship, Bullet↔ShieldPiece, Ship↔PowerUp) and side, preventing impossible interactions before `isCollidedWith()` is called.
- **UFO spawning** is probabilistic: each game tick has a `1/700` chance to spawn a UFO from a random side.
- **Enemy fire rate** scales with remaining invader count — fewer invaders fire more frequently (from 1-in-5000 down to 1-in-500 chance per invader per tick).
- **Level progression**: clearing all invaders triggers `winRound()`, which increments `level`, restores one life, refreshes shields, and respawns invaders with velocity `0.27 + 0.05 * level`.
- **Kill scores**: grunt=10, soldier=20, invader=40, UFO=50–500 (random).
