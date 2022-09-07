export class ThirteenthAgeShim {

  constructor(character) {
    this.character = character;
  }

  // Catch faster
  get str() {
    return this.character.system.abilities.str.mod;
  }

  // Bait moves faster
  get con() {
    return this.character.system.abilities.con.mod;
  }

  // Increased chance of treasure
  get int() {
    return this.character.system.abilities.int.mod;
  }

  // Speed of fish is reduced
  get wis() {
    return this.character.system.abilities.wis.mod;
  }

  // How far the fish jumps is reduced
  get cha() {
    return this.character.system.abilities.cha.mod;
  }

  // The fish moves less often
  get dex() {
    return this.character.system.abilities.dex.mod;
  }
}
