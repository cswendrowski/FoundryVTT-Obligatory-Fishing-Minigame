import {FishingSpotDocument} from "./documents/FishingSpotDocument.mjs";
import {FishingSpotLayer} from "./layers/FishingSpotsLayer.mjs";
import {FishingSpotPlaceable} from "./layers/FishingSpotPlaceable.mjs";
import {FishingSpotConfig} from "./layers/FishingSpotConfig.mjs";
import {BaseFishingSpot} from "./documents/BaseFishingSpot.mjs";
import {FishingSpotControl} from "./layers/FishingSpotControl.mjs";

const fields = foundry.data.fields;

export const injectFishing = () => {
  CONFIG.FishingSpots = {
    documentClass: FishingSpotDocument,
    objectClass: FishingSpotPlaceable,
    layerClass: {group: 'interface', layerClass: FishingSpotLayer},
    sheetClasses: {base: FishingSpotConfig}
  }

  DocumentSheetConfig.registerSheet(FishingSpotDocument, 'fishingspot',
    FishingSpotConfig, {makeDefault: true});

  hookCanvas()
  hookBaseScene()
  hookSceneData()
  hookControlsLayer()
  hookTokenLayer()

  // add stairways as embedded document for existing scenes
  for ( const scene of game.data.scenes ) {
    scene.fishingspots = foundry.utils.duplicate(scene.flags.fishingspots || [])
  }

  // Hook createScene and add stairways as embedded document
  Hooks.on('createScene', (scene, options, userId) => {
    scene.data.fishingspots = foundry.utils.duplicate(scene.data.flags.fishingspots || [])
  })
}

const hookCanvas = () => {
  // inject StairwayLayer into the canvas layers list
  const origLayers = CONFIG.Canvas.layers
  CONFIG.Canvas.layers = Object.keys(origLayers).reduce((layers, key, i) => {
    layers[key] = origLayers[key]

    // inject stairways layer after walls
    if ( key === 'walls' ) layers.fishingspots = CONFIG.FishingSpots.layerClass

    return layers
  }, {})

  if ( !Object.is(Canvas.layers, CONFIG.Canvas.layers) ) {
    console.error('Possible incomplete layer injection by other module detected! Trying workaround...')

    const layers = Canvas.layers
    Object.defineProperty(Canvas, 'layers', {
      get: function () {
        return foundry.utils.mergeObject(CONFIG.Canvas.layers, layers)
      }
    })
  }

  // Hook the Canvas.getLayerByEmbeddedName
  const origGetLayerByEmbeddedName = Canvas.prototype.getLayerByEmbeddedName
  Canvas.prototype.getLayerByEmbeddedName = function (embeddedName) {
    if ( embeddedName === 'FishingSpot' ) {
      return this.fishingspots
    } else {
      return origGetLayerByEmbeddedName.call(this, embeddedName)
    }
  }
}

const hookBaseScene = () => {
  // inject Stairway into scene metadata
  const BaseScene = foundry.documents.BaseScene
  const sceneMetadata = Object.getOwnPropertyDescriptor(BaseScene.prototype.constructor, 'metadata')
  // Hook the BaseScene#metadata getter
  Object.defineProperty(BaseScene.prototype.constructor, 'metadata', {
    get: function () {
      const metadata = sceneMetadata.get.call(this)
      metadata.embedded.FishingSpot = BaseFishingSpot

      return metadata
    }
  })

  // add stairways getter
  Object.defineProperty(BaseScene.prototype, 'fishingspots', {
    get: function () {
      return this.data.fishingspots
    }
  })
}

const hookSceneData = () => {
  // inject BaseStairway into SceneData schema
  // NOTE: we can't hook SceneData.defineSchema as it may be called before we are able to hook it
  // we therefore hook the SceneData.schema getter and inject the stairways schema there
  const DocumentData = foundry.abstract.DocumentData
  const documentDataSchema = Object.getOwnPropertyDescriptor(DocumentData.prototype.constructor, 'schema')
  const SceneData = foundry.data.SceneData
  const sceneDataSchema = Object.getOwnPropertyDescriptor(SceneData.prototype.constructor, 'schema')

  // Hook the SceneData#schema getter
  Object.defineProperty(SceneData.prototype.constructor, 'schema', {
    get: function () {
      // NOTE: SceneData#schema may be defined by another hook, so use it when defined
      // otherwise fallback to the base class DocumentData#schema
      const schema = (sceneDataSchema || documentDataSchema).get.call(this)

      // inject stairways schema once
      if ( !schema.fishingspots ) {
        schema.fishingspots = fields.embeddedCollectionField(BaseFishingSpot)
      }

      return schema
    }
  })
}

const hookControlsLayer = () => {
  // Hook ControlsLayer.draw
  const origDraw = ControlsLayer.prototype.draw
  ControlsLayer.prototype.draw = function () {
    this.drawFishingControls()
    origDraw.call(this)
  }
  ControlsLayer.prototype.drawFishingControls = function () {
    // Create the container
    if ( this.fishingspots ) this.fishingspots.destroy({children: true})
    this.fishingspots = this.addChild(new PIXI.Container())

    // Iterate over all stairways
    for ( const fishingspot of canvas.fishingspots.placeables ) {
      this.createFishingControl(fishingspot)
    }

    this.fishingspots.visible = !canvas.fishingspots._active
  }
  ControlsLayer.prototype.createFishingControl = function (stairway) {
    const sw = this.fishingspots.addChild(new FishingSpotControl(stairway))
    sw.visible = false
    sw.draw()
  }
}

const hookTokenLayer = () => {
  // Hook TokenLayer.activate / deactivate
  const origActivate = TokenLayer.prototype.activate
  TokenLayer.prototype.activate = function () {
    origActivate.call(this)
    if ( canvas.controls ) canvas.controls.fishingspots.visible = true
  }

  const origDeactivate = TokenLayer.prototype.deactivate
  TokenLayer.prototype.deactivate = function () {
    origDeactivate.call(this)
    if ( canvas.controls ) canvas.controls.fishingspots.visible = false
  }

}
