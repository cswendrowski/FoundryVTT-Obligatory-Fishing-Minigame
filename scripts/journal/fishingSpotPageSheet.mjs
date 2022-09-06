import {FishingUi, moduleName} from "../fishingUi.mjs";

export default class FishingSpotPageSheet extends JournalPageSheet {
  /** @inheritdoc */
  static get defaultOptions() {
    const options = super.defaultOptions;
    options.classes.push("quest");
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
        description: "A fishing spot",
        image: "",
        fishRolltableUUID: "",
        junkRolltableUUID: "",
        treasureRolltableUUID: ""
      }
    }

    // Metadata
    data.name = flagData.name;
    data.description = flagData.description;
    data.image = flagData.image;
    data.fishRolltableUUID = flagData.fishRolltableUUID;
    data.junkRolltableUUID = flagData.junkRolltableUUID;
    data.treasureRolltableUUID = flagData.treasureRolltableUUID;

    // Rolltables
    data.fishRolltable = this._getRolltable(flagData.fishRolltableUUID);
    data.junkRolltable = this._getRolltable(flagData.junkRolltableUUID);
    data.treasureRolltable = this._getRolltable(flagData.treasureRolltableUUID);

    this.data = data;

    return data;
  }

  /* -------------------------------------------- */

  async _updateObject(event, formData) {
    const updateData = {
      "flags": {
        [moduleName]: formData
      }
    };
    return super._updateObject(event, updateData);
  }

  /* -------------------------------------------- */

  /** @inheritDoc */
  activateListeners(html) {
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
    if ( game.user.character ) random += game.user.character.system.abilities.int.mod;
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
