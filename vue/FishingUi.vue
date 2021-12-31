<template>
  <div class="fishing" data-reelpower="10" data-baitweight="1" data-progress="2" data-progresspenalty="3" data-progressupdaterate="200">
    <div class="rod">
      <div class="reel">
        <div class="handle"></div>
      </div>
    </div>
    <div class="sea">
      <div class="area">
        <div class="bait" id="bait"></div>
        <div class="fish" data-movepremsec="1500" data-jumprange="100" data-speed="1000" data-depth="20" ><i class="fas fa-fish"></i></div>
      </div>
    </div>
    <div class="progress">
      <div class="area">
        <div class="bar" style="height:0%"></div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data: () => ({
    fish: {
      jumpRange: 100, // Jumping range, between 0-100, lower means less movement
      speed: 1000, // Movement speed in ms
      depth: 20, // Spawn starting percentage
      movepremsec: 1500 // How often the Fish changes position
    },
    rod: {
      reeling: false,
      reelPower: 10, // Bait move speed. Higher = easier
      baitWeight: 1, // Bait weight. Lower = Faster
      progress: 2, // Progress gain percentage per interval
      progressPenalty: 3, // Progress loss percentage per interval
      progressUpdateRate: 200, // Progress bar update rate
      progressUpdated: false
    }
  }),
  methods: {
    progressbar: (app, overlapping) => {
      let progressbarheight = parseFloat($(".fishing .progress .bar")[0].style.height);
      if (overlapping) {
        if (progressbarheight < 100) {
          $(".fishing .progress .bar").animate(
              {
                height: progressbarheight + $(".fishing").data("progress") + "%"
              },
              $(".fishing").data("progressupdaterate"),
              "linear"
          );
        }
        else {
          ui.notification.info("Fish Caught!");
        }
      }
      else {
        if (progressbarheight > 0) {
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
    },
    reelgravity: (app) => {
      $(".fishing .rod .reel .handle").addClass("reelout");
      $("#bait")
          .animate(
              { top: "79%" },
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
    },
    checkOverlapping: (app) => {
      let baitbound = $("#bait")[0].getBoundingClientRect();
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
  },
  computed: {
    fishStyle() {
      return `top: ${this.fish.depth};`;
    }
  },
  watch: {
  },
  async created() {
    this.log = window.obligatoryFishingMinigame.log;

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

  },
  async mounted() {

  },
  destroyed() {
    clearInterval(this.baitTimer);
    clearInterval(this.moveFishTimer);
    clearTimeout(this.progressBarTimeout);
    console.log("Destroyed");
  }
};
</script>
