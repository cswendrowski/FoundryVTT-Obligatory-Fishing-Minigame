import {FishingUi, moduleName} from "../fishingUi.mjs";
import {systemShim} from "../systemShims/theRealShimShady.mjs";

export default class FishingSpotPageSheet extends JournalPageSheet {
  /** @inheritdoc */
  static get defaultOptions() {
    const options = super.defaultOptions;
    options.classes.push("form");
    return options;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  get template() {
    return this.isEditable ? `/modules/${moduleName}/templates/journal/page-fishingspot-edit.html` :
      `/modules/${moduleName}/templates/journal/page-fishingspot-view.html`;
  }

  /* -------------------------------------------- */

  /**
   * FishingSpotData
   * @typedef {Object} FishingSpotData
   * @property {string} name
   * @property {string} description
   * @property {string} image
   * @property {string} fishRolltableUUID
   * @property {string} junkRolltableUUID
   * @property {string} treasureRolltableUUID
   */

  /* -------------------------------------------- */

  /** @inheritDoc */
  async getData(options) {
    const data = super.getData(options);

    /** @type {FishingSpotData} */
    let flagData = data.document.flags[moduleName];
    if ( !flagData ) {
      flagData = {
        name: "Fishing Spot",
        image: "",
        fishRolltableUUID: "",
        junkRolltableUUID: "",
        treasureRolltableUUID: ""
      }
    }

    // Metadata
    data.name = flagData.name;
    data.text = data.document.text;
    data.image = flagData.image;
    data.fishRolltableUUID = flagData.fishRolltableUUID;
    data.junkRolltableUUID = flagData.junkRolltableUUID;
    data.treasureRolltableUUID = flagData.treasureRolltableUUID;

    // Rolltables
    data.fishRolltable = this._getRolltable(flagData.fishRolltableUUID);
    data.junkRolltable = this._getRolltable(flagData.junkRolltableUUID);
    data.treasureRolltable = this._getRolltable(flagData.treasureRolltableUUID);

    this.data = data;
    console.dir(data);

    return data;
  }

  /* -------------------------------------------- */

  async _updateObject(event, formData) {
    const updateData = foundry.utils.mergeObject(formData, {
      "flags": {
        [moduleName]: formData
      }
    });
    return super._updateObject(event, updateData);
  }

  /* -------------------------------------------- */

  /** @inheritDoc */
  activateListeners(html) {
    super.activateListeners(html);
    html.find(".fishing-spot-fish").click(() => {
      FishingUi.run(() => {
        this._fishCaught();
      });
    });
  }

  /* -------------------------------------------- */

  async _fishCaught() {
    let id = this.data.fishRolltableUUID;
    // A random number from 1 to 100
    let random = Math.floor(Math.random() * 100) + 1;
    if ( game.user.character ) random += systemShim(game.user.character).int;
    if ( random <= 10 ) {
      id = this.data.junkRolltableUUID;
    }
    else if ( random >= 90 ) {
      id = this.data.junkRolltableUUID;
    }
    const rolltable = this._getRolltable(id);
    if (rolltable) {
      let result = await rolltable.draw();
    }
  }

  /* -------------------------------------------- */

  /**
   * Get a RollTable by UUID
   * @param uuid
   * @returns {*}
   * @private
   */
  _getRolltable(uuid) {
    if (uuid) {
      return game.tables.get(uuid);
    }
  }
}
