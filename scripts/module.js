import {moduleName, FishingUi} from "./fishingUi.mjs";
import FishingSpotPageSheet from "./journal/fishingSpotPageSheet.mjs";

Hooks.on('devModeReady', ({registerPackageDebugFlag}) => registerPackageDebugFlag(moduleName));

export function log(force, ...args) {
  try {
    const isDebugging = game.modules.get('_dev-mode')?.api?.getPackageDebugValue(moduleName);

    if (force || isDebugging) {
      console.log(moduleName, '|', ...args);
    }
  } catch (e) { }
}

Hooks.once('init', async function() {
  game.keybindings.register(moduleName, "reel", {
    name: "Reel in",
    hint: "Tap or hold",
    editable: [
      {key: "Space"}
    ],
    onDown: () => { window.obligatoryFishingMinigame.reeling = true; return true; },
    onUp: () => { window.obligatoryFishingMinigame.reeling = false; return true; },
    reservedModifiers: [],
    precedence: CONST.KEYBINDING_PRECEDENCE.PRIORITY,
    repeat: true
  });

  DocumentSheetConfig.registerSheet(JournalEntryPage, moduleName, FishingSpotPageSheet, {
    types: ["text"],
    label() {
      return "Fishing Spot Configuration";
    }
  });
});

Hooks.once('ready', async function() {
  window.obligatoryFishingMinigame = {
    reeling: false
  };
  window.obligatoryFishingMinigame.log = log;

  if (game.modules.get('_dev-mode')?.api?.getPackageDebugValue(moduleName)) {
    FishingUi.run();
  }
});
