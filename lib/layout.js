const Layout = {
  detect: function () {
    return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
  },

  landscape: {
    canvasWidth: 900,
    canvasHeight: 600,
    // UFO
    ufoY: 45,
    ufoRadius: 27,
    ufoSpawnXs: [-30, 930],
    // Invaders
    invaderStartY: 150,
    invaderRowSpacing: 60,
    invaderColSpacing: 75,
    invaderColOffset: 150,
    invaderRadius: 20,
    invaderBaseVelX: 0.27,
    invaderLevelVelIncrement: 0.05,
    invaderDropOnReverse: 20,
    invaderGameOverThreshold: 100,
    invaderWallMargin: 20,
    // Sprites
    enemySpriteSize: 45,
    enemySpriteOffset: 22,
    defenderSpriteSize: 33,
    defenderSpriteOffset: 16,
    // Defender
    defenderRadius: 16,
    defenderSpawnFactorX: 0.52,
    defenderSpawnOffsetX: -30,
    defenderSpawnOffsetY: -70,
    // Shields
    shieldStartX: 0.05,
    shieldStepX: 0.2,
    shieldOffsetX: 14,
    shieldY: 0.8,
    shieldPieceSize: 7,
    // Bullets
    bulletWidth: 4,
    bulletHeight: 14,
    defenderBulletVel: [0, -4],
    enemyBulletVel: [0, 4],
    bulletSpawnOffsetX: -2,
    bulletSpawnOffsetY: -25,
    enemyBulletExtraY: 30,
    threeGunOffsets: [[0, 0], [-8, 8], [8, 8]],
    fiveGunOffsets: [[0, 0], [-8, 8], [8, 8], [-14, 16], [14, 16]],
    // PowerUp
    powerUpRadius: 5,
    powerUpVel: [0, 4],
    powerUpStopOffsetY: -70,
    // HUD
    hudFontSize: 23,
    livesTextPos: [0.87, 0.05],
    scoreTextPos: [0.01, 0.05],
    levelTextPos: [0.01, 0.95]
  },

  portrait: {
    canvasWidth: 600,
    canvasHeight: 900,
    // UFO
    ufoY: 65,
    ufoRadius: 30,
    ufoSpawnXs: [-30, 630],
    // Invaders
    invaderStartY: 200,
    invaderRowSpacing: 80,
    invaderColSpacing: 65,
    invaderColOffset: 80,
    invaderRadius: 22,
    invaderBaseVelX: 0.22,
    invaderLevelVelIncrement: 0.04,
    invaderDropOnReverse: 25,
    invaderGameOverThreshold: 130,
    invaderWallMargin: 20,
    // Sprites
    enemySpriteSize: 50,
    enemySpriteOffset: 25,
    defenderSpriteSize: 38,
    defenderSpriteOffset: 19,
    // Defender
    defenderRadius: 18,
    defenderSpawnFactorX: 0.52,
    defenderSpawnOffsetX: -30,
    defenderSpawnOffsetY: -90,
    // Shields
    shieldStartX: 0.04,
    shieldStepX: 0.24,
    shieldOffsetX: 10,
    shieldY: 0.82,
    shieldPieceSize: 11,
    // Bullets
    bulletWidth: 5,
    bulletHeight: 16,
    defenderBulletVel: [0, -5],
    enemyBulletVel: [0, 5],
    bulletSpawnOffsetX: -2,
    bulletSpawnOffsetY: -28,
    enemyBulletExtraY: 35,
    threeGunOffsets: [[0, 0], [-9, 9], [9, 9]],
    fiveGunOffsets: [[0, 0], [-9, 9], [9, 9], [-16, 18], [16, 18]],
    // PowerUp
    powerUpRadius: 7,
    powerUpVel: [0, 5],
    powerUpStopOffsetY: -90,
    // HUD
    hudFontSize: 20,
    livesTextPos: [0.82, 0.05],
    scoreTextPos: [0.01, 0.05],
    levelTextPos: [0.01, 0.95]
  }
};

module.exports = Layout;
