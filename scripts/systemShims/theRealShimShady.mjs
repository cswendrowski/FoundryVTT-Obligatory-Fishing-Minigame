import {Dnd5eShim} from "./Dnd5eShim.mjs";
import {Pf2eShim} from "./Pf2eShim.mjs";
import {ThirteenthAgeShim} from "./13a.mjs";

export function systemShim(character) {
  const system = game.system.id;
  switch ( system ) {
    case "dnd5e": return new Dnd5eShim(character);
    case "pf2e": return new Pf2eShim(character);
    case "archmage": return new ThirteenthAgeShim(character);
    default: return null;
  }
}
