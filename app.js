let areaItemsInformationGlobal = [];
let totalAreaClicks = 0;
let intervalClicks = 0;

let playerInformation = {
  playerHealth: 100,
  totalAreaClicks: 0,
  intervalClicks: 0,
  playerMetrics: {
    internalTemperature: 100,
    rest: 100,
    hydration: 100,
    calories: 100,
  },
  resourceInventory: {
    food: 0,
    wood: 0,
    shelter: 0,
    water: 0,
  },
  actionDurations: {
    fire: 0,
    rest: 0,
  },
  upgrades: {
    lockpick: false,
    saw: false,
    trap: false,
    pot: false,
  },
  upgradeUses: {
    lockpick: 0,
    saw: 0,
    trap: 0,
    pot: 0,
  },
  upgradeUnlocked: {
    lockpick: false,
    saw: false,
    trap: false,
    pot: false,
  },
  upgradeAvailable: {
    lockpick: false,
    saw: false,
    trap: false,
    pot: false,
  },
  totalResourceCollection: {
    food: 0,
    wood: 0,
    shelter: 0,
    water: 0,
  },
};

function start() {
  generateNewAreaItemInformation();
  updateArea();
  updateInventoryPanel();
}

//#region IntervalFunctions
function intervalFunction() {
  updateClock();
  updateTemperature();
  updatePlayerMetrics();
  updatePlayerMetricsColorGradients();
  useTrap();
  updateLockUpgradeScreen();
  updateDisabledUpgradeScreen();
  updateCollectionStatsRankingColor();
  updateUpgradeMessageScreen();
}

function updateClock() {
  let clock = document.getElementById("digital-clock");
  // console.log(clock);
  let currentTimeText = clock.innerText;
  let currentTime = currentTimeText.split(":");
  let currentTimeJoined = "";
  let nextHour = 0;
  if (currentTime[1] == "00") {
    currentTime[1] = "15";
  } else if (currentTime[1] == "15") {
    currentTime[1] = "30";
  } else if (currentTime[1] == "30") {
    currentTime[1] = "45";
  } else if (currentTime[1] == "45") {
    if (parseInt(currentTime[0]) < 23) {
      nextHour = parseInt(currentTime[0]);
      nextHour++;
    }

    currentTime[1] = "00";
    currentTime[0] = nextHour.toString();
  }
  currentTimeJoined = currentTime.join(":");
  clock.innerText = currentTimeJoined;
}

function updateTemperature() {
  let baseTemp = generateBaseTemperature();
  let randomAddition = generateRandomTemperatureAddition();
  let thermometer = document.getElementById("thermometer");
  // console.log(thermometer);
  let totalTemp = (baseTemp + randomAddition).toString();
  thermometer.innerText = totalTemp;
}

function generateBaseTemperature() {
  let thermometer = document.getElementById("thermometer");
  let clock = document.getElementById("digital-clock");
  let currentTimeText = clock.innerText;
  let currentTime = currentTimeText.split(":");
  let currentTimeInt = parseInt(currentTime[0]);
  let baseTemp = 0;
  if (currentTimeInt >= 0 && currentTimeInt < 6) {
    baseTemp = -20;
  } else if (currentTimeInt >= 6 && currentTimeInt < 12) {
    baseTemp = -10;
  } else if (currentTimeInt >= 12 && currentTimeInt < 18) {
    baseTemp = 0;
  } else {
    baseTemp = -10;
  }
  return baseTemp;
}

function generateRandomTemperatureAddition() {
  return Math.floor(Math.random() * 4) - 2;
}

function updatePlayerMetrics() {
  playerInformation.playerMetrics.internalTemperature = calculatePlayerMetricReduction(
    playerInformation.playerMetrics.internalTemperature
  );
  playerInformation.playerMetrics.rest = calculatePlayerMetricReduction(
    playerInformation.playerMetrics.rest
  );
  playerInformation.playerMetrics.hydration = calculatePlayerMetricReduction(
    playerInformation.playerMetrics.hydration
  );
  playerInformation.playerMetrics.calories = calculatePlayerMetricReduction(
    playerInformation.playerMetrics.calories
  );
}

