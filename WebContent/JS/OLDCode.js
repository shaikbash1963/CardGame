var Rummy = {
    suit: ['♥', '♦', '♠', '♣'],
    card: ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K'],
    joker: ['🃏'],
    shuffle: [],
    selected: '',
    size: 0,
    index: 100,
    x: 30,
    y: 20
};

$(document).ready(function () {
    buildDeck(); // Build Deck when DOM is ready 

    $("article").draggable({
        cursor: 'move',
        revert: true,
        start: function (event, ui) {
            ui.helper.data('dropped', false);
        },
        stop: function (event, ui) {
            if (ui.helper.data('dropped') === false) {
                ui.helper.removeClass("snappedCard");
                console.log(ui.helper);
            }
        }
    });
});


$(".dropabbleArea").droppable({
    accept: 'article',
    hoverClass: 'hovered',
    drop: handleCardDrop
});

function handleCardDrop(event, ui) {

    ui.helper.data('dropped', true);
    ui.draggable.position({
        of: $(this), my: 'left top', at: 'left top'
    });

    ui.draggable.addClass("snappedCard");
    ui.draggable.draggable('option', 'revert', false);
}

function buildDeck() {
    ResetGame();

    for (i = 0; i < Rummy.suit.length; i++) {
        for (j = 0; j < Rummy.card.length; j++) {
            Rummy.shuffle.push([Rummy.suit[i], Rummy.card[j]]);
            Rummy.size = Rummy.shuffle.length;
        }
    }

    Rummy.shuffle.push([Rummy.joker[0], 'Joker']);
    Rummy.shuffle.push([Rummy.joker[0], 'Joker']);
    Rummy.size = Rummy.shuffle.length;
    // console.log(shuffle);

    $("#Decks").append($("<div class='Deck'>"));

    for (k = 0; k < Rummy.size; k++) {
        var pick = Math.floor(Math.random() * Rummy.shuffle.length);


        var paper = document.createElement('article');

        //console.log(shuffle[pick][1]);
        if (Rummy.shuffle[pick][1] === "Joker") {
            paper.innerHTML = '\
                  <input type=button onclick=flip(this.parentNode) ontouchstart=flip(this.parentNode)>\
                  <small>'+ Rummy.shuffle[pick][1] + '</small>\
                  <h2 class="Joker">'+ Rummy.shuffle[pick][0] + '</h2>\
            <bottom>'+ Rummy.shuffle[pick][1] + '</bottom>';
        }
        else {
            paper.innerHTML = '\
              <input type=button onclick=flip(this.parentNode) ontouchstart=flip(this.parentNode)>\
              <small>'+ Rummy.shuffle[pick][1] + Rummy.shuffle[pick][0] + '</small>\
              <h2>'+ Rummy.shuffle[pick][1] + Rummy.shuffle[pick][0] + '</h2>\
        <bottom>'+ Rummy.shuffle[pick][1] + Rummy.shuffle[pick][0] + '</bottom>';
        }

        paper.setAttribute('data-suit', Rummy.shuffle[pick][0]);
        paper.setAttribute('data-card', Rummy.shuffle[pick][1]);
        Rummy.shuffle.splice(pick, 1);
        paper.style.top = Rummy.y + 'px';
        paper.style.left = Rummy.x + 'px';
        $(paper).appendTo($("#Decks"));

        //  console.log($(paper));

        //document.body.appendChild(paper)
        paper.addEventListener('mousedown', click);
        paper.addEventListener('touchstart', click);
        // paper.addEventListener('mousemove', drag);
        // paper.addEventListener('touchmove', drag);
        paper.addEventListener('mouseup', release);
        paper.addEventListener('touchend', release);
        Rummy.y = Rummy.y;
        Rummy.x = Rummy.x + 2;
    }
}
function click(e) {
    e.preventDefault();
    if (e.target.nodeName === 'article') {
        Rummy.selected = Date.now();
        e.target.setAttribute('data-drag', Rummy.selected);
        e.target.style.zIndex = Rummy.index++;
    } else if (e.target.nodeName === 'body') {
        Rummy.selected = '';
    }
}
function drag(e) {
    e.preventDefault();
    if (Rummy.selected !== '') {

        var cardParent = $(`article[data-drag=${Rummy.selected}]`).parent().attr('id');

        if (cardParent === "MyHand") {
            var cursorY = (e.clientY || e.touches[0].clientY) - 87.5 - 330; // remove height of the div
        }
        else {
            var cursorY = (e.clientY || e.touches[0].clientY) - 87.5;
        }

        var cursorX = (e.clientX || e.touches[0].clientX) - 62.5,

            element = document.querySelectorAll('[data-drag="' + Rummy.selected + '"]')[0];
        element.style.top = cursorY + 'px';
        element.style.left = cursorX + 'px';

        console.log(element.style.top);
    }
}
function release(e) {
    element = document.querySelectorAll('[data-drag="' + Rummy.selected + '"]')[0];
    Rummy.selected = '';
}
function flip(paper) {
    if (paper.getAttribute('data-flip') == 'flipped') {
        paper.setAttribute('data-flip', '');
    } else {
        paper.setAttribute('data-flip', 'flipped');
    }
}
function SetHand() {

}

function Deal() {

    $("#MyHand").css("display", "block");
    var newLeft = 0;
    $("#Decks").toggle();
    $("#showDeckHand").html("Show Deck");
    $('article').each(function (i, a) {
        jQuery(a)[0].setAttribute("data-flip", "flipped");
        jQuery(a).detach().appendTo('#MyHand');

        if (i === 12) {
            return false;
        }
    });


}

function ToggleDeckHand() {
    $("#Decks").toggle();
    $("#MyHand").toggle();
    $("#showDeckHand").html($("#showDeckHand").html() == "Show Deck" ? "Show Hand" : "Show Deck");
}

function ResetGame() {
    $("#Decks").empty();
    Rummy.x = 30;
    Rummy.y = 20;

}

