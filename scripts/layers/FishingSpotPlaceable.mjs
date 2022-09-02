import {FishingSpotIcon} from "./FishingSpotIcon.mjs";

export class FishingSpotPlaceable extends PlaceableObject {
  get icon () {
    return this.data.icon || STAIRWAY_DEFAULTS.icon
  }

  get width () {
    return this.data.width || STAIRWAY_DEFAULTS.width
  }

  get height () {
    return this.data.height || STAIRWAY_DEFAULTS.height
  }

  get label () {
    // use partner scene name as label
    if (this.data.partnerSceneLabel) {
      const targetScene = this.targetScene

      // only if partner scene is set
      if (targetScene) {
        return targetScene.name
      }
    }

    return (typeof this.data.label === 'string') ? this.data.label : ''
  }

  /* -------------------------------------------- */

  /**
   * Determine if stairway is on current scene
   * @return {boolean}
   */
  get onScene () {
    return this.data.scene === null || this.data.scene === canvas.scene.id
  }

  /**
   * Define a PIXI TextStyle object which is used for the label text
   * @returns {PIXI.TextStyle}
   */
  get labelTextStyle () {
    const style = CONFIG.canvasTextStyle.clone()

    // alignment
    style.align = 'center'

    // font preferences
    style.fontFamily = this.data.fontFamily || STAIRWAY_DEFAULTS.fontFamily
    style.fontSize = this.data.fontSize || STAIRWAY_DEFAULTS.fontSize

    // toggle stroke style depending on whether the text color is dark or light
    const color = this.data.textColor ? foundry.utils.colorStringToHex(this.data.textColor) : 0xFFFFFF
    const hsv = foundry.utils.rgbToHsv(...foundry.utils.hexToRGB(color))
    style.fill = color
    style.strokeThickness = Math.max(Math.round(style.fontSize / 12), 2)
    style.stroke = hsv[2] > 0.6 ? 0x111111 : 0xEEEEEE

    // drop shadow
    style.dropShadow = true
    style.dropShadowColor = style.stroke
    style.dropShadowBlur = Math.max(Math.round(style.fontSize / 6), 4)
    style.dropShadowAngle = 0
    style.dropShadowDistance = 0

    return style
  }

  /* -------------------------------------------- */

  /** @override */
  get bounds () {
    return new NormalizedRectangle(this.data.x, this.data.y, 1, 1)
  }

  /* -------------------------------------------- */
  /* Rendering
  /* -------------------------------------------- */

  /** @override */
  clear () {
    if (this.controlIcon) {
      this.controlIcon.parent.removeChild(this.controlIcon).destroy()
      this.controlIcon = null
    }
    super.clear()
  }

  /** @override */
  async draw () {
    // create containers
    this.clear()
    this.line = this.addChild(new PIXI.Graphics())
    this.controlIcon = this.addChild(new FishingSpotIcon(
      { label: this.label, texture: this.icon,
        width: this.width, height: this.height }))

    // Initial rendering
    this.refresh()
    if (this.id) this.activateListeners()
    return this
  }

  /* -------------------------------------------- */

  /** @override */
  async refresh () {
    // update state
    this.position.set(this.data.x, this.data.y)


    // update icon tint
    const { background, border } = this.status.color
    this.controlIcon.tint = this.data.disabled === true ? 0x999999 : 0x000000
    this.controlIcon.typeColor = background
    this.controlIcon.statusColor = border
    this.controlIcon.draw()


    // Update visibility
    this.alpha = this.data.hidden === true ? 0.5 : 1.0
    this.controlIcon.visible = this.layer._active
    this.controlIcon.border.visible = this._hover || this.isConnectionTarget

    return this
  }

}
