//define Card Unicodes
var Unicodes = 
	[
	['\U1F0A0',	'\U1F0BF', '\U1F0CF', '\U1F0DF'], //Card back, Red Joker, Black Joker, White Joker
	['\U1F0D1',	'\U1F0C1', '\U1F0B1', '\U1F0A1'], //ACE Clubs, Diamonds, Hearts, Spades
	['\U1F0D2',	'\U1F0C2', '\U1F0B2', '\U1F0A2'], //TWO Clubs, Diamonds, Hearts, Spades
	['\U1F0D3',	'\U1F0C3', '\U1F0B3', '\U1F0A3'], //THREE Clubs, Diamonds, Hearts, Spades
	['\U1F0D4',	'\U1F0C4', '\U1F0B4', '\U1F0A4'], //FOUR Clubs, Diamonds, Hearts, Spades
	['\U1F0D5',	'\U1F0C5', '\U1F0B5', '\U1F0A5'], //FIVE Clubs, Diamonds, Hearts, Spades
	['\U1F0D6',	'\U1F0C6', '\U1F0B6', '\U1F0A6'], //SIX Clubs, Diamonds, Hearts, Spades
	['\U1F0D7',	'\U1F0C7', '\U1F0B7', '\U1F0A7'], //SEVEN Clubs, Diamonds, Hearts, Spades
	['\U1F0D8',	'\U1F0C8', '\U1F0B8', '\U1F0A8'], //EIGHT Clubs, Diamonds, Hearts, Spades
	['\U1F0D9',	'\U1F0C9', '\U1F0B9', '\U1F0A9'], //NINE Clubs, Diamonds, Hearts, Spades
	['\U1F0DA',	'\U1F0CA', '\U1F0BA', '\U1F0AA'], //TEN Clubs, Diamonds, Hearts, Spades
	['\U1F0DB',	'\U1F0CB', '\U1F0BB', '\U1F0AB'], //JACK Clubs, Diamonds, Hearts, Spades
	['\U1F0DD',	'\U1F0CD', '\U1F0BD', '\U1F0AD'], //QUEEN Clubs, Diamonds, Hearts, Spades
	['\U1F0DE',	'\U1F0CE', '\U1F0BE', '\U1F0AE'], //KING Clubs, Diamonds, Hearts, Spades
	['\U1F0D1',	'\U1F0C1', '\U1F0B1', '\U1F0A1']  //ACE Clubs, Diamonds, Hearts, Spades
    ];

//define Card Ranks
function Rank(face, value, points){
	this.face = face;
	this.value = value;
	this.points = points;
}

var Ranks = [];

Ranks[0] =  new Rank('X', 0, 0);
Ranks[1] =  new Rank('A', 1, 10);
Ranks[2] =  new Rank('2', 2, 2);
Ranks[3] =  new Rank('3', 3, 3);
Ranks[4] =  new Rank('4', 4, 4);
Ranks[5] =  new Rank('5', 5, 5);
Ranks[6] =  new Rank('6', 6, 6);
Ranks[7] =  new Rank('7', 7, 7);
Ranks[8] =  new Rank('8', 8, 8);
Ranks[9] =  new Rank('9', 9, 9);
Ranks[10] =  new Rank('10', 10, 10);
Ranks[11] =  new Rank('J', 11, 10);
Ranks[12] =  new Rank('Q', 12, 10);
Ranks[13] =  new Rank('K', 13, 10);
Ranks[14] =  new Rank('A', 14, 10);


function getRankByFace(face){
	return Ranks.filter(function(rank){
		return rank.face == face;
	})[0];
}

//define Card Suits
function Suit(face, value, unicode){
	this.face = face;
	this.value = value;
	this.unicode = unicode;
}

var Suits = [];

Suits[0] = new Suit('', 0, '');
Suits[1] = new Suit('C', 1, '\u2663');
Suits[2] = new Suit('D', 2, '\u2666');
Suits[3] = new Suit('H', 3, '\u2665');
Suits[4] = new Suit('S', 4, '\u2660');

function getSuitByFace(face){
	return Suits.filter(function(suit){
		return suit.face == face;
	})[0];
}

