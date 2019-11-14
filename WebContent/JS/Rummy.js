var RummyApp = {
    selected: '',
    size: 0,
    index: 100,
    x: 30,
    y: 20, 
    DeckCount: 2
}; 

$(document).ready(function () {
    RummyApp.InitializeGameSetup(); //Initializes game setup, decks, players, all variables 
    $("#BtnStartNewGame").on("click", function () { RummyApp.StartNextGame(); }); 
    $("#BtnCutDeck").on("click", function () { RummyApp.CutDeck(); }); 
    $("#BtnCutJoker").on("click", function () { RummyApp.CutJoker(); }); 
    //$("#BtnShowAllHands").on("click", function () { RummyApp.ShowAllHands(); }); 

}); 

RummyApp.InitializeGameSetup = function () {
    this.DeckCount = 2;
    this.PlayerNamesString = "Baji, Basheer, Abid, Azim, Ameem";
    this.CutOffWeight = 250;
    this.DropWeight = 20;
    this.MiddleDropWeight = 40;
    
    const { DeckCount, PlayerNamesString, CutOffWeight, DropWeight, MiddleDropWeight } = RummyApp;

    this.Pool = new Pool(DeckCount, PlayerNamesString, CutOffWeight, DropWeight, MiddleDropWeight);
   // l(pool.cards);

   // l(RummyApp);
}; 

RummyApp.StartNextGame = function () {
    $("#AllHands").empty(); 
    this.CurrentGame = RummyApp.Pool.startNextGame();
}; 

RummyApp.CutDeck = function () {
    this.CurrentGame.cutDeck(); // At this point of time Players have cards

    //alert("Cards are Dealt press Show All Hands"); 
   // l(RummyApp);
    this.ShowAllHands();
}

RummyApp.CutJoker = function () {
    this.CurrentGame.cutJoker(); // At this point of time Players have cards
    
    if(RummyApp.CurrentGame.gameJoker){
	    $("#PickCardPool").append(`<div style="display:inline-block;"><span class="handLabel" style="margin-left:120px;">Joker</span><div id="joker" class="Hand"></div></div>`); 
    	displayCard(RummyApp.CurrentGame.gameJoker, "joker");
	}
}

RummyApp.ShowAllHands = function () {
   // l(RummyApp.CurrentGame.players); 
    RummyApp.CurrentGame.players.forEach(function (player, i) {
        l(player.name); 
        l($("#AllHands")); 
        $("#AllHands").append(`<div style="display:inline-block;"><span class="handLabel">${player.name}</span><div id="${player.position}Hand" class="Hand"></div></div>`); 

        player.cards.forEach(function (card,i) {
            l(i); 
            l(card); 

            displayCard(card, player.position+"Hand");
        }); 
       // RummyApp.x = RummyApp.x + 180; //to Seperate players hands
        RummyApp.x = 30; 
    }); 

    //display the discards and pick-cards

    $("#PickCardPool").append(`<div style="display:inline-block;"><span class="handLabel">Discards</span><div id="discards" class="Hand"></div></div>`); 
    RummyApp.CurrentGame.discards.forEach(function (card,i) {
        l(i); 
        l(card); 
        displayCard(card, "discards");
    });
    
    $("#PickCardPool").append(`<div style="display:inline-block;"><span class="handLabel">Pick-Cards</span><div id="pickcards" class="Hand"></div></div>`); 
    RummyApp.CurrentGame.cards.forEach(function (card,i) {
        l(i); 
        l(card); 
        displayCard(card, "pickcards");
    });
}; 

function displayCard(card, divId){
    if (card) {
        var paper = document.createElement('article');

        if (card.face === "X") {
            paper.innerHTML = '\
          <input type=button onclick=flip(this.parentNode) ontouchstart=flip(this.parentNode)>\
          <small>'+ card.rank + '</small>\
          <h2 class="Joker">'+ "JKR" + '</h2>\
    <bottom>'+ card.rank + '</bottom>';
        }
        else {
            paper.innerHTML = '\
      <input type=button onclick=flip(this.parentNode) ontouchstart=flip(this.parentNode)>\
      <small>'+ card.rank + ' ' + card.suitUnicode + '</small>\
      <h2>'+ card.rank + ' ' + card.suitUnicode + '</h2>\
<bottom>'+ card.rank + ' ' + card.suitUnicode + '</bottom>';
        }

        paper.setAttribute('data-suit', card.suitUnicode);
        paper.setAttribute('data-card', card.rank);

        paper.style.top = RummyApp.y + 'px';
        paper.style.left = RummyApp.x + 'px';
        $(paper).appendTo($(`#${divId}`));

        //  console.log($(paper));

        //document.body.appendChild(paper)
        paper.addEventListener('mousedown', click);
        paper.addEventListener('touchstart', click);
        // paper.addEventListener('mousemove', drag);
        // paper.addEventListener('touchmove', drag);
        paper.addEventListener('mouseup', release);
        paper.addEventListener('touchend', release);
        RummyApp.y = RummyApp.y;
        RummyApp.x = RummyApp.x + 2;
        paper.setAttribute("data-flip", "flipped");

        $(paper).draggable({
            cursor: 'move',
            //revert: true,
            start: function (event, ui) {
               // ui.helper.data('dropped', false);
            },
            stop: function (event, ui) {
               /* if (ui.helper.data('dropped') === false) {
                    ui.helper.removeClass("snappedCard");
                    console.log(ui.helper);
                }*/
            }
        });
    }
    else {
        l("card not defined"); 
    }
}

//easy to log 
function l(obj) {
    console.log(obj); 
}

function click(e) {
    e.preventDefault();
    if (e.target.nodeName === 'article') {
        RummyApp.selected = Date.now();
        e.target.setAttribute('data-drag', RummyApp.selected);
        e.target.style.zIndex = RummyApp.index++;
    } else if (e.target.nodeName === 'body') {
        RummyApp.selected = '';
    }
}
function drag(e) {
    e.preventDefault();
    if (RummyApp.selected !== '') {

        var cardParent = $(`article[data-drag=${RummyApp.selected}]`).parent().attr('id');

        if (cardParent === "MyHand") {
            var cursorY = (e.clientY || e.touches[0].clientY) - 87.5 - 330; // remove height of the div
        }
        else {
            var cursorY = (e.clientY || e.touches[0].clientY) - 87.5;
        }

        var cursorX = (e.clientX || e.touches[0].clientX) - 62.5,

            element = document.querySelectorAll('[data-drag="' + RummyAppRummyApp.selected + '"]')[0];
        element.style.top = cursorY + 'px';
        element.style.left = cursorX + 'px';

        l(element.style.top);
    }
}
function release(e) {
    element = document.querySelectorAll('[data-drag="' + RummyApp.selected + '"]')[0];
    RummyApp.selected = '';
}
function flip(paper) {
    if (paper.getAttribute('data-flip') == 'flipped') {
        paper.setAttribute('data-flip', '');
    } else {
        paper.setAttribute('data-flip', 'flipped');
    }
}
