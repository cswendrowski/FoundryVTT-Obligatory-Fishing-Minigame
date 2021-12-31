export const moduleName = "obligatory-fishing-minigame";

export class FishingUi {
  static app = null;

  static init() {
    // Define dependency on our own custom vue components for when we need it
    Dlopen.register('fishing-ui', {
      scripts: "/modules/" + moduleName + "/dist/vue-components.min.js",
      dependencies: []
    });
  }

  static run() {
    if ( this.app === null ) {
      this.app = new FishingApplication();
      // Todo: On close, destroy vue component
    }

    this.app.render(true);
  }
}

class FishingApplication extends Application {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      title: "",
      template: `modules/${moduleName}/templates/fishing-ui.html`,
      height: '550',
      width: '150',
      popOut: true,
      minimizable: false,
      resizable: false,
      popOutModuleDisable: true,
      classes: [ "fishing-ui" ]
    });
  }

  async close(options = {}) {

    return super.close(options);
  }

}