//define Card
function Card(face){
	var rank = face == 'X' ? getRankByFace('X') : getRankByFace(face.substr(0, face.length-1));
	var suit = face == 'X' ? getSuitByFace('') : getSuitByFace(face.substr(face.length-1));
	
	this.face = face; //"JC" for Jack Clubs
	this.rank = rank.face; //"J" for Jack
	this.suit = suit.face; //"C" for Clubs
	this.suitValue = suit.value; //1 for Clubs
	this.valueLow = rank.value; //same as value, except for ACE
	this.value = face.indexOf('A') >= 0 ? 14 : this.valueLow; //14 for ACE 
	this.points = rank.points; //10 for Jack
    this.unicode = face == 'X' ? '\U1F0BF' : Unicodes[rank.value][suit.value - 1];
    this.suitUnicode = suit.unicode; //ABID Added this to easily Use in UI
	this.id = 0; //will be set later
}

Card.prototype.toString = function(){
	return this.rank + getSuitByFace(this.suit).unicode + "(" + this.id + ")";
}

function createDeck(){
	var cards = [];
	var i = 0;
	for(var rank = 2; rank <= 14; ++rank){
		for(var suit = 1; suit <= 4; ++suit){
			cards[i++] = new Card(Ranks[rank].face + Suits[suit].face);
		}
	}
	
	//add 2 jokers
	cards[i++] = new Card('X');
	cards[i++] = new Card('X');

	return cards;
}

//define CardSet
var SetType = {SEQUENCE: 1, SAME_RANK: 2}

function CardSet(type){
	this.type = type;
	this.jokersNeeded = 0;
	this.cards = [];
}

CardSet.prototype.add = function(card){
	//do not allow duplicates in sets (canasta will be handled separately)
	if(!this.cards.some(function(c){return c.face == card.face;})){
		this.cards.push(card);
	}
}

CardSet.prototype.setCards = function(cards){
	var self = this;
	
	cards.forEach(function(c){
		self.add(c);
	});
}

CardSet.prototype.cardIds = function(){
	return this.cards.map(function(c){return c.id;}).join();
}

CardSet.prototype.toString = function(){
	var result = "[";
	result += this.cards.map(function(c){return c.toString();}).join(', ');
	result += ']';

	result += ' (' + this.jokersNeeded + ')\n';
	return result;
}

//define CardSets
function CardSets(){
	this.list = []; //array of CardSet objects
}

CardSets.prototype.addSet = function(set){
	//do not allow duplicate sets
	if(!this.list.some(function(s){
		return s.cardIds() == set.cardIds();
		})){
		this.list.push(set);
	}
}

//define an instance set formation (or Card arrangement)
function Node(parent, cards13, gameJoker, jokersAvailable, sets){
	this.parent = parent;
	this.cards13 = cards13;
	this.gameJoker = gameJoker;
	this.jokersAvailable = jokersAvailable;
	this.sets = sets;
	
	this.setsFormed = [];
	this.points = 0;
}

Node.prototype.addSet = function(set){
	var filteredCardSets = filterCardSets(set, this.sets);
	var jokersRemaining = this.jokersAvailable - set.jokersNeeded;

    if(jokersRemaining >= 0){
        var childNode = new Node(this, this.cards13, this.gameJoker, jokersRemaining, filteredCardSets);
        
        this.setsFormed.forEach(function(s){
        	childNode.setsFormed.push(s); //adding the already formed sets from the parent node
        });

        childNode.setsFormed.push(set); //adding the current set
        return childNode;
    }

    return this;
}

Node.prototype.computePoints = function(){
	//build an array of all the cards which are part of formed sets
	var cards = []; 
	this.setsFormed.forEach(function(s){
		s.cards.forEach(function(c){
			cards.push(c);
		});
	});
	
	var gameJoker = this.gameJoker;
	var sum = 0;
	this.cards13.forEach(function(c){
		if(c.rank != gameJoker.rank && !cards.includes(c)){
			sum += c.points;
		}
	});
	
	this.points = sum;
	
	return sum;
}

Node.prototype.toString = function(){
	var result = "[";
	result += this.cards13.map(function(c){return c.toString();}).join(', ');
	result += '] [';
	result += this.gameJoker.toString() + ']\n';
	
	this.setsFormed.forEach(function(s){
		result += s.toString();
	});
	
	result += this.points;
	
	return result; 
}

/*
 * Objects for UI 
 */

var GameState = {CUT_DECK: 1, CUT_JOKER: 2, PICK_CARD: 3, DISCARD: 4, SHOW: 5, END: 6}

