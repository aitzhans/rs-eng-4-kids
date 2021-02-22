import { DEFAULT_MODEL_ELEMENTS, DEFAULT_MODEL_GAME_ELEMENTS } from './consts';
import { getJSON, shuffleArray, createAudio, playAudio } from './utils';
import Statistics from './statistics';

export default class Model {
    constructor(options) {
        this.dataRootUrl = './assets/json/';
        this.audioRootUrl = './assets/audio/';
        this.categoriesFile = options.dataUrl;
        this.stat = null;
        this.elements = {
            ...DEFAULT_MODEL_ELEMENTS
        };
        this.game = {
            ...DEFAULT_MODEL_GAME_ELEMENTS
        };
    }

    getCategoriesData() {
        const fileUrl = this.dataRootUrl + this.categoriesFile;
        return (getJSON.call(this, fileUrl)
            .then((data) => {
                this.elements.CATEGORIES = data;
            }));
    }

    getWords(filename) {
        const fileUrl = `${this.dataRootUrl + filename}.json`;
        return (getJSON.call(this, fileUrl)
            .then((data) => {
                this.elements.ACTIVE_WORDS_CARDS = data;
            }));
    }

    createGame() {
        this.game.gameStarted = true;
        if (!this.elements.ACTIVE_WORDS_CARDS) {
            this.elements.ACTIVE_WORDS_CARDS = this.stat.difficultWordsCards;
        }
        this.game.GAME_WORDS = shuffleArray(this.elements.ACTIVE_WORDS_CARDS);
        this.pickNewGameWord();
    }

    pickNewGameWord() {
        this.game.CURRENT_GAME_WORD = this.game.GAME_WORDS.pop();
        setTimeout(() => {
            this.sayWord();
        }, 500);
    }

    sayWord() {
        const audioUrl = `${this.audioRootUrl + this.game.CURRENT_GAME_WORD.audioFile}`;
        const pronunciation = createAudio(audioUrl);
        playAudio(pronunciation);
    }

    updateScore(cardWord) {
        if (cardWord == this.game.CURRENT_GAME_WORD.word) {
            this.game.CORRECT_WORDS_COUNT += 1;
            this.stat.incrementCGC(this.game.CURRENT_GAME_WORD.word);
            this.checkEndOfGame();
            return 'right';
        }
        this.game.WRONG_WORDS_COUNT += 1;
        this.stat.incrementEGC(this.game.CURRENT_GAME_WORD.word);
        return 'wrong';
    }

    checkEndOfGame() {
        if (this.game.CORRECT_WORDS_COUNT == this.elements.ACTIVE_WORDS_CARDS.length) {
            this.game.IS_WIN = (this.game.WRONG_WORDS_COUNT == 0);
        } else {
            this.pickNewGameWord();
        }
    }

    clearGame() {
        this.stat.getLocalStorage();
        this.game = {
            ...DEFAULT_MODEL_GAME_ELEMENTS
        };
    }

    createStatistics() {
        this.stat = new Statistics(this.elements.CATEGORIES);
        this.stat.setData();
    }
}
