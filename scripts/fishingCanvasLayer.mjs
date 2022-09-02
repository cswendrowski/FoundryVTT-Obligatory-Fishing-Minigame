const moduleName = "obligatory-fishing-minigame";

export class FishingSpotCanvasObject extends PIXI.Container {
  constructor(data) {
    super(data);
    this.data = data;
  }

  /* -------------------------------------------- */

  async draw() {
    this.clear();

    // Draw the control icon
    this.controlIcon = this.addChild(this._drawControlIcon());

    // Draw the note tooltip
    this.tooltip = this.addChild(this._drawTooltip());

    // Refresh the current display
    this.refresh();

    // Add control interactivity if the placeable has an ID
    if ( this.id ) this.activateListeners();
    return this;
  }

  /* -------------------------------------------- */

  /**
   * Clear the display of the existing object
   * @return {PlaceableObject}    The cleared object
   */
  clear() {
    this.removeChildren().forEach(c => c.destroy({children: true}));
    return this;
  }

  /* -------------------------------------------- */

  refresh() {
    this.position.set(this.data.x, this.data.y);
    this.controlIcon.border.visible = this._hover;
    this.tooltip.visible = this._hover;
    this.visible = this.isVisible;
    return this;
  }

  /* -------------------------------------------- */

  /**
   * Draw the ControlIcon for the Map Note
   * @returns {ControlIcon}
   * @protected
   */
  _drawControlIcon() {
    let icon = new ControlIcon({texture: "icons/svg/anchor.svg", size: 80});
    icon.x -= (this.size / 2);
    icon.y -= (this.size / 2);
    // icon.x = 500;
    // icon.y = 500;
    return icon;
  }

  /* -------------------------------------------- */

  /**
   * Draw the map note Tooltip as a Text object
   * @returns {PIXI.Text}
   * @protected
   */
  _drawTooltip() {

    // Create the Text object
    const textStyle = this._getTextStyle();
    const text = new PreciseText(this.text, textStyle);
    text.visible = false;

    // Configure Text position
    text.anchor.set(0.5, 0.5);
    text.position.set(0, 0);

    return text;
  }

  /* -------------------------------------------- */

  /**
   * Define a PIXI TextStyle object which is used for the tooltip displayed for this Note
   * @returns {PIXI.TextStyle}
   * @protected
   */
  _getTextStyle() {
    const style = CONFIG.canvasTextStyle.clone();

    // Font preferences
    style.fontFamily = CONFIG.defaultFontFamily;
    style.fontSize = 14;

    // Toggle stroke style depending on whether the text color is dark or light
    const color = 0xFFFFFF;
    const hsv = foundry.utils.rgbToHsv(...foundry.utils.hexToRGB(color));
    style.fill = color;
    style.strokeThickness = 4;
    style.stroke = hsv[2] > 0.6 ? 0x000000 : 0xFFFFFF;
    return style;
  }
}

/* -------------------------------------------- */

export class FishingSpotsLayer extends CanvasLayer {
  async draw() {
    await super.draw();
    this.objects = this.addChild(new PIXI.Container());
    // const dataArray = canvas.scene.getFlag(moduleName, "fishingSpots");
    const dataArray = [ {
      x: 500,
      y: 500,
      fishTableId: "",
      treasureTableId: ""
    }];
    if ( !dataArray || dataArray.length == 0 ) return this;
    for ( let data of dataArray ) {
      const object = new FishingSpotCanvasObject(data);
      await object.draw();
      this.objects.addChild(object);
    }
    return this;
  }
}