function Pool(deckCount, playerNames, cutOffPoints, dropPoints, middleDropPoints){
	//properties which do not change during the life of the Pool
	
	//create Players
	var players = [];
	
	var tokens = playerNames.split(', ');
	var position = 0;
	var self = this;
	
	tokens.forEach(function(name){
		players.push(new Player(self, name, position++));
	});

    this.deckCount = deckCount; //ABID init deckCount here 
    this.cards = [];//ABID We get cards in startNextGame just init here. 
	this.players = players;
	this.cutOffPoints = cutOffPoints;
	this.dropPoints = dropPoints;
    this.middleDropPoints = middleDropPoints;
    this.deckCount = deckCount;
    
	//properties which change during the life of the Pool
	this.gamePoints = [];
	this.openerIndex = 0;
}

Pool.prototype.createDecks = function(){
	var cards = [];
	
    for (var i = 0; i < this.deckCount; ++i) {
        var deckCards = createDeck();
        cards = cards.concat(deckCards);
    }
    
    return cards;
}

Pool.prototype.startNextGame = function () {
	//we need to create or collect cards before we can start a new game
	
	var cards = [];
	
	if(!this.currentGame){
		//this is the first game, hence need to create cards
		cards = this.createDecks();
	}
	else{
		//we have already created cards, hence just collect them
		this.players.forEach(function(player){
			if(player.isOut){
				return;
			}
			cards = cards.concat(player.cards); //collect player cards
			player.cards = []; //clear player cards
			player.isDropped = false;
			player.isMiddleDropped = false;
		});
		
		cards = cards.concat(this.currentGame.discards);
		cards = cards.concat(this.currentGame.cards);
		cards = cards.concat(this.currentGame.gameJoker); //all this should add up to the original # of cards
	}
	
	var game = new Game(this, cards, this.players, this.openerIndex);
	this.currentGame = game;
	return game;
}

function Game(pool, cards, players, openerIndex){
	this.pool = pool;
	this.cards = cards;
	this.players = players;
	this.gamePoints = [];
	this.openerIndex = openerIndex; //this needs to be adjusted whenever a player is out
	this.gameState = GameState.CUT_DECK;
    this.actorIndex = openerIndex;
    this.discards = [];
	shuffle(this.cards);
}

Game.prototype.cutDeck = function(index){
	var i = index ? index : Math.floor(Math.random() * this.cards.length);
	
	var topCards = this.cards.splice(0, i);
	this.cards = this.cards.concat(topCards);
	
	//deal cards
	var self = this;
	for(c = 0; c < 13; ++c){
		this.players.forEach(function(player){
            player.cards.push(self.cards.shift());
		});
	}
	
	this.discards.push(this.cards.shift()); //this is the open card

	//let the dealer cut the joker 
	this.gameState = GameState.CUT_JOKER;
	this.actorIndex = this.previousIndex(this.openerIndex);
}

Game.prototype.cutJoker = function(index){
	var i = index ? index : Math.floor(Math.random() * this.cards.length);
	this.gameJoker = this.cards[i];

	//let the opener play next 
	this.gameState = GameState.PICK_CARD;
	this.actorIndex = this.openerIndex;
}

Game.prototype.nextIndex = function(index){
	var activePlayers = this.pool.players.filter(function(p){
		return !p.isOut; //still playing
	});
	
	var nextIndex = (++index)%activePlayers.length;
	return nextIndex;
}

Game.prototype.previousIndex = function(index){
	var activePlayers = this.pool.players.filter(function(p){
		return !p.isOut; //still playing
	});
	
	var previousIndex = --index;
	if(previousIndex < 0){
		previousIndex = activePlayers.length - 1;
	}
	
	return previousIndex;
}

Game.prototype.updatePoints = function(){
	var self = this;
	
	for(var i = 0; i < this.players.length; ++i){
		var player = players[i];
		var points = 0;
		
		if(player.isOut){
			if(player.isDropped){
				points = this.pool.dropPoints;
			}
			else if(player.isMiddleDropped){
				points = this.pool.middleDropPoints;
			}
			else{
				var bestOption = players[i].findBestOption();
				points = bestOption.points;
			}
			this.gamePoints[i] = points;
			player.points += points;
			
			if(player.points > this.pool.cutOffPoints){
				player.isOut = true;
			}
		}
	}
}

function Player(game, name, position){
	this.game = game;
	this.name = name;
	this.position = position;
	this.cards = [];
	this.points = 0;
	this.isDropped = false;
	this.isMiddleDropped = false;
	this.isOut = false;
}

