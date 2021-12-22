const moduleName = "obligatory-fishing-minigame";

Hooks.on('devModeReady', ({registerPackageDebugFlag}) => registerPackageDebugFlag(moduleName));

export function log(force, ...args) {
  try {
    const isDebugging = game.modules.get('_dev-mode')?.api?.getPackageDebugValue(moduleName);

    if (force || isDebugging) {
      console.log(moduleName, '|', ...args);
    }
  } catch (e) { }
}

class FishingUi {
  static init() {
    // Define dependency on our own custom vue components for when we need it
    Dlopen.register('fishing-ui', {
      scripts: "/modules/" + moduleName + "/dist/vue-components.min.js",
      dependencies: []
    });
  }

  static run() {

    const d = new Dialog({
        title: "Fishing",
        content: `<fishing-ui class="vueport-render" dependencies='fishing-ui'>Loading, please wait...</fishing-ui>`,
        buttons: {}
      },
      {
        height: '800',
        width: 'auto',
        resizable: true,
        popOutModuleDisable: true,
        classes: ["fishing-ui"]
      }).render(true);
    // Auto resize after 2 seconds
    setTimeout(() => d.setPosition(), 500);
  }
}

Hooks.once('init', async function() {
  FishingUi.init();
});

Hooks.once('ready', async function() {
  window.obligatoryFishingMinigame = {};
  window.obligatoryFishingMinigame.log = log;

  if (game.modules.get('_dev-mode')?.api?.getPackageDebugValue(moduleName)) {
    FishingUi.run();
  }
});
