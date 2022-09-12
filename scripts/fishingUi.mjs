import {systemShim} from "./systemShims/theRealShimShady.mjs";

export const moduleName = "obligatory-fishing-minigame";

export class FishingUi {
  static app = null;

  static run(callback=()=>{}) {
    this.app = new FishingApplication(callback, {});
    this.app.render(true);
  }
}

/* -------------------------------------------- */

class FishingApplication extends Application {

  constructor(callback, options) {
    super(options);

    this.callback = callback;

    // Settings data
    this.fish = {
      jumpRange: 100, // Jumping range, between 0-100, lower means less movement
      speed: 1000, // Movement speed in ms
      depth: 20, // Spawn starting percentage
      movepremsec: 1500, // How often the Fish changes position
      codEmperor: false, // Is the fish the mythical Cod Emperor?
    };
    this.rod = {
      reeling: false,
      reelPower: 10, // Bait move speed. Higher = easier
      baitWeight: 1, // Bait weight. Lower = Faster
      progress: 2, // Progress gain percentage per interval
      progressPenalty: 0, // Progress loss percentage per interval
      progressUpdateRate: 200, // Progress bar update rate
      progressUpdated: false
    }

    // Is this the mythical Cod Emperor?
    const result = Math.floor(Math.random() * 1002) + 1;
    if (result === 1002) {
      this.fish.speed = 500;
      this.fish.movepremsec = 2000;
      this.rod.progress = 1;
      this.rod.progressPenalty = 2;
      this.fish.codEmperor = true;
      ui.notifications.warn("You have encountered the mythical Cod Emperor - prepare for a fight!");
    }

    // adjust for PC
    if ( game.user.character ) {
      const shim = systemShim(game.user.character);
      if ( shim ) {
        // Mod values tend to range from -2 to +5
        this.rod.progress = Math.min(15, this.rod.progress + shim.str);
        this.rod.baitWeight = Math.max(0.5, this.rod.baitWeight - (shim.con * 0.1));
        this.fish.speed = Math.min(1500, this.fish.speed + (shim.wis * 100));
        this.fish.jumpRange = Math.min(50, this.fish.jumpRange - (shim.cha * 5));
        this.fish.movepremsec = Math.min(2000, this.fish.movepremsec + (shim.dex * 200));
      }
    }

    // Setup timers
    this.baitTimer = null;
    this.moveFishTimer = null;
    this.progressBarTimeout = null;

    // Start interactivity
    // Move bait up if reeling
    this.baitTimer = setInterval(() => {
      if ( !window.obligatoryFishingMinigame.reeling ) {
        $(".fishing .rod .reel .handle").removeClass("reelin");
        $("#bait").stop(true);
        this.reelgravity(this);
        this.checkOverlapping(this);
        return;
      }
      $(".fishing .rod .reel .handle")
        .removeClass("reelout")
        .addClass("reelin");
      $("#bait").animate(
        { top: "-=" + $(".fishing").data("reelpower") + "%" },
        {
          easing: "linear",
          step: (now) => {
            if (now <= 0) $("#bait").stop(true);
            this.checkOverlapping(this);
          }
        }
      );
    }, 400);

    // Move fish
    this.moveFishTimer = setInterval(() => {
      if ( this.fish.codEmperor ) {
        $(".fish")[0].classList.add("cod-emperor");
      }
      let currentposition = parseInt($(".fishing .sea .fish")[0].style.top);
      let movedirection =
        Math.floor(Math.random() * currentposition) +
        Math.abs(
          currentposition - this.fish.jumpRange
        );
      $(".fishing .sea .fish").animate(
        { top: (movedirection <= 89 ? movedirection : 89) + "%" },
        {
          duration: this.fish.speed,
          step: function (now) {
            if ( now <= 0 ) $(".fishing .sea .fish").stop(true);
          }
        }
      );
    }, this.fish.movepremsec);
  }

  /* -------------------------------------------- */

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      title: "",
      template: `modules/${moduleName}/templates/fishing-ui.html`,
      height: '550',
      width: '150',
      popOut: true,
      minimizable: false,
      resizable: false,
      popOutModuleDisable: true,
      classes: [ "fishing-ui" ]
    });
  }

  /* -------------------------------------------- */

  /** @override **/
  async close(options = {}) {
    this.reset();
    return super.close(options);
  }

  /* -------------------------------------------- */

  progressbar(app, overlapping) {
    let progressbarheight = parseFloat($(".fishing .progress .bar")[0].style.height);
    if ( overlapping ) {
      if ( progressbarheight < 100 ) {
        $(".fishing .progress .bar").animate(
          {
            height: progressbarheight + $(".fishing").data("progress") + "%"
          },
          $(".fishing").data("progressupdaterate"),
          "linear"
        );
      } else {
        this.fishCaught();
      }
    } else {
      if ( progressbarheight > 0 ) {
        $(".fishing .progress .bar").animate(
          {
            height:
              progressbarheight - app.rod.progressPenalty + "%"
          },
          app.rod.progressUpdateRate,
          "linear"
        );
      }
    }
    app.rod.progressUpdated = false;
  }

  /* -------------------------------------------- */

  reelgravity(app) {
    let baitHeight = parseFloat($("#bait")[0]?.style?.top);
    if ( baitHeight < 78.5 ) {
      $(".fishing .rod .reel .handle").addClass("reelout");
    }
    else {
      $(".fishing .rod .reel .handle").removeClass("reelout");
    }
    $("#bait")
      .animate(
        {top: "79%"},
        {
          duration: parseInt(app.rod.baitWeight) * 1000,
          complete: function () {
            $(".fishing .rod .reel .handle").removeClass("reelout");
          },
          step: (now) => {
            app.checkOverlapping(app);
          }
        }
      );
  }

  /* -------------------------------------------- */

  checkOverlapping(app) {
    let bait = $("#bait")[0];
    if ( !bait ) return;
    let baitbound = bait.getBoundingClientRect();
    let fishbound = $(".fishing .sea .fish")[0].getBoundingClientRect();
    let overlaping = !(
      baitbound.right < fishbound.left ||
      baitbound.left > fishbound.right ||
      baitbound.bottom < fishbound.top ||
      baitbound.top > fishbound.bottom
    );
    if ( !app.rod.progressUpdated ) {
      app.rod.progressUpdated = true;
      clearTimeout(app.progressBarTimeout);
      app.progressBarTimeout = setTimeout(function () {
        app.progressbar(app, overlaping);
      }, app.rod.progressUpdateRate);
    }
  }

  /* -------------------------------------------- */

  reset() {
    clearInterval(this.baitTimer);
    clearInterval(this.moveFishTimer);
    clearTimeout(this.progressBarTimeout);
    $(".fishing .progress .bar").css("height", "0%");
  }

  /* -------------------------------------------- */
  fishCaught() {
    this.callback(this.fish.codEmperor);
    this.reset();
    this.close();
  }
}
