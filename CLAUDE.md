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

- **GameView** (`lib/game_view.js`) - Rendering loop, input handling, UI updates. Manages the main game loop running at 100Hz (10ms interval) with animation updates at 2Hz (500ms).

- **Game** (`lib/game.js`) - Game state and rules engine. Manages collections of game objects (invaderShips, bullets, shields, powerUps, stars), scoring, lives, levels, and collision detection.

- **MovingObject** (`lib/moving_object.js`) - Base class for all moving entities. Provides shared draw/move/collision logic.

- **Ship** (`lib/ship.js`) - Used for both player and enemies. Ship types: defender (player), grunt, soldier, invader, UFO. Each type has different sprite, health, speed, and point values.

- **Bullet** (`lib/bullet.js`) - Projectiles fired by ships. Uses collision detection in `Util.validCollision()` to prevent impossible collisions (e.g., defender bullets hitting defender).

- **Shield** / **ShieldPiece** (`lib/shield.js`, `lib/shield_piece.js`) - Destructible defense blocks composed of small tiles.

- **PowerUp** (`lib/power_up.js`) - Dropped when UFO is destroyed. Types: guns (weapon upgrade), speed (movement boost).

### Game Flow

```
space_invaders.js (entry point, DOM init)
    ↓
GameView (creates Game, handles rendering/input)
    ↓
Game (manages state, spawns entities, checks collisions)
    ↓
Entity classes (Ship, Bullet, PowerUp, Shield, Star)
```

### Key Patterns

- Prototypal inheritance via `Util.inherits()` in `lib/util.js`
- Sprites loaded as HTML `<img>` elements, drawn via Canvas `drawImage()`
- Enemy speed dynamically increases as invaders are killed
- Levels increase difficulty by spawning invaders closer to the player