function calculatePlayerMetricReduction(playerMetric) {
  let randomReduction = generateRandomReduction();
  let newPlayerMetric = playerMetric;
  if (newPlayerMetric == 0) {
    newPlayerMetric = 0;
  } else if (newPlayerMetric < randomReduction) {
    newPlayerMetric = 0;
  } else {
    newPlayerMetric -= randomReduction;
  }
  return newPlayerMetric;
}

function generateRandomReduction() {
  return Math.floor(Math.random() * 5);
}

//#region ScreenUpdates

function updateArea() {
  generateAreaHtml();
}

function generateAreaHtml() {
  let areaSpace = document.getElementById("area-space");
  // areaSpace.innerHTML = "";
  let wholeAreaTemplate = /*html*/ `              
              <button class="btn btn-secondary area-button-left" >
                <i class="fas fa-arrow-left"></i>
              </button>
              <button class="btn btn-secondary area-button-right">
                <i class="fas fa-arrow-right"></i>
              </button>`;

  for (let i = 0; i < areaItemsInformationGlobal.length; i++) {
    wholeAreaTemplate += areaItemsInformationGlobal[i].itemTemplate;
  }
  areaSpace.innerHTML = wholeAreaTemplate;
}

//#endregion

//#region AreaItemsObjectGeneration

function generateNewAreaItemInformation() {
  let areaItemObject = generateAreaItemsInformation();
  areaItemsInformationGlobal = areaItemObject;
}

function generateAreaItemsInformation() {
  var numberOfItems = 114;
  var areaItemsInformation = [];
  for (var i = 1; i <= numberOfItems; i++) {
    let item = generateAreaSpaceItem();
    let areaItemObject = {};
    areaItemObject.id = i;
    areaItemObject.type = item;
    if (item == "rabbit") {
      areaItemObject.clicksLeft = 15;
    } else if (item == "tree") {
      areaItemObject.clicksLeft = 20;
    } else if (item == "cave") {
      areaItemObject.clicksLeft = 10;
    } else if (item == "cabin") {
      areaItemObject.clicksLeft = 10;
    } else {
      areaItemObject.clicksLeft = "";
    }
    areaItemObject.itemTemplate = generateAreaSquareTemplate(areaItemObject);
    areaItemsInformation.push(areaItemObject);
  }
  return areaItemsInformation;
}

function generateAreaSquareTemplate(areaItemObject) {
  let areaItemImagePath = generateAreaItemImagePath(areaItemObject.type);
  let visibilityClass = determineVisability(areaItemObject.clicksLeft);
  let template = /*html*/ `
              <div class="area-square pt-1">
                <img
                  class="img-fluid resize-img ${visibilityClass}"
                  src="${areaItemImagePath}"
                  alt=""
                  onclick="detectUserClickOnAreaItem(${areaItemObject.id})"
                />
                <span class="clicks-left ${visibilityClass}">${areaItemObject.clicksLeft}</span>
              </div>`;

  return template;
}

function generateAreaItemImagePath(item) {
  if (item != "") {
    return "images/" + item + ".svg";
  } else {
    return "";
  }
}

function determineVisability(clicksLeft) {
  if (clicksLeft > 0) {
    return "";
  } else {
    return "d-none";
  }
}

function generateAreaSpaceItem() {
  let randomChoice = generateRandomChoice();
  let randomChance = generateRandomChance();
  if (randomChance > 0.8) {
    return randomChoice;
  } else {
    return "";
  }
}

function generateRandomChoice() {
  let choices = ["rabbit", "tree", "cave", "cabin"];
  let randomChoice = Math.floor(Math.random() * 4);
  return choices[randomChoice];
}

function generateRandomChance() {
  let chance = Math.random();
  return chance;
}
//#endregion

