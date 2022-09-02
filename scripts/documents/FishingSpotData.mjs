const fields = foundry.data.fields

export class FishingSpotData extends foundry.abstract.DocumentData {
  static defineSchema() {
    return {
      _id: fields.DOCUMENT_ID,
      scene: {
        ...fields.DOCUMENT_ID,
        required: false,
        nullable: true
      },
      name: fields.REQUIRED_STRING,
      x: fields.REQUIRED_NUMBER,
      y: fields.REQUIRED_NUMBER,
      label: fields.STRING_FIELD,
      icon: fields.IMAGE_FIELD,
      disabled: fields.BOOLEAN_FIELD,
      hidden: fields.BOOLEAN_FIELD
    }
  }

  /** @inheritdoc */
  _initialize () {
    super._initialize()
    this.x = Math.round(this.x)
    this.y = Math.round(this.y)
  }

}
