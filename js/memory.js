var $field = $("#playfield");
var $hud = $("#hud");
var cardFaces = ["🍟", "😃", "😈", "🤠", "🤖", "👽", "😴", "🤔", "😡", "🤑", "😇", "💩"];
var matches = 0;
var toWin = 12;
var cheating = false; // For debug 

// Sounds
var sounds = {
  success: 'audio/success.wav',
  flip: 'audio/flip.wav',
  shuffle: 'audio/shuffle.wav',
  win: 'audio/win.wav'
};
// Add audio elements to body and save them for control
_.each(sounds, (sound, i) => {
  var $audioElem = $(`<audio src="${sound}"></audio>`);
  $audioElem.insertAfter($field);
  sounds[i] = $audioElem.get(0);
})


// Generate the structured data to populate the cards
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
    sounds.win.play();

    var $cards = $field.children();

    $cards.removeClass('shown done').addClass('hidden');


    $field.addClass("win");

    setTimeout(()=> $field.removeClass('win'), 2500);
    setTimeout(() =>reset(), 4500);
  }
}

// Helper function to show a given card
function showCard($card) {
  $card.removeClass("hidden").addClass("shown");
  sounds.flip.play();
}

// Helper function to hide a given card

function hideCard($card) {
  $field.addClass("paused");

  // Let the player see the card for a few seconds before reverting
  setTimeout(()=> {
    $card.removeClass("shown guess pick").addClass("hidden");
    $field.removeClass("paused");
    sounds.flip.play();
    updateHud("Pick another card");
  }, 1100);
}

// Accept a click event and figure out what to do about it
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
    return; // Clicked a shown card
  }
  else if ($pick.length === 0) {
    // We're picking
    showCard($clicked);
    $clicked.addClass("pick");
    updateHud("Now find its match");
  } else {
    // We're guessing
    var pickedId = $pick.data("id"),
        guessedId = $clicked.data("id");

    // Show the clicked card
    showCard($clicked);
    $clicked.addClass("guess");

    // Was it a match?
    if (pickedId !== guessedId) {
      // Wrong guess
      updateHud("Whoops!");
      hideCard($clicked);
      hideCard($pick);

    } else {
      // Match!
      matches++;
      setTimeout(()=> sounds.success.play(), 400);
      updateHud("Nice job! Pick another card");
      checkWinState();

      $cards.removeClass("guess pick");
      $pick.add($clicked).addClass("done");
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
  sounds.shuffle.play();
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
  $field.empty().removeClass("paused win");;
  placeCards(cards);
  updateHud("Pick a card");
  
}

// Update the hud with game status
function updateHud(message = "") {
  $hud.html(`Matches: <b>${matches}/${toWin}</b> <span>${message}</span>`);
}

reset();
