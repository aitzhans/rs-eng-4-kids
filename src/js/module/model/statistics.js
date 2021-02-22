import { getJSON, stringsSort, numbersSort } from './utils';
import { STATISTIC_HEADER_LINE, INDEXOFWORD, INDEXOFTCC,
    INDEXOFCGC, INDEXOFEGC, INDEXOFCGP, MAX_DIFFICULT_WORDS_COUNT } from './consts';

export default class Statistics {
    constructor(categories) {
        this.dataRootUrl = './assets/json/';
        this.categories = categories;
        this.wordsByCategories = [];
        this.data = [
            STATISTIC_HEADER_LINE
        ];
        this.descendingSortingOrder = true;
        this.sortingCriteria = null;
        this.difficultWords = null;
        this.difficultWordsCards = [];
        this.allWordsForCards = [];
    }

    getWords() {
        const promises = [];
        for (const category of this.categories) {
            const fileUrl = `${this.dataRootUrl + category.words}.json`;
            promises.push(
                getJSON.call(this, fileUrl).then((data) => {
                    this.wordsByCategories.push([category.categoryName, data]);
                })
            );
        }
        return Promise.all(promises);
    }

    setData() {
        if (localStorage.getItem('stat') != null) {
            this.getLocalStorage();
            this.getAllWordsForCards();
        } else {
            this.getWords()
                .then(() => {
                    this.wordsByCategories.forEach((subarr) => {
                        const category = subarr[0];
                        subarr[1].forEach((word) => {
                            this.data.push([category, word.word, word.translation, 0, 0, 0, 0]);
                            this.allWordsForCards.push(word);
                        });
                    });
                });
        }
    }

    getAllWordsForCards() {
        this.getWords()
            .then(() => {
                this.wordsByCategories.forEach((subarr) => {
                    subarr[1].forEach((word) => {
                        this.allWordsForCards.push(word);
                    });
                });
            });
    }

    searchLineWithWord(word) {
        let result = '';
        this.data.some((line) => {
            if (line[INDEXOFWORD] === word) {
                result = line;
                return true;
            }
            return false;
        });
        return result;
    }

    incrementTC(word, isTrain) {
        const line = this.searchLineWithWord(word);
        if (isTrain) {
            line[INDEXOFTCC] += 1;
            this.setLocalStorage();
        }
    }

    incrementCGC(word) {
        const line = this.searchLineWithWord(word);
        line[INDEXOFCGC] += 1;
        this.updateCGP(word);
        this.setLocalStorage();
    }

    incrementEGC(word) {
        const line = this.searchLineWithWord(word);
        line[INDEXOFEGC] += 1;
        this.updateCGP(word);
        this.setLocalStorage();
    }

    updateCGP(word) {
        const line = this.searchLineWithWord(word);
        line[INDEXOFCGP] = Math.trunc((line[INDEXOFCGC] * 100) / (line[INDEXOFCGC] + line[INDEXOFEGC]));
    }


    setDifficultWords() {
        const tempMap = new Map();
        const dataBody = this.data.slice(1);
        for (const line of dataBody) {
            const errorsPercentage = 100 - line[INDEXOFCGP];
            if ((errorsPercentage > 0) && (errorsPercentage < 100)) {
                tempMap.set(line[INDEXOFWORD], errorsPercentage);
            }
        }
        if (tempMap.size == 0) {
            this.difficultWords = new Map();
            return;
        }
        this.difficultWords = new Map([...tempMap.entries()].sort((a, b) => numbersSort('descending')(b[1], a[1])));
        this.getDifficultWords();
    }

    getDifficultWords() {
        this.difficultWords = [...this.difficultWords.keys()].splice(0, MAX_DIFFICULT_WORDS_COUNT);
        this.difficultWordsCards = [];
        for (const word of this.allWordsForCards) {
            if (this.difficultWords.indexOf(word.word) != -1) {
                this.difficultWordsCards.push(word);
            }
        }
    }


    setLocalStorage() {
        localStorage.setItem('stat', JSON.stringify(this.data));
    }

    getLocalStorage() {
        this.data = JSON.parse(localStorage.getItem('stat'));
    }

    sortData() {
        const dataBody = this.data.splice(1);
        const index = STATISTIC_HEADER_LINE.indexOf(this.sortingCriteria);
        const sortingOrder = (this.descendingSortingOrder) ? 'descending' : 'ascending';
        if (typeof (dataBody[0][index]) === 'string') {
            dataBody.sort((a, b) => stringsSort(sortingOrder)(a[index], b[index]));
        } else {
            dataBody.sort((a, b) => numbersSort(sortingOrder)(a[index], b[index]));
        }
        this.data = [...this.data, ...dataBody];
    }

    resetStatData() {
        const dataBody = this.data.splice(1);
        const numberOfNumericValues = INDEXOFCGP - INDEXOFTCC + 1;
        for (const line of dataBody) {
            line.splice(INDEXOFTCC, numberOfNumericValues, 0, 0, 0, 0);
        }
        this.data = [...this.data, ...dataBody];
        this.setLocalStorage();
    }
}
