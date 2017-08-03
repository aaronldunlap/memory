var $field = $("#playfield");
var $hud = $("#hud");
var cardFaces = ["🍟", "😃", "😈", "🤠", "🤖", "👽", "😴", "🤔", "😡", "🤑", "😇", "💩"];
var matches = 0;
var toWin = 12;
var cheating = false; // For debug 

function buildCards() {
  var cards = [];

  // Build out the 12 unique cards
  cardFaces.forEach((face, id)=> {
    cards.push({ face, id });
  });

  // Duplicate them so there's 24
  cards = _.concat(cards, cards);

  // Shuffle them
  if (!cheating) cards = _.shuffle(cards);
  else cards = _.sortBy(cards, 'face');

  return cards;
}

// See if the user just won
function checkWinState() {
  if (matches === toWin) {
    alert("Congratulations!");
    reset();
  }
}

function checkClickedCard(e) {
  var $cards = $field.find(".card"),
      $pick = $cards.filter(".pick"),
      $clicked = $(e.target).parent(".card");

  // Infer game state
  if ($field.hasClass("paused")) {
    updateHud("Wait a moment");
    return;
  }
  else if ($clicked.hasClass("shown")) {
    return;
  }
  else if ($pick.length === 0) {
    // We're picking
    $clicked.removeClass("hidden").addClass("shown pick");
    updateHud("Now find its match");
  } else {
    // We're guessing
    var pickedId = $pick.data("id"),
        guessedId = $clicked.data("id");

    // Show the clicked card
    $clicked.removeClass("hidden").addClass("shown guess");

    // Was it a match?
    if (pickedId !== guessedId) {
      // Wrong guess
      $field.addClass("paused");
      updateHud("Whoops!");

      // Let the player see the card for a few seconds before reverting
      setTimeout(()=> {
        $clicked.add($pick).removeClass("shown guess pick").addClass("hidden");
        $field.removeClass("paused");
        updateHud("Pick another card");
      }, 1100);

    } else {
      // Match!
      matches++;
      updateHud("Nice job! Pick another card");
      checkWinState();

      $cards.removeClass("guess pick");
    }
  }
}

// Generate the dom elements for the cards and place them on the page
function placeCards(cards) {
  cards.forEach((card)=> {

    var $cardDom = $(`<div class="card hidden" data-id="${card.id}">
                        <div class="back"></div>
                        <div class="face">${card.face}</div>
                     </div>`);

    $cardDom.click(checkClickedCard);
    $field.append($cardDom);

  });
}
// Helper to let you cruise through the play
window.cheat = function() {
  cheating = true;
  reset();
  updateHud("Cheat mode: Matches placed together");
}

// Clear the table and add new cards
function reset() {
  matches = 0;
  let cards = buildCards();
  $field.empty();
  placeCards(cards);
  updateHud("Pick a card");
  
}

// Update the hud with game status
function updateHud(message = "") {
  $hud.html(`Matches: <b>${matches}/${toWin}</b> <span>${message}</span>`);
}

reset();