Player.prototype.pickCard = function(isFromDeck){
	var card = isFromDeck ? this.game.cards.shift() : this.game.discards.pop();
	this.cards.push(card);
	this.game.gameState = GameState.DISCARD;
}

Player.prototype.discard = function(card){
	for(var i = 0; i < this.cards.length; ++i){
		if ( this.cards[i] === card) {
			this.cards.splice(i, 1); 
			this.game.discards.push(card);
			
			break;
		}
	}
	
	this.actorIndex = this.game.nextIndex(actorIndex);
	this.game.gameState = GameState.PICK_CARD;
}

Player.prototype.show = function(card){
	this.game.gameState = GameState.END;
	var bestOption = this.findBestOption();
}

//function to determine the best card arrangement option which results in least points
Player.prototype.findBestOption = function(){
	var cards13 = this.cards;
	var gameJoker = this.game.gameJoker;

	return findBestOption(cards13, gameJoker);
}

function findBestOption(cards13, gameJoker){
	//assign unique ids for the given cards
	var i = 1;
	cards13.forEach(function(card){
		card.id = i++;
	});
	
	//find number of jokers
	var jokerCount = cards13.filter(function(card){
		return card.face == 'X' || card.rank == gameJoker.rank;
	}).length;
	
	var cardSets = new CardSets(); //master list of card sets
	
	buildMasterSetList(cards13, gameJoker, jokerCount, cardSets);

	//cardSets.list.forEach(function(set){console.log(set.toString());});
	
	var rootNode = new Node(null, cards13, gameJoker, jokerCount, cardSets.list);
	
	var nodes = buildGame(rootNode);
	
	//let us find the option with the least points
	var bestNode = rootNode;
	bestNode.computePoints();
	
	nodes.forEach(function(node){
		var points = node.computePoints();
		if(points < bestNode.points){
			bestNode = node;
		}
	});
	
	console.log("Best option in " + nodes.length + " attempts");
	console.log(bestNode.toString());
	return bestNode;
}

//functions to build all possible sets - sequences and same-rank sets
function buildMasterSetList(cards13, gameJoker, jokerCount, cardSets){
	var cards = cards13.filter(function(card){
		return card.face != 'X' //filter out all pure jokers
	});
	
	buildSequences(cards, gameJoker, jokerCount, cardSets);
	buildSameRankSets(cards, gameJoker, jokerCount, cardSets);
	
	cardSets.list = cardSets.list.filter(function(s){
		return s.jokersNeeded <= jokerCount;
	});
	
	cardSets.list.forEach(function(s){
		console.log(s.toString());
	});
	console.log("Master list size = " + cardSets.list.length);
}

function buildSequences(cards, gameJoker, jokerCount, cardSets){
	//group cards by suit
	var groups = groupBy(cards, 'suit');
	
	for(var i = 1; i <= 4; ++i){
		var suitCards = groups[Suits[i].face]; 
		if(!suitCards){
			continue;
		}
		
        //find the distinct cards
		var distinctCards = distinct(suitCards, 'rank');
		
		doBuildSequences(distinctCards, gameJoker, jokerCount, cardSets, false);
		
		//check is the are any ACEs
		if(distinctCards.some(function(c){return c.rank == 'A';})){
			//there is at least one ACE in the suitGroup, hence try ACE as ONE
			doBuildSequences(distinctCards, gameJoker, jokerCount, cardSets, true);
		}
		
		//now we need to handle duplicate cards
		var duplicates = suitCards.filter(function(c){
			return !distinctCards.includes(c);
		});
		
		duplicates.forEach(function(card){
			if(card.rank == gameJoker.rank){
				return; //we do not have to do substitution for game jokers
			}
			
			//find all sequences in which the original card (of same rank and suit) appears
			var sets = cardSets.list.filter(function(cs){
				//this is different from Kotlin version, as the cardSets in scope contains sets of all suit groups
				//whereas in Kotlin version the cadsSets in scope contains only sets of current suit
				return cs.cards.map(function(c){return (c.rank + c.suit);}).includes(card.rank + card.suit);
			});
			
			sets.forEach(function(set){
				//build a new card set with the same cards as the cardSet, but with the duplicate card in place of the original
				var cardSet = new CardSet(SetType.SEQUENCE);
				cardSet.jokersNeeded = set.jokersNeeded;
				
				//replace the original card by the duplicate
				set.cards.forEach(function(c){
					if(c.rank == card.rank){
						cardSet.cards.push(card);
					}
					else{
						cardSet.cards.push(c);
					}
				});
				
				cardSets.addSet(cardSet);
			});
		});
	}
}