//#region UserClickDetection
function detectUserClickOnAreaItem(id, clicksFromTrap = false) {
  totalAreaClicks++;
  let areaItemObjectIndex = getAreaItemIndex(id);
  reduceClicksLeft(areaItemObjectIndex, clicksFromTrap);
  updateInvetory(areaItemObjectIndex);
}

function reduceClicksLeft(areaItemObjectIndex, clicksFromTrap) {
  //add modifiers
  let clickReduction = 1;
  let itemType = areaItemsInformationGlobal[areaItemObjectIndex].type;
  clickReduction += addModifer(itemType, clicksFromTrap);

  areaItemsInformationGlobal[areaItemObjectIndex].clicksLeft -= clickReduction;

  areaItemsInformationGlobal[
    areaItemObjectIndex
  ].itemTemplate = generateAreaSquareTemplate(
    areaItemsInformationGlobal[areaItemObjectIndex]
  );

  updateArea();
}

function getAreaItemIndex(id) {
  for (let i = 0; i < areaItemsInformationGlobal.length; i++) {
    if (areaItemsInformationGlobal[i].id == id) {
      return i;
    }
  }
}

//#endregion

//#region ResourceManagement
function updateInvetory(areaItemObjectIndex) {
  let areaItem = areaItemsInformationGlobal[areaItemObjectIndex];
  if (areaItem.clicksLeft <= 0) {
    if (areaItem.type == "rabbit") {
      playerInformation.resourceInventory.food++;
      playerInformation.totalResourceCollection.food++;
    } else if (areaItem.type == "tree") {
      playerInformation.resourceInventory.wood++;
      playerInformation.totalResourceCollection.wood++;
    } else if (areaItem.type == "cave") {
      playerInformation.resourceInventory.shelter++;
      playerInformation.totalResourceCollection.shelter++;
    } else if (areaItem.type == "cabin") {
      playerInformation.resourceInventory.food++;
      playerInformation.resourceInventory.water++;
      playerInformation.totalResourceCollection.food++;
      playerInformation.totalResourceCollection.water++;
    }
    updateInventoryPanel();
    updateTotalCollectionStats();
  }
}

function updateInventoryPanel() {
  document.getElementById(
    "food-inventory"
  ).innerText = playerInformation.resourceInventory.food.toString();
  document.getElementById(
    "wood-inventory"
  ).innerText = playerInformation.resourceInventory.wood.toString();
  document.getElementById(
    "shelter-inventory"
  ).innerText = playerInformation.resourceInventory.shelter.toString();
  document.getElementById(
    "water-inventory"
  ).innerText = playerInformation.resourceInventory.water.toString();
}

function updateTotalCollectionStats() {
  document.getElementById(
    "food-clicks"
  ).innerText = playerInformation.totalResourceCollection.food.toString();
  document.getElementById(
    "wood-clicks"
  ).innerText = playerInformation.totalResourceCollection.wood.toString();
  document.getElementById(
    "shelter-clicks"
  ).innerText = playerInformation.totalResourceCollection.shelter.toString();
  document.getElementById(
    "water-clicks"
  ).innerText = playerInformation.totalResourceCollection.water.toString();
}

function updateCollectionStatsRankingColor() {
  updateResourceRank(
    playerInformation.totalResourceCollection.food,
    "food-rank"
  );
  updateResourceRank(
    playerInformation.totalResourceCollection.wood,
    "food-rank"
  );
  updateResourceRank(
    playerInformation.totalResourceCollection.shelter,
    "food-rank"
  );
  updateResourceRank(
    playerInformation.totalResourceCollection.water,
    "food-rank"
  );
}

function updateResourceRank(resourceCount, id) {
  if (resourceCount >= 3 && resourceCount < 5) {
    document.getElementById(id).style.background = "brown";
  } else if (resourceCount >= 5 && resourceCount < 7) {
    document.getElementById(id).style.background = "silver";
  } else if (resourceCount >= 7) {
    document.getElementById(id).style.background = "gold";
  }
}

