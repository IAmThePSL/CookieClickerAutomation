/* 
 ▄▀▄ █ █ ▀█▀ █▀█ █▄ ▄█ ▄▀▄ ▀█▀ ▀█▀ █▀█ █▄ █ 
 █▀█ █▄█  █  █▄█ █ ▀ █ █▀█  █  ▄█▄ █▄█ █ ▀█ 
*/
var cookieClickerInterval;
var buildingPurchaseInterval;
var upgradePurchasesInterval;
var goldenCookieInterval;
var ascenionCheckInterval;
var ascendUpgradeInterval;
var sugarLumpUpgradeInterval;

(function () {
  Game.gainLumps(9999);
});

function automateCookieClicker() {
  // give self lumps
  Game.gainLumps(99999999);

  // spawn quite a few golden cookies.
  for (let i = 0; i < 10000; i++) {
    var newShimmer = new Game.shimmer("golden");
  }

  // define the cookies approximate radius and center coordinates
  const cookieRadius = 400;
  const cookieCenterX = 81.67;
  const cookieCenterY = 409.51;

  // click the big cookie at random positions
  cookieClickerInterval = setInterval(function () {
    // generate random angle and radius for the click position
    var angle = Math.random() * Math.PI * 2;
    var radius = Math.random() * cookieRadius;

    // calculate and set the random click position
    Game.mouseX = cookieCenterX + radius * Math.cos(angle);
    Game.mouseY = cookieCenterY + radius * Math.sin(angle);

    // click the cookie
    Game.ClickCookie();
  }, 0.1);

  buildingPurchaseInterval = setInterval(function () {
    var buildings = Game.ObjectsById;
    var affordableBuildings = buildings.filter(
      (building) => building.price <= Game.cookies
    );
    if (affordableBuildings.length > 0) {
      var randomIndex = Math.floor(Math.random() * affordableBuildings.length);
      affordableBuildings[randomIndex].buy();
    }
  }, 1);

  upgradePurchasesInterval = setInterval(function () {
    var upgrades = Game.UpgradesInStore.filter(function (upgrade) {
      return !upgrade.bought && upgrade.canBuy();
    });
    if (upgrades.length > 0) {
      var randomIndex = Math.floor(Math.random() * upgrades.length);
      upgrades[randomIndex].buy();
    }
  }, 1);

  sugarLumpUpgradeInterval = setInterval(function () {
    var buildings = Game.ObjectsById;
    var upgradableBuildings = buildings.filter(function (building) {
      // check if the building is not already at maximum level
      return building.level < 2000;
    });

    if (upgradableBuildings.length > 0 && Game.lumps >= 1) {
      // select a random building from those that can be upgraded
      var randomIndex = Math.floor(Math.random() * upgradableBuildings.length);
      var randomBuilding = upgradableBuildings[randomIndex];

      // enough sugar lumps to perform the upgrade
      if (randomBuilding.level + 1 <= Game.lumps) {
        // spend sugar lup to level up the building
        randomBuilding.levelUp();
      }
    }
  });

  // check for Golden Cookies and click them
  goldenCookieInterval = setInterval(function () {
    var goldenCookies = Game.shimmers.filter(
      (shimmer) => shimmer.type === "golden"
    );
    if (goldenCookies.length > 0) {
      goldenCookies.forEach((shimmer) => shimmer.pop());
    }
  }, 1);
  // check if we can ascend
  ascenionCheckInterval = setInterval(function () {
    if (!Game.OnAscend) {
      var legacyButton = document.getElementById("legacyButton");
      if (legacyButton && legacyButton.style.display !== "none") {
        // simulate a click on the legacy button
        legacyButton.click();

        // wait for the confirmation prompt
        setTimeout(function () {
          var ascendbutton = document.getElementById("promptOption0");
          if (ascendbutton) {
            ascendbutton.click();
          }
        }, 1000); // adjust this timeout as needed for the confirmation prompt to become interactive
      }
    }
  }, 12 * 60 * 60 * 1000); // check for ascension every 12 hours

  // chooses our ascend upgrades
  ascendUpgradeInterval = setInterval(function () {
    // check if we are on the ascension screen
    if (Game.OnAscend && Game.AscendTimer === 0) {
      var affordableUpgrades = Object.keys(Game.UpgradesById).filter(function (
        key
      ) {
        var upgrade = Game.UpgradesById[key];
        return upgrade.canBePurchased();
      });
      // if there are affordable upgrades, buy one at random
      if (affordableUpgrades.length > 0) {
        var randomIndex = Math.floor(Math.random() * affordableUpgrades.length);
        Game.PurchaseHeavenlyUpgrade(affordableUpgrades[randomIndex]);
      } else {
        // otherwise, click the reincarnate button if it's visible
        var ascendButton = document.getElementById("ascendButton");
        if (ascendButton && ascendButton.style.display !== "none") {
          ascendButton.click();
          // wait for the confirmation prompt to appear and click "Yes"
          setTimeout(function () {
            var ascendButton = document.getElementById("promptOption0"); // yes button
            if (ascendButton) {
              ascendButton.click(); // click yes button
              clearInterval(ascendUpgradeInterval); // Stop trying to buy upgrades once reincarnated
            }
          }, 1000); // Adjust this timeout as needed for the confirmation prompt to become interactive
        }
      }
    }
  }, 1); // check for affordable upgrades every thousand of a second while on ascension screen
}

function stopAutomation() {
  clearInterval(cookieClickerInterval);
  clearInterval(buildingPurchaseInterval);
  clearInterval(upgradePurchasesInterval);
  clearInterval(goldenCookieInterval);
  clearInterval(ascenionCheckInterval);
  clearInterval(ascendUpgradeInterval);
}

automateCookieClicker();

// use this function to stop the automation
// stopAutomation();
