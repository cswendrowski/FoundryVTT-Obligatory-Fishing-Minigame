export class FishingSpotConfig extends DocumentSheet {

  static get defaultOptions() {
   return foundry.utils.mergeObject(super.defaultOptions, {
     classes: ['sheet', 'fishing-spot-sheet'],
     title: 'Fishing Spot Config',
     template: 'modules/obligatory-fishing-minigame/templates/fishing-spot-config.hbs',
     width: 480,
     tabs: [{ navSelector: '.tabs', contentSelector: 'form', initial: 'main' }]
   });
  }

}
