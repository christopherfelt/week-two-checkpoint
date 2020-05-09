let areaItemsInformation = {};

// function gameCalculations() {}
function drawGame() {
  generateArea();
}

// function start() {}

// function update() {}

function generateArea() {
  // let areaItemObject = generateAreaItemsInformation();

  let areaSpace = document.getElementById("area-space");
  let wholeAreaTemplate = /*html*/ `              
              <button class="btn btn-secondary area-button-left" >
                <i class="fas fa-arrow-left"></i>
              </button>
              <button class="btn btn-secondary area-button-right">
                <i class="fas fa-arrow-right"></i>
              </button>`;

  let numberOfSquares = 114;
  for (let i = 1; i <= numberOfSquares; i++) {
    wholeAreaTemplate += generateAreaSquareTemplate();
  }
  areaSpace.innerHTML = wholeAreaTemplate;
  //   return wholeArea;
}

function generateAreaSquareTemplate(id, item) {
  let areaItem = generateAreaSpaceItem();
  let template = /*html*/ `
              <div class="area-square pl-3 pt-3">
                <img
                  class="img-fluid resize-img"
                  src="${areaItem}"
                  alt=""
                />
              </div>`;
  return template;
}

function generateAreaItemsInformation() {
  var numberOfItems = 114;
  var areaItemsInformation = [];
  var areaItemObject;
  for (var i = 1; i < numberOfItems; i++) {
    let item = generateAreaSpaceItem();
    areaItemObject = {};
    areaItemObject["id"] = i;
    areaItemObject["type"] = item;
    if (item == "rabbit") {
      areaItemObject["clicksLeft"] = 15;
    } else if (item == "tree") {
      areaItemObject["clicksLeft"] = 40;
    } else if (item == "cave") {
      areaItemObject["clicksLeft"] = 20;
    } else if (item == "cabin") {
      areaItemObject["clicksLeft"] = 50;
    }
    //   need to fix generateAreaSquareTemplate function
    areaItemObject["itemTemplate"] = generateAreaSquareTemplate(i, item);
    areaItemsInformation.push(areaItemObject);
  }
  return areaItemsInformation;
}

function generateAreaSpaceItem() {
  let randomChoice = generateRandomChoice();
  let randomChance = generateRandomChance();
  if (randomChance > 0.8) {
    return "images/" + randomChoice + ".svg";
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

//onclick with id to reduce number of clicks
//add object with generate
// let areaItemsInformation = [
//     {
//         id: 1,
//         clicksLeft: 23,
//         itemTemplate: 'template'
//          itemType
//     }
// ];
// if clicks equal zero then display = none

// let thing = randomChance();
// console.log(thing);

// let thing = generateArea();
// console.log(thing);

drawGame();