//#endregion

//#region ActionsAndUpgrades

function eatFood() {
  if (playerInformation.resourceInventory.food > 0) {
    playerInformation.resourceInventory.food--;
    playerInformation.playerMetrics.calories += 10;
    updateInventoryPanel();
  }
}

function startFire() {
  if (
    playerInformation.resourceInventory.shelter > 0 &&
    playerInformation.resourceInventory.wood > 0
  ) {
    // playerInformation.actionDurations.fire = +4;
    playerInformation.resourceInventory.shelter--;
    playerInformation.resourceInventory.wood--;
    playerInformation.playerMetrics.internalTemperature += 10;
    usePotToMeltSnow();
    updateInventoryPanel();
  }
}

function rest() {
  if (playerInformation.resourceInventory.shelter > 0) {
    // playerInformation.actionDurations.rest += 1;
    playerInformation.resourceInventory.shelter--;
    playerInformation.playerMetrics.rest += 10;
    updateInventoryPanel();
  }
}

function drinkWater() {
  if (playerInformation.resourceInventory.water != 0) {
    playerInformation.resourceInventory.water--;
    playerInformation.playerMetrics.hydration += 10;
    updateInventoryPanel();
  }
}

function updateLockUpgradeScreen() {
  determineUpgradeUnlock();
  let lockpickButtonImage = document.getElementById("lockpick-image");
  let sawButtonImage = document.getElementById("saw-image");
  let trapButtonImage = document.getElementById("trap-image");
  let potButtonImage = document.getElementById("pot-image");

  if (playerInformation.upgradeUnlocked.lockpick == true) {
    lockpickButtonImage.src = "images/lockpick.svg";
  }
  if (playerInformation.upgradeUnlocked.saw == true) {
    sawButtonImage.src = "images/saw.svg";
  }
  if (playerInformation.upgradeUnlocked.trap == true) {
    trapButtonImage.src = "images/animal.svg";
  }
  if (playerInformation.upgradeUnlocked.pot == true) {
    potButtonImage.src = "images/pot.svg";
  }
}

function determineUpgradeUnlock() {
  if (
    playerInformation.upgradeUnlocked.lockpick == false &&
    playerInformation.resourceInventory.shelter > 0 &&
    playerInformation.resourceInventory.wood > 0
  ) {
    playerInformation.upgradeUnlocked.lockpick = true;
  }

  if (
    playerInformation.upgradeUnlocked.saw == false &&
    playerInformation.resourceInventory.shelter > 0 &&
    playerInformation.resourceInventory.water > 0
  ) {
    playerInformation.upgradeUnlocked.saw = true;
  }

  if (
    playerInformation.upgradeUnlocked.trap == false &&
    playerInformation.resourceInventory.shelter > 0 &&
    playerInformation.resourceInventory.water > 0
  ) {
    playerInformation.upgradeUnlocked.trap = true;
  }

  if (
    playerInformation.upgradeUnlocked.pot == false &&
    playerInformation.resourceInventory.food > 0 &&
    playerInformation.resourceInventory.wood > 0
  ) {
    playerInformation.upgradeUnlocked.pot = true;
  }
}

function updateDisabledUpgradeScreen() {
  determineUpgradeAvailability();
  let lockpickButton = document.getElementById("lockpick-button");
  let sawButton = document.getElementById("saw-button");
  let trapButton = document.getElementById("trap-button");
  let potButton = document.getElementById("pot-button");

  if (playerInformation.upgradeAvailable.lockpick == false) {
    lockpickButton.disabled = true;
  } else {
    lockpickButton.disabled = false;
  }
  if (playerInformation.upgradeAvailable.saw == false) {
    sawButton.disabled = true;
  } else {
    sawButton.disabled = false;
  }
  if (playerInformation.upgradeAvailable.trap == false) {
    trapButton.disabled = true;
  } else {
    trapButton.disabled = false;
  }
  if (playerInformation.upgradeAvailable.pot == false) {
    potButton.disabled = true;
  } else {
    potButton.disabled = false;
  }
}

