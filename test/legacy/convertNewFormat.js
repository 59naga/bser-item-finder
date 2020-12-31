it.skip('', () => {
  const items = require('../src/dict/oldItems').map((item) => {
    const [id, type, rarity, stackable, quantity, parents, children, src, stats] = item

    const keys = {
      // hp
      hp: /max hp[ +]+([\d.]+)$/,
      // hp regen
      hpRegen: /hp regen[ +]+([\d.]+)$/,
      // hp regen increase
      hpRegenIncrease: /hp regen[ +%()]+([\d.]+)%?$/,

      // sp
      sp: /max sp[ +]+([\d.]+)$/,
      // sp regen
      spRegen: /sp regen[ +]+([\d.]+)$/,
      // sp regen increase
      spRegenIncrease: /sp regen[ +%()]+([\d.]+)%?$/,

      // attack damage
      attack: /attack power[ +]+([\d.]+)/,
      // attack speed
      attackSpeed: /attack speed[ %()]+([+\- \d.]+)/,
      // attack extra damage
      attackExtraDamage: /extra normal attack damage[ +]+([\d.]+)/,
      // attack range
      attackRange: /attack range[ +]+([\d.]+)$/,

      // skill damage increase
      skillDamage: /skill damage increase[ +%()]+([\d.]+)%?/,
      // skill cooldown reduction
      skillCooldown: /cooldown reduction[ +]+([\d.]+)%?/,

      // life steal
      lifeSteal: /life steal[ +%():]+([\d.]+)%?/,

      // critical damage increase
      criticalDamage: /critical strike damage[ +]+([\d.]+)%?/,
      // critical chance
      criticalChance: /critical strike chance[ +]+([\d.]+)%?/,

      // defense
      defense: /defense[ +]+([\d.]+)/,
      // attack damage reduction
      defenseAttack: /normal attack damage taken reduction[ +]+([\d.]+)/,
      // skill damage reduction
      defenseSkill: /skill damage reduction[ +]+([\d.]+)/,

      // movement speed
      movementSpeed: /movement speed[ ]+([+\- \d.]+)/,
      // movement speed(out of combat)
      movementSpeedNotCombat: /movement speed while out of combat[ ]+([+\- \d.]+)/,

      // attack healing reduction 40%
      healingReductionAttack: /healing reduction \(normal attacks\) -([\d.]+)%$/,
      // skill healing reduction 40%
      healingReductionSkill: /healing reduction \(skills\) -([\d.]+)%$/,
      // vision range
      visionRange: /vision range[ +:]+([\d.]+)/,

      // max ammo
      maxAmmo: /max ammo[ :]+([\d.]+)/,
      // trap damage
      trapDamage: /trap damage[ +:]+([\d.]+)/,
    }
    const actualStats = {}
    for (const key of Object.keys(keys)) {
      actualStats[key] = 0
    }
    if (!stats.length) {
      return [id, type, rarity, stackable, quantity, parents, children, src, Object.values(actualStats)]
    }

    const lines = stats.split('\n')
    lines.forEach((line) => {
      for (const [key, regexp] of Object.entries(keys)) {
        const [matched, value] = line.match(regexp) || [null, 0]
        if (matched) {
          actualStats[key] = Number(value.replace(/ /g, '')) // ' - 0.05' => -0.05
          return
        }
      }
      throw new Error(`${line} / ${stats}`)
    })
    // console.log(id, Object.values(actualStats))

    return [id, type, rarity, stackable, quantity, parents, children, src, Object.values(actualStats)]
  })

  require('fs').writeFileSync('./src/dict/newItems.json', JSON.stringify(items))
})
