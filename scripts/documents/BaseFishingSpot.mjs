import {FishingSpotData} from "./FishingSpotData.mjs";

export class BaseFishingSpot extends foundry.abstract.Document {
  static get schema() {
    return FishingSpotData;
  }

  static get metadata() {
    return foundry.utils.mergeObject(super.metadata, {
      name: 'FishingSpot',
      collection: 'fishingspots',
      label: 'DOCUMENT.FishingSpot',
      isEmbedded: true
    })

  }
}
