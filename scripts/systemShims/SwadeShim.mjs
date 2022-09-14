export class SwadeShim {
  constructor(character) {
    this.character = character;
  }

  // Catch faster
  get str() {
    const die = this.character.system.attributes.strength.die.sides;
    return (die / 2) - 2;
  }

  // Bait moves faster
  get con() {
    const die = this.character.system.attributes.vigor.die.sides;
    return (die / 2) - 2;
  }

  // Increased chance of treasure
  get int() {
    if (this.character.type === 'vehicle') return 0;
    this.character.system.bennies.max;
  }

  // Speed of fish is reduced
  get wis() {
    const die = this.character.system.attributes.spirit.die.sides;
    return (die / 2) - 2;
  }

  // How far the fish jumps is reduced
  get cha() {
    const die = this.character.system.attributes.spirit.die.sides;
    return (die / 2) - 2;
  }

  // The fish moves less often
  get dex() {
    const die = this.character.system.attributes.agility.die.sides;
    return (die / 2) - 2;
  }
}
