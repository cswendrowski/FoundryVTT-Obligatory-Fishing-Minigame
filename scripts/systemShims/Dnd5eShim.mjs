export class Dnd5eShim {

  constructor(character) {
    this.character = character;
  }

  get str() {
    return this.character.system.abilities.str.mod;
  }

  get con() {
    return this.character.system.abilities.con.mod;
  }

  get int() {
    return this.character.system.abilities.int.mod;
  }

  get wis() {
    return this.character.system.abilities.wis.mod;
  }

  get cha() {
    return this.character.system.abilities.cha.mod;
  }

  get dex() {
    return this.character.system.abilities.dex.mod;
  }
}