function determineUpgradeAvailability() {
  if (
    playerInformation.upgradeUnlocked.lockpick == true &&
    playerInformation.resourceInventory.shelter > 0 &&
    playerInformation.resourceInventory.wood > 0
  ) {
    playerInformation.upgradeAvailable.lockpick = true;
  } else {
    playerInformation.upgradeAvailable.lockpick = false;
  }

  if (
    playerInformation.upgradeUnlocked.saw == true &&
    playerInformation.resourceInventory.shelter > 0 &&
    playerInformation.resourceInventory.water > 0
  ) {
    playerInformation.upgradeAvailable.saw = true;
  } else {
    playerInformation.upgradeAvailable.saw = false;
  }

  if (
    playerInformation.upgradeUnlocked.trap == true &&
    playerInformation.resourceInventory.shelter > 0 &&
    playerInformation.resourceInventory.water > 0
  ) {
    playerInformation.upgradeAvailable.trap = true;
  } else {
    playerInformation.upgradeAvailable.trap = false;
  }

  if (
    playerInformation.upgradeUnlocked.pot == true &&
    playerInformation.resourceInventory.food > 0 &&
    playerInformation.resourceInventory.wood > 0
  ) {
    playerInformation.upgradeAvailable.pot = true;
  } else {
    playerInformation.upgradeAvailable.pot = false;
  }
}

function enableModifer(upgrade) {
  if (
    upgrade == "lockpick" &&
    playerInformation.upgrades.lockpick == false &&
    playerInformation.resourceInventory.shelter > 0 &&
    playerInformation.resourceInventory.wood > 0
  ) {
    playerInformation.resourceInventory.shelter--;
    playerInformation.resourceInventory.wood--;
    playerInformation.upgrades.lockpick = true;
    playerInformation.upgradeUses.lockpick = 10;
  } else if (
    upgrade == "saw" &&
    playerInformation.upgrades.saw == false &&
    playerInformation.resourceInventory.shelter > 0 &&
    playerInformation.resourceInventory.water > 0
  ) {
    playerInformation.resourceInventory.shelter--;
    playerInformation.resourceInventory.water--;
    playerInformation.upgrades.saw = true;
    playerInformation.upgradeUses.saw = 10;
  } else if (
    upgrade == "trap" &&
    playerInformation.upgrades.trap == false &&
    playerInformation.resourceInventory.shelter > 0 &&
    playerInformation.resourceInventory.water > 0
  ) {
    playerInformation.resourceInventory.shelter--;
    playerInformation.resourceInventory.water--;
    playerInformation.upgrades.trap = true;
    playerInformation.upgradeUses.trap = 10;
  } else if (
    upgrade == "pot" &&
    playerInformation.upgrades.pot == false &&
    playerInformation.resourceInventory.food > 0 &&
    playerInformation.resourceInventory.wood > 0
  ) {
    playerInformation.resourceInventory.food--;
    playerInformation.resourceInventory.wood--;
    playerInformation.upgrades.pot = true;
    playerInformation.upgradeUses.pot = 5;
  }
  updateInventoryPanel();
}

function addModifer(areaItemType, clicksFromTrap) {
  let up = playerInformation.upgrades;
  let us = playerInformation.upgradeUses;
  if (areaItemType == "tree" && up.saw == true && us.saw > 0) {
    playerInformation.upgradeUses.saw--;
    checkModifierUses("saw");
    return 5;
  } else if (
    areaItemType == "cabin" &&
    up.lockpick == true &&
    us.lockpick > 0
  ) {
    playerInformation.upgradeUses.lockpick--;
    checkModifierUses("lockpick");
    return 6;
  } else if (areaItemType == "rabbit" && clicksFromTrap) {
    playerInformation.upgradeUses.trap--;
    checkModifierUses("trap");
    return 5;
  } else {
    return 0;
  }
}

