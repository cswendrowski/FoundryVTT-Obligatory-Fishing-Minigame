export class Dnd4eShim {

  constructor(character) {
    this.character = character;
  }

  get str() {
    return game.settings.get("dnd4e", "halfLevelOptions")? this.character.system.abilities.str.mod : this.character.system.abilities.str.modHalf;
  }

  get con() {
    return game.settings.get("dnd4e", "halfLevelOptions")? this.character.system.abilities.con.mod :this.character.system.abilities.con.modHalf;
  }

  get dex() {
    return game.settings.get("dnd4e", "halfLevelOptions")? this.character.system.abilities.dex.mod : this.character.system.abilities.dex.modHalf;
  }

  get int() {
    return game.settings.get("dnd4e", "halfLevelOptions")? this.character.system.abilities.int.mod : this.character.system.abilities.int.modHalf;
  }

  get wis() {
    return game.settings.get("dnd4e", "halfLevelOptions")? this.character.system.abilities.wis.mod : this.character.system.abilities.wis.modHalf;
  }

  get cha() {
    return game.settings.get("dnd4e", "halfLevelOptions")? this.character.system.abilities.cha.mod : this.character.system.abilities.cha.modHalf;
  }
}
