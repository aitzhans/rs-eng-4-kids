export default class Card {
    constructor(options) {
        this.parent = options.parent;
        this.categoryName = options.categoryName;
        this.img = options.img;
        this.words = options.words;
        this.isTrain = options.isTrain;
        this.elements = {
            cardBody: null,
        };
    }

    createCard() {
        this.elements.cardBody = document.createElement('div');
        this.elements.cardBody.classList.add('card');
        if (!this.isTrain) {
            this.elements.cardBody.classList.add('card--play');
        }
        this.elements.cardBody.innerHTML = `<img class="card__img" src="./assets/img/${this.img}">
                                            <p class="card__txt">${this.categoryName}</p>`;

        return this.elements.cardBody;
    }

    togglePlayMode() {
        this.isTrain = !this.isTrain;
        this.elements.cardBody.classList.toggle('card--play');
    }
}
