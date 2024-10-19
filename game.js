class Card {
    constructor(rank, suit) {
        this.rank = rank;
        this.suit = suit;
    }

    getCardImage() {
        return `images/${this.rank}-${this.suit}.png`;
    }
}

class Deck {
    constructor() {
        this.suits = ['H', 'D', 'C', 'S'];
        this.ranks = ['7', '8', '9', '10', 'J', 'Q', 'K', '3', '2', 'A'];
        this.deck = this.createDeck();
        this.shuffle();
    }

    createDeck() {
        const deck = [];
        this.suits.forEach(suit => {
            this.ranks.forEach(rank => {
                deck.push(new Card(rank, suit));
            });
        });
        return deck;
    }

    shuffle() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    drawCard() {
        return this.deck.pop();
    }
}

class Player {
    constructor(name, handSize) {
        this.name = name;
        this.hand = [];
        this.handSize = handSize;
    }

    drawCards(deck) {
        while (this.hand.length < this.handSize) {
            this.hand.push(deck.drawCard());
        }
    }

    playCard(card) {
        const index = this.hand.indexOf(card);
        if (index > -1) {
            return this.hand.splice(index, 1)[0];
        }
        return null;
    }

    hasSuit(suit) {
        return this.hand.some(card => card.suit === suit);
    }
}

class Game {
    constructor() {
        this.deck = new Deck();
        this.players = [];
        this.pile = {
            'H': [],
            'D': [],
            'C': [],
            'S': []
        };
        this.currentPlayerIndex = 0;
        this.initializePlayers();
        this.dealCards();
        this.renderHands();
        this.startGame();
        this.addSkipButtonListener();
    }

    initializePlayers() {
        const humanPlayer = new Player('Human', 20);
        const aiPlayer = new Player('AI', 20);
        this.players.push(humanPlayer, aiPlayer);
    }

    dealCards() {
        this.players.forEach(player => player.drawCards(this.deck));
    }

    startGame() {
        // Check if AI has the 'Hearts J' and start the game
        const aiPlayer = this.players[1];
        const heartsJ = aiPlayer.hand.find(card => card.rank === '7' && card.suit === 'H');
        if (heartsJ) {
            this.pile['H'].push(aiPlayer.playCard(heartsJ));
            this.renderPile();
        }
    }

    isValidPlay(card, lastCardInRow) {
        const rankOrder = ['7', '8', '9', '10','J', 'Q', 'K', '3', '2', 'A'];
        if (!lastCardInRow) {
            return card.rank === '7';
        }
        return rankOrder.indexOf(card.rank) === rankOrder.indexOf(lastCardInRow.rank) + 1;
    }

    playHumanMove(card) {
        const lastCardInRow = this.pile[card.suit][this.pile[card.suit].length - 1];
        if (this.isValidPlay(card, lastCardInRow)) {
            this.pile[card.suit].push(this.players[0].playCard(card));
            this.renderPile();
            this.renderHands();
            this.checkForWinner(); // Check for winner after human plays a card
            setTimeout(() => this.playAIMove(), 1000);
        }
    }

    playAIMove() {
        const aiPlayer = this.players[1];
        const validMove = aiPlayer.hand.find(card => {
            const lastCardInRow = this.pile[card.suit][this.pile[card.suit].length - 1];
            return this.isValidPlay(card, lastCardInRow);
        });

        if (validMove) {
            this.pile[validMove.suit].push(aiPlayer.playCard(validMove));
            this.renderPile();
            this.renderHands();
            this.checkForWinner(); // Check for winner after AI plays a card
        }
    }

    skipTurn() {
        console.log('Player skipped their turn!');
        setTimeout(() => this.playAIMove(), 1000); // AI plays after the player skips
    }

    addSkipButtonListener() {
        const skipButton = document.getElementById('skipTurn');
        skipButton.addEventListener('click', () => {
            this.skipTurn();
        });
    }

    renderHands() {
        const playerHandDiv = document.getElementById('playerCards');
        playerHandDiv.innerHTML = '';

        this.players[0].hand.forEach(card => {
            const cardElement = document.createElement('img');
            cardElement.src = card.getCardImage();
            cardElement.classList.add('card');
            cardElement.addEventListener('click', () => this.playHumanMove(card));
            playerHandDiv.appendChild(cardElement);
        });

        const aiHandDiv = document.getElementById('aiCards');
        aiHandDiv.innerHTML = '';

        this.players[1].hand.forEach(() => {
            const cardBack = document.createElement('img');
            cardBack.src = 'images/BACK.png';  // Use a card back image for AI cards
            cardBack.classList.add('card');
            aiHandDiv.appendChild(cardBack);
        });
    }

    renderPile() {
        const suits = ['H', 'D', 'C', 'S'];
        suits.forEach(suit => {
            const row = document.getElementById(`${this.getSuitName(suit)}Column`);
            row.innerHTML = '';

            this.pile[suit].forEach(card => {
                const cardElement = document.createElement('img');
                cardElement.src = card.getCardImage();
                cardElement.classList.add('card');
                row.appendChild(cardElement);
            });

        });
    }

    getSuitName(suit) {
        switch (suit) {
            case 'H':
                return 'hearts';
            case 'D':
                return 'diamonds';
            case 'C':
                return 'clubs';
            case 'S':
                return 'spades';
            default:
                return '';
        }
    }

    // New method to check for the winner
    checkForWinner() {
        const humanPlayer = this.players[0];
        const aiPlayer = this.players[1];

        if (humanPlayer.hand.length === 0) {
            alert('Баяр хүргэе!, та хожлоо');
            this.endGame(); // Call a method to end the game
        } else if (aiPlayer.hand.length === 0) {
            alert('AI player wins!');
            this.endGame(); // Call a method to end the game
        }
    }

    // New method to end the game
    endGame() {
        // Disable further actions
        document.getElementById('skipTurn').disabled = true;
        document.getElementById('playerCards').innerHTML = '';
        document.getElementById('aiCards').innerHTML = '';

        // You can also display a message or reset the game here if needed
    }
}

// Start a new game
document.addEventListener('DOMContentLoaded', () => {
    new Game();
});
