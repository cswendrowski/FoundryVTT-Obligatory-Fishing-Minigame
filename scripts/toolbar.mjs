import {FishingSpotControl} from "./layers/FishingSpotControl.mjs";

export const MODE_fishingSpot = 'fishingspot'

export const injectControls = (controls) => {
  // fishingSpot Layer Tools
  const fishingSpotControl = {
    name: 'fishingSpot',
    title: 'fishingSpots.ui.controls.group',
    layer: 'fishingSpots',
    icon: 'fas fa-fish',
    visible: game.user.isGM,
    tools: [
      {
        name: MODE_fishingSpot,
        title: 'fishingSpots.ui.controls.fishingSpot',
        icon: 'fas fa-fish'
      },
      {
        name: 'disabled',
        title: 'fishingSpots.ui.controls.disabled',
        icon: 'fas fa-lock',
        toggle: true,
        active: !!canvas?.fishingspots?._disabled,
        onClick: toggled => { canvas.fishingspots._disabled = toggled }
      },
      {
        name: 'hidden',
        title: 'fishingSpots.ui.controls.hidden',
        icon: 'fas fa-eye-slash',
        toggle: true,
        active: !!canvas?.fishingspots?._hidden,
        onClick: toggled => { canvas.fishingspots._hidden = toggled }
      },
      {
        name: 'clear',
        title: 'fishingSpots.ui.controls.clear',
        icon: 'fas fa-trash',
        onClick: () => canvas.fishingspots.deleteAll(),
        button: true
      }
    ],
    activeTool: 'fishingspot'
  }

  controls.splice(controls.findIndex(e => e.name === 'walls') + 1, 0, fishingSpotControl)
}