function doBuildSequences(distinctCards, gameJoker, jokerCount, cardSets, aceAsOne){
	var list = [distinctCards];

	do{
		list = build(list, gameJoker, jokerCount, cardSets, aceAsOne);
	}while(list.length > 0);
}

function build(list, gameJoker, jokerCount, cardSets, aceAsOne){
	var results = [];
	
	list.forEach(function(cards){
		addSetIfValid(cards, gameJoker, jokerCount, cardSets, aceAsOne);
		
		var sets = splitSet(cards);
		sets.forEach(function(s){
			results.push(s);
		});
	});
	
	return results;
}

function addSetIfValid(cards, gameJoker, jokerCount, cardSets, aceAsOne){
	var setGaps = findSetGaps(cards, aceAsOne);
	var jokersNeeded = setGaps.reduce(function(a, b){return a + b;}, 0); //sum of gaps
	
	var jokersAvailable = jokerCount;
	
	//if there is game joker among the cards, then we have one less joker to use
	if(cards.some(function(c){
		return c.rank == gameJoker.rank;
	})){
		--jokersAvailable;
	}
	
	if(cards.length < 3){
		jokersNeeded += (3 - cards.length); //sets with the help of jokers
	}
	
    if(jokersNeeded <= jokersAvailable){
        //this card sequence is a potential one, hence create  CardSet
        var cardSet = new CardSet(SetType.SEQUENCE);
        cardSet.setCards(cards);
        cardSet.jokersNeeded = jokersNeeded
        cardSets.addSet(cardSet)
    }
}

function splitSet(cards){
    var result = []; //list of card lists

    var leftSet = subArray(cards, 0, cards.length-1); //0 to n-1 cards
    var rightSet = subArray(cards, 1, cards.length); //1 to n cards

    if(leftSet.length > 0){
        result.push(leftSet);
    }

    if(rightSet.length > 0){
        result.push(rightSet);
    }

    return result;
}

function buildSameRankSets(cards, gameJoker, jokerCount, cardSets){
	//group cards by rank
	var groups = groupBy(cards, 'rank');
	
	for(var i = 2; i <= 14; ++i){
		if(i == gameJoker.value){
			continue; //skip game jokers
		}
		
		var rankCards = groups[Ranks[i].face]; 
		if(!rankCards){
			continue;
		}
		
		for(var j = 0; j <= jokerCount; ++j){
			rankCards.forEach(function(refCard){
				var cardSet = new CardSet(SetType.SAME_RANK);
				cardSet.add(refCard);
				
				rankCards.forEach(function(card){
					cardSet.add(card); //this will not allow duplicates
				});
				
				var jokersInSet = cardSet.cards.filter(function(c){
					return c.rank == gameJoker.rank;
				}).length;
				
				var jokersNeeded = (jokersInSet + 3 - cardSet.cards.length);
                if(jokersNeeded < 0){
                    jokersNeeded = 0;
                }

				if(jokersNeeded <= jokerCount){
					cardSet.jokersNeeded = jokersNeeded;
					sort(cardSet.cards, 'suitValue');
					cardSets.addSet(cardSet);
					
					buildSubSets(cardSet, cardSets);
				}
			});
		}
		
		//add canasta sets (sets of 3 or more cards with same rank and suit) if any present
		var suitGroups = groupBy(rankCards, 'suit');
		
		for(var k = 1; k <= 4; ++k){
			var suitCards = suitGroups[Suits[k].face]; 
			if(!suitCards){
				continue;
			}
			
            if(suitCards.length > 2){
                var cardSet = new CardSet(SetType.SEQUENCE);
                cardSet.cards = suitCards;
                cardSets.addSet(cardSet);
            }
		}
	}
}

function buildSubSets(cardSet, cardSets){
    if(cardSet.cards.length < 4){
        return;
    }

    var set = new CardSet(SetType.SAME_RANK);

    cardSet.cards.forEach(function(card){
    	set.cards = cardSet.cards.filter(function(c){return c !== card}); //add all the cards except the current one
		sort(set.cards, 'suitValue');
    	cardSets.addSet(set);
    	
    	set = new CardSet(SetType.SAME_RANK);
    	buildSubSets(set, cardSets)
    });
}

//functions to build the game from the sets

