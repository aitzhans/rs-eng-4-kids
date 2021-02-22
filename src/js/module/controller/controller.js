import NAMED_CATEGORIES from './consts';

export default class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;
    }

    init() {
        this.model.getCategoriesData()
            .then(() => {
                this.model.elements.ACTIVE_CATEGORY = NAMED_CATEGORIES.HOME;
                this.model.createStatistics();
                this.view.renderCategoriesCards(this.model.elements.CATEGORIES, this.model.elements.IS_TRAIN);
                this.view.renderMenu(this.model.elements.CATEGORIES);
                this.view.setMenuToggleBtn();
            })
            .then(() => {
                this.addListenersToMenuToggle();
                this.addListenersToCategoriesCards();
                this.addListenersToMenuItems();
                this.addListenerToHeaderLogo();
                this.addListenerToTrainPlayToggle();
            });
    }

    getNewCards(categoryName, filename) {
        this.model.elements.ACTIVE_CATEGORY = categoryName;
        if (categoryName == NAMED_CATEGORIES.HOME) {
            this.view.renderCategoriesCards(this.model.elements.CATEGORIES, this.model.elements.IS_TRAIN);
            this.addListenersToCategoriesCards();
        } else if (categoryName == NAMED_CATEGORIES.STAT) {
            this.view.renderStat(this.model.stat.data);
            this.addListenerToStatSortBtns();
            this.addListenerToStatResetBtn();
            this.addListenerToStatRepeatBtn();
        } else if (categoryName == NAMED_CATEGORIES.DIFFICULT_WORDS) {
            this.view.renderWordsCards(categoryName, this.model.stat.difficultWordsCards, this.model.elements.IS_TRAIN);
            this.addTrainListenersToWordCards();
        } else {
            this.model.getWords(filename)
                .then(() => {
                    this.view.renderWordsCards(categoryName, this.model.elements.ACTIVE_WORDS_CARDS, this.model.elements.IS_TRAIN);
                    this.addTrainListenersToWordCards();
                });
        }
        this.view.updateMenuItems(categoryName);
        this.checkStartBtn();
    }

    addListenersToMenuToggle() {
        this.view.elements.MENU_TOGGLE.addEventListener('click', () => {
            this.view.toggleMenu();
        });
        this.view.elements.MENU_OVERLAY.addEventListener('click', () => {
            this.view.toggleMenu();
        });
    }

    addListenersToCategoriesCards() {
        for (const card of this.view.elements.CURRENT_CARDS) {
            card.elements.cardBody.addEventListener('click', () => {
                const filename = card.words;
                this.getNewCards(card.categoryName, filename);
            });
        }
    }

    addListenersToMenuItems() {
        for (const menuItem of this.view.elements.MENU_ITEMS) {
            menuItem.addEventListener('click', () => {
                this.view.elements.MENU_OPEN = !this.view.elements.MENU_OPEN;
                const categoryName = menuItem.getAttribute('data-category');
                const filename = menuItem.getAttribute('data-words');
                if (this.model.game.CURRENT_GAME_WORD) {
                    this.model.clearGame();
                    this.view.clearScoreStars();
                }
                this.getNewCards(categoryName, filename);
            });
        }
    }

    addListenerToHeaderLogo() {
        const headerLogo = document.querySelector('.page-header__title-container');
        headerLogo.addEventListener('click', () => {
            this.getNewCards(NAMED_CATEGORIES.HOME, 'home');
        });
    }

    addListenerToTrainPlayToggle() {
        const trainPlayToggle = document.querySelector('.train-play__container');
        trainPlayToggle.addEventListener('click', () => {
            if (this.model.game.CURRENT_GAME_WORD) {
                this.model.clearGame();
                this.view.clearScoreStars();
                const categoryName = this.view.elements.ACTIVE_MENU_ITEM.getAttribute('data-category');
                const filename = this.view.elements.ACTIVE_MENU_ITEM.getAttribute('data-words');
                this.getNewCards(categoryName, filename);
            }
            this.view.togglePlayMode();
            this.model.elements.IS_TRAIN = !this.model.elements.IS_TRAIN;
            this.checkStartBtn();
        });
    }

    addListenerToStatSortBtns() {
        for (const sortBtn of this.view.elements.STAT_SORT_BTNS) {
            sortBtn.addEventListener('click', () => {
                this.view.updateStatBtns(sortBtn);
                this.model.stat.sortingCriteria = sortBtn.innerText;
                this.model.stat.sortData();
                this.view.renderStatTable(this.model.stat.data);
            });
        }
        this.view.elements.STAT_SORT_TOGGLE.addEventListener('click', () => {
            this.model.stat.descendingSortingOrder = !this.model.stat.descendingSortingOrder;
            this.view.toggleStatSorting(this.model.stat.descendingSortingOrder);
            this.model.stat.sortData();
            setTimeout(() => {
                this.view.renderStatTable(this.model.stat.data);
            }, 200);
        });
    }

    addListenerToStatResetBtn() {
        this.view.elements.STAT_RESET_BTN.addEventListener('click', () => {
            this.view.unpressStatSortingBtns();
            this.model.stat.resetStatData();
            this.view.renderStatTable(this.model.stat.data);
        });
    }

    addListenerToStatRepeatBtn() {
        this.view.elements.STAT_REPEAT_BTN.addEventListener('click', () => {
            this.model.elements.ACTIVE_WORDS_CARDS = null;
            this.model.stat.setDifficultWords();
            if (this.model.stat.difficultWords.size != 0) {
                this.getNewCards(NAMED_CATEGORIES.DIFFICULT_WORDS, 'difficult');
            }
        });
    }

    checkStartBtn() {
        if (!this.model.elements.IS_TRAIN) {
            if ((this.model.elements.ACTIVE_CATEGORY != NAMED_CATEGORIES.HOME)
                && (this.model.elements.ACTIVE_CATEGORY != NAMED_CATEGORIES.STAT)) {
                this.view.renderStartBtn();
                this.addListenerToStartBtn();
                return;
            }
        }
        if (this.view.elements.START_BTN) {
            this.view.removeStartBtn();
        }
    }

    addListenerToStartBtn() {
        this.view.elements.START_BTN.addEventListener('click', () => {
            if (this.model.game.CURRENT_GAME_WORD == null) {
                this.view.updateStartBtn();
                this.view.createScoreStars();
                this.model.createGame();
                this.addGameListenersToWordCards();
            } else {
                this.model.sayWord();
            }
        });
    }

    addTrainListenersToWordCards() {
        for (const card of this.view.elements.CURRENT_CARDS) {
            card.elements.face.addEventListener('click', () => {
                this.model.stat.incrementTC(card.iniWord, this.model.elements.IS_TRAIN);
            });
        }
    }

    addGameListenersToWordCards() {
        for (const card of this.view.elements.CURRENT_CARDS) {
            card.elements.cardBody.addEventListener('click', () => {
                this.updateScore(card);
                this.checkEndOfGame();
            });
        }
    }

    updateScore(card) {
        const wrongOrRight = this.model.updateScore(card.iniWord);
        if (wrongOrRight == 'right') {
            card.makeInactive();
        }
        this.view.updateScoreStars(wrongOrRight);
    }

    checkEndOfGame() {
        if (this.model.game.IS_WIN != null) {
            this.view.renderFinalMessage(this.model.game.IS_WIN, this.model.game.WRONG_WORDS_COUNT);
            this.model.clearGame();
            this.model.elements.IS_TRAIN = !this.model.elements.IS_TRAIN;
            setTimeout(() => {
                this.getNewCards(NAMED_CATEGORIES.HOME, 'home');
            }, 2600);
        }
    }
}
