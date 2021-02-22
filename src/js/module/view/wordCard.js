import { createAudio, playAudio } from './utils';
import Card from './card';

export default class WordCard extends Card {
    constructor(options) {
        super(options);
        this.iniWord = options.word;
        this.translation = options.translation;
        this.audioFile = options.audioFile;
        this.elements.innerCard = null;
        this.elements.audio = null;
        this.elements.face = null;
    }

    createCard() {
        this.elements.cardBody = document.createElement('div');
        this.elements.cardBody.classList.add('wordCard');
        if (!this.isTrain) {
            this.elements.cardBody.classList.add('wordCard--play');
        }
        this.elements.innerCard = document.createElement('div');
        this.elements.innerCard.classList.add('wordCard__inner');
        this.elements.innerCard.appendChild(this.createInner());
        this.elements.cardBody.appendChild(this.elements.innerCard);
        this.elements.audio = createAudio(`./assets/audio/${this.audioFile}`);

        return (this.elements.cardBody);
    }

    createInner() {
        const fragment = document.createDocumentFragment();
        this.elements.face = document.createElement('div');
        this.elements.face.classList.add('wordCard__surface', 'wordCard__surface--front');
        this.elements.face.innerHTML = `<div class="wordCard__img"><img src="./assets/img/${this.img}"></div>
                        <p class="wordCard__txt">${this.iniWord}
                        </p>`;
        this.elements.face.addEventListener('click', () => {
            if (this.isTrain) {
                playAudio(this.elements.audio);
            }
        });

        const flipBtn = document.createElement('button');
        flipBtn.classList.add('wordCard__btn', 'wordCard__btn--flip');
        flipBtn.innerHTML = '<i class="material-icons">360</i>';
        flipBtn.addEventListener('click', () => {
            this.flipCard();
        });

        const back = document.createElement('div');
        back.classList.add('wordCard__surface', 'wordCard__surface--back');
        back.innerHTML = `<div class="wordCard__img"><img src="./assets/img/${this.img}"></div>
                        <p class="wordCard__txt">${this.translation}</p>`;


        fragment.appendChild(this.elements.face);
        fragment.appendChild(flipBtn);
        fragment.appendChild(back);
        return fragment;
    }

    flipCard() {
        this.elements.cardBody.classList.add('wordCard--flipped');
        this.elements.cardBody.addEventListener('mouseleave', () => {
            this.elements.cardBody.classList.remove('wordCard--flipped');
        });
    }

    togglePlayMode() {
        this.isTrain = !this.isTrain;
        this.elements.cardBody.classList.toggle('wordCard--play');
    }

    makeInactive() {
        this.elements.cardBody.classList.add('wordCard--inactive');
    }

    makeActive() {
        this.elements.cardBody.classList.remove('wordCard--inactive');
    }
}