function filterCardSets(set, fromSets){
	var resultSets = fromSets;
	
	set.cards.forEach(function(c){
		var filteredSets = resultSets.filter(function(s){return !s.cards.includes(c);});
		resultSets = filteredSets;
	});
	
	return resultSets;
}

function buildGame(rootNode){
	var nodes = [];
	
	nodes.push(rootNode);
	
	var currentNode = rootNode;
	
	//find pure sets
	var pureSets = rootNode.sets.filter(function(cs){
		return (cs.type == SetType.SEQUENCE && cs.jokersNeeded == 0);
	});
	
	if(pureSets.length < 1){
		return nodes;
	}
	
	pureSets.forEach(function(set){
		currentNode = currentNode.addSet(set); //Set# 1 added
		nodes.push(currentNode);
		
		//since we have pure set, check if it has a game joker, if so, reduce the number of jokers available
        if(currentNode.setsFormed[0].cards.some(function(c){
        	return c.rank == currentNode.gameJoker.rank;
        })){
            --currentNode.jokersAvailable;
        }

        //we also have to filter out all the sets which contain the game joker
        currentNode.sets = currentNode.sets.filter(function(cs){
        	return !(cs.cards.some(function(c){
        		return c.rank == currentNode.gameJoker.rank;
        	}));
        });
        
        //next look for supporting sequence
        var sequenceSets = currentNode.sets.filter(function(cs){
        	return (cs.type == SetType.SEQUENCE && cs.jokersNeeded <= currentNode.jokersAvailable);
        });
        
        sequenceSets.forEach(function(set){
    		currentNode = currentNode.addSet(set); //Set# 2 added
    		nodes.push(currentNode);
        	
            //after adding the supporting sequence, we can add any sets
    		var otherSets = currentNode.sets.filter(function(cs){
            	return (cs.jokersNeeded <= currentNode.jokersAvailable); 
            });
    		
    		otherSets.forEach(function(set){
        		currentNode = currentNode.addSet(set); //Set# 3 added
        		nodes.push(currentNode);

        		var remainingSets = currentNode.sets.filter(function(cs){
                	return (cs.jokersNeeded <= currentNode.jokersAvailable); 
                });
        		
        		remainingSets.forEach(function(set){
            		currentNode = currentNode.addSet(set); //Set# 4 added
            		nodes.push(currentNode);
        			
            		if(currentNode.computePoints() == 0){
            			return nodes; //game is done, we are ready to show
            		}
            		
            		currentNode = currentNode.parent;
        		});
        		currentNode = currentNode.parent;
    		});
    		currentNode = currentNode.parent;
        });
		currentNode = currentNode.parent;
	});
	
	return nodes;
}

//utility functions
function groupBy(xs, key) {
	return xs.reduce(function(rv, x) {
	    (rv[x[key]] = rv[x[key]] || []).push(x);
	    return rv;
	}, {});
}

function sort(array, prop){
	array.sort(function(c1, c2){return (c1[prop] - c2[prop]);});
}

function findSetGaps(cards, aceAsOne){
	//sort the given cards
	if(aceAsOne){
		sort(cards, 'valueLow');
	}
	else{
		sort(cards, 'value');
	}

	var gaps = [];
	
	if(aceAsOne){
		for(var i = 0; i < cards.length - 1; ++i){
			gaps.push(Math.abs(cards[i+1].valueLow - cards[i].valueLow - 1));
		}
	}
	else{
		for(var i = 0; i < cards.length - 1; ++i){
			gaps.push(Math.abs(cards[i+1].value - cards[i].value - 1));
		}
	}
	
	return gaps;
}

function subArray(array, fromIndex, toIndex){
	var result = [];
	
	for(var i = fromIndex; i < toIndex; ++i){
		result.push(array[i]);
	}
	
	return result;
}

function distinct(array, prop) {
	var result = [];
	
	array.forEach(function(e){
		if(!result.map(function(x){
			return x[prop];
		}).includes(e[prop])){
			result.push(e);
		}
	});

	//cards.map(function(c){return c.id;})
	
	return result;
}

function shuffle(array) {
	for (var i = array.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}

//test code
function test(cardFaces, gameJokerFace){
	var cards13 =  [];
	
	var tokens = cardFaces.split(', ');
	
	tokens.forEach(function(face){
		cards13.push(new Card(face));
	});
	
	var gameJoker = new Card(gameJokerFace);
	
	findBestOption(cards13, gameJoker);
}