function usePotToMeltSnow() {
  let ri = playerInformation.resourceInventory;
  let up = playerInformation.upgrades;
  let us = playerInformation.upgradeUses;
  if (up.pot == true && us.pot > 0) {
    playerInformation.upgradeUses.pot--;
    checkModifierUses("pot");
    playerInformation.resourceInventory.water++;
  }
}

function useTrap() {
  let ri = playerInformation.resourceInventory;
  let up = playerInformation.upgrades;
  let us = playerInformation.upgradeUses;

  if (up.trap == true && us.trap > 0) {
    for (let i = 0; i < areaItemsInformationGlobal.length; i++) {
      if (
        areaItemsInformationGlobal[i].type == "rabbit" &&
        areaItemsInformationGlobal[i].clicksLeft > 0
      ) {
        detectUserClickOnAreaItem(areaItemsInformationGlobal[i].id, true);
        break;
      }
    }
  }
}

function checkModifierUses(upgrade) {
  if (playerInformation.upgradeUses[upgrade] == 0) {
    playerInformation.upgrades[upgrade] = false;
  }
}

function updateUpgradeMessageScreen() {
  document.getElementById(
    "message-screen"
  ).innerHTML = generateMessageScreenTemplate();
}

function generateMessageScreenTemplate() {
  let template = "";
  if (playerInformation.upgrades.lockpick) {
    template += /*html*/ `<p>Lockpick +6 to cabin click: ${playerInformation.upgradeUses.lockpick} left </p>`;
  } else if (playerInformation.upgradeUnlocked.lockpick) {
    template += /*html*/ `<p>Lock requires 1 shelter + 1 wood</p>`;
  }
  if (playerInformation.upgrades.saw) {
    template += /*html*/ `<p>Saw +5 to tree click: ${playerInformation.upgradeUses.saw} left </p>`;
  } else if (playerInformation.upgradeUnlocked.saw) {
    template += /*html*/ `<p>Saw requires 1 shelter + 1 water</p>`;
  }
  if (playerInformation.upgrades.trap) {
    template += /*html*/ `<p>Trap Automatic +5 to rabbit click: ${playerInformation.upgradeUses.trap} left </p>`;
  } else if (playerInformation.upgradeUnlocked.trap) {
    template += /*html*/ `<p>Trap requires 1 shelter + 1 water</p>`;
  }
  if (playerInformation.upgrades.pot) {
    template += /*html*/ `<p>Pot Automatic +1 to water per fire started: ${playerInformation.upgradeUses.pot} left </p>`;
  } else if (playerInformation.upgradeUnlocked.pot) {
    template += /*html*/ `<p>Pot requires 1 shelter + 1 water</p>`;
  }

  return template;
}

//#endregion

//#region ColorGradients

function updatePlayerMetricsColorGradients() {
  let internalTempColorGradient = generateColorGradientString(
    playerInformation.playerMetrics.internalTemperature
  );
  let restColorGradient = generateColorGradientString(
    playerInformation.playerMetrics.rest
  );
  let hydrationColorGradient = generateColorGradientString(
    playerInformation.playerMetrics.hydration
  );
  let caloriesColorGradient = generateColorGradientString(
    playerInformation.playerMetrics.calories
  );

  document.getElementById(
    "internal-temp-metric"
  ).style.background = internalTempColorGradient;
  document.getElementById("rest-metric").style.background = restColorGradient;
  document.getElementById(
    "hydration-metric"
  ).style.background = hydrationColorGradient;
  document.getElementById(
    "calories-metric"
  ).style.background = caloriesColorGradient;
}

function generateColorGradientString(playerMetric) {
  let blackPercent = playerMetric;
  let colorPercent = 100 - playerMetric;
  let colorGradient =
    "linear-gradient(to right, black " +
    blackPercent +
    "%, var(--claret) " +
    colorPercent +
    "%)";
  return colorGradient;
}

//#endregion

start();

setInterval(intervalFunction, 2000);
