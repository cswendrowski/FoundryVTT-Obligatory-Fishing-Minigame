

// Between WallsLayer (40) and TemplateLayer (50)
import {FishingSpotDocument} from "../documents/FishingSpotDocument.mjs";

const FISHING_LAYER_ZINDEX = 45

/**
 * The Stairway Layer which displays stairway icons within the rendered Scene.
 * @extends {PlaceablesLayer}
 */
export class FishingSpotLayer extends PlaceablesLayer {
  /** @override */
  static get layerOptions () {
    return foundry.utils.mergeObject(super.layerOptions, {
      name: 'fishingspots',
      canDragCreate: false,
      canDelete: game.user.isGM,
      controllableObjects: false,
      rotatableObjects: false,
      snapToGrid: true,
      gridPrecision: 2,
      zIndex: FISHING_LAYER_ZINDEX
    })
  }

  /* -------------------------------------------- */
  /*  Event Listeners and Handlers                */
  /* -------------------------------------------- */

  /** @override */
  _onClickLeft (event) {
    super._onClickLeft(event)

    // snap the origin to grid when shift isn't pressed
    const { originalEvent } = event.data
    if (this.options.snapToGrid && !originalEvent.isShift) {
      const { origin } = event.data
      event.data.origin = canvas.grid.getSnappedPosition(origin.x, origin.y, this.gridPrecision)
    }

    // position
    const { origin } = event.data

    // get options from layer control
    // TODO: `animate` should be synced with partner
    const animate = this._animate === true
    const disabled = this._disabled === true
    const hidden = this._hidden === true

    // Create new
    const doc = new FishingSpotDocument({disabled, hidden, x: origin.x, y: origin.y}, { parent: canvas.scene });
    const stairway = new FishingSpot(doc)
    const cls = getDocumentClass(this.constructor.documentName)
    cls.create(stairway.data.toObject(false), { parent: canvas.scene })

    stairway.draw()
  }

  /* -------------------------------------------- */

  /** @override */
  _onDragLeftStart (...args) { }

  /* -------------------------------------------- */

  /** @override */
  _onDragLeftDrop (...args) { }

  /* -------------------------------------------- */

  /** @override */
  _onDragLeftMove (...args) { }

  /* -------------------------------------------- */

  /** @override */
  _onDragLeftCancel (...args) { }
}

FishingSpotLayer.documentName = 'FishingSpot'
