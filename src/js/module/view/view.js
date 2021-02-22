import { DEFAULT_VIEW_ELEMENTS, GAME_SOUND_CORRECT_URL, GAME_SOUND_ERROR_URL,
    GAME_SOUND_SUCCESS_URL, GAME_SOUND_FAIL_URL } from './consts';
import Card from './card';
import WordCard from './wordCard';
import { createAudio, playAudio } from './utils';

import NAMED_CATEGORIES from '../controller/consts';


export default class View {
    constructor(options) {
        this.cardsContainer = document.querySelector(options.containerSelector);
        this.menuContainer = document.querySelector(options.menuSelector);
        this.elements = {
            ...DEFAULT_VIEW_ELEMENTS
        };
    }

    renderCategoriesCards(categories, isTrain) {
        this.clearCards();
        for (const category of categories) {
            const card = new Card({
                parent: this.cardsContainer,
                categoryName: category.categoryName,
                words: category.words,
                img: category.cover,
                isTrain
            });
            const cardBody = card.createCard();
            this.elements.CURRENT_CARDS.push(card);
            this.cardsContainer.appendChild(cardBody);
        }
    }

    renderWordsCards(categoryName, activeWordsCards, isTrain) {
        this.clearCards();
        for (const card of activeWordsCards) {
            const wordCard = new WordCard({
                parent: this.cardsContainer,
                categoryName,
                isTrain,
                word: card.word,
                translation: card.translation,
                img: card.img,
                audioFile: card.audioFile
            });
            const wordCardBody = wordCard.createCard();
            this.elements.CURRENT_CARDS.push(wordCard);
            this.cardsContainer.appendChild(wordCardBody);
        }
    }

    renderMenu(categories) {
        this.clearMenu();
        const fragment = document.createDocumentFragment();
        for (let i = 0; i <= categories.length + 1; i++) {
            const listItem = document.createElement('li');
            listItem.classList.add('nav__item');
            if (i === 0) {
                listItem.innerText = NAMED_CATEGORIES.HOME;
                listItem.setAttribute('data-words', 'home');
                listItem.setAttribute('data-category', NAMED_CATEGORIES.HOME);
                listItem.classList.add('nav__item--active');
                this.elements.ACTIVE_MENU_ITEM = listItem;
            } else if (i <= categories.length) {
                listItem.innerText = categories[i - 1].categoryName;
                listItem.setAttribute('data-words', categories[i - 1].words);
                listItem.setAttribute('data-category', categories[i - 1].categoryName);
            } else {
                listItem.innerText = NAMED_CATEGORIES.STAT;
                listItem.setAttribute('data-words', 'stat');
                listItem.setAttribute('data-category', NAMED_CATEGORIES.STAT);
                listItem.classList.add('nav__item--stat');
            }
            this.elements.MENU_ITEMS.push(listItem);
            fragment.appendChild(listItem);
        }
        this.menuContainer.appendChild(fragment);
    }

    setMenuToggleBtn() {
        this.elements.MENU_TOGGLE = document.querySelector('.toggle__inner');
        this.elements.MENU_BODY = document.querySelector('.nav__list');
        this.elements.MENU_OVERLAY = document.querySelector('.page-header__overlay');
    }

    toggleMenu() {
        this.elements.MENU_TOGGLE.classList.toggle('toggle__inner--close');
        this.elements.MENU_BODY.classList.toggle('nav__list--close');
        this.elements.MENU_OVERLAY.classList.toggle('page-header__overlay--hidden');
    }

    updateMenuItems(categoryName) {
        for (const menuItem of this.elements.MENU_ITEMS) {
            if (menuItem.getAttribute('data-category') == categoryName) {
                this.elements.ACTIVE_MENU_ITEM.classList.remove('nav__item--active');
                menuItem.classList.add('nav__item--active');
                this.elements.ACTIVE_MENU_ITEM = menuItem;
                if (this.elements.START_BTN) { this.removeStartBtn(); }
            }
        }
        if (this.elements.MENU_OPEN) {
            this.elements.MENU_OPEN = !this.elements.MENU_OPEN;
            this.toggleMenu();
        }
    }

    clearCards() {
        this.cardsContainer.innerHTML = '';
        this.elements.CURRENT_CARDS = [];
    }

    clearMenu() {
        this.menuContainer.innerHTML = '';
        this.elements.MENU_ITEMS = [];
    }

    togglePlayMode() {
        const trainPlayToggle = document.querySelector('.train-play__container');
        const trainPlayText = document.querySelector('.train-play__txt');
        trainPlayToggle.classList.toggle('train-play__container--play');
        trainPlayText.innerText = (trainPlayText.innerText == 'Train') ? 'Play' : 'Train';
        for (const currentCard of this.elements.CURRENT_CARDS) {
            currentCard.togglePlayMode();
        }
    }

    renderStartBtn() {
        this.elements.START_BTN = document.createElement('button');
        this.elements.START_BTN.classList.add('main-content__start');
        this.elements.START_BTN.innerHTML = 'Start game!';
        this.cardsContainer.insertAdjacentElement('afterend', this.elements.START_BTN);
    }

    updateStartBtn() {
        this.elements.START_BTN.innerHTML = 'Repeat word  <i class="material-icons  main-content__start--icon">replay</i>';
    }

    removeStartBtn() {
        this.elements.START_BTN.remove();
        this.elements.START_BTN = DEFAULT_VIEW_ELEMENTS.START_BTN;
    }

    createScoreStars() {
        this.elements.STARS_BG = document.querySelector('.page-header__title-container');
        this.elements.STARS_BG.classList.add('page-header__title-container--play');
        this.elements.STARS_CONTAINER = document.querySelector('.game__stars-inner');
    }

    clearScoreStars() {
        let child = this.elements.STARS_CONTAINER.lastElementChild;
        while (child) {
            this.elements.STARS_CONTAINER.removeChild(child);
            child = this.elements.STARS_CONTAINER.lastElementChild;
        }
        this.elements.STARS_BG.classList.remove('page-header__title-container--play');
    }

    updateScoreStars(typeOfStar) {
        const star = document.createElement('div');
        star.classList.add('game__star');
        let sound;
        if (typeOfStar != 'right') {
            star.classList.add('game__star--false');
            sound = createAudio(GAME_SOUND_ERROR_URL);
        } else {
            sound = createAudio(GAME_SOUND_CORRECT_URL);
        }
        playAudio(sound);
        this.elements.STARS_CONTAINER.append(star);
    }

    renderFinalMessage(isWin, wrongWordsCount) {
        const msgContainer = document.querySelector('.game__message-container');
        msgContainer.classList.remove('game__message-container--hide');
        const msgImg = document.querySelector('.game__message');
        let sound;
        if (isWin) {
            msgImg.classList.add('game__message--success');
            sound = createAudio(GAME_SOUND_SUCCESS_URL);
        } else {
            msgImg.classList.add('game__message--fail');
            sound = createAudio(GAME_SOUND_FAIL_URL);
        }
        playAudio(sound);
        const msg = document.querySelector('.game__message-txt');
        msg.innerHTML = (isWin) ? 'Well done!' : `Mistakes <br>count: ${wrongWordsCount}`;
        this.clearGameField();
        setTimeout(() => {
            msgContainer.classList.add('game__message-container--hide');
            if (isWin) {
                msgImg.classList.remove('game__message--success');
            } else {
                msgImg.classList.remove('game__message--fail');
            }
            msg.innerHTML = '';
        }, 2600);
    }

    clearGameField() {
        this.clearCards();
        this.removeStartBtn();
        this.clearScoreStars();
        this.togglePlayMode();
    }


    renderStat(data) {
        this.clearCards();
        this.elements.STAT_CONTAINER = document.createElement('div');
        this.elements.STAT_CONTAINER.classList.add('statistics');
        this.elements.STAT_CONTAINER.innerHTML = '<h2 class="statistics__header">Your statistics</h2>';
        const description = document.createElement('p');
        description.classList.add('statistics__description');
        description.innerText = `TCC - сколько раз по карточки с данным словом кликали в режиме тренировки (train clicks count),
            CGC - сколько раз данное слово угадывали в режиме игры (correct guesses count),
            EGC - сколько ошибок при этом допустили (error guesses count),
            CG% - процент правильных ответов по каждому слову в режиме игры (% of correct guesses)`;
        this.elements.STAT_CONTAINER.append(description);

        this.createStatResetBtn();
        this.elements.STAT_CONTAINER.append(this.elements.STAT_RESET_BTN);
        this.createStatRepeatBtn();
        this.elements.STAT_CONTAINER.append(this.elements.STAT_REPEAT_BTN);

        if (!this.elements.STAT_SORT_BTNS) {
            this.createStatSortBtns(data[0]);
        }
        this.elements.STAT_CONTAINER.append(this.elements.STAT_BTNS_CONTAINER);
        this.renderStatTable(data);
        this.cardsContainer.append(this.elements.STAT_CONTAINER);
    }

    renderStatTable(data) {
        if (this.elements.STAT_CONTAINER.contains(this.elements.STAT_TABLE)) {
            this.elements.STAT_TABLE.remove();
        }
        this.elements.STAT_TABLE = document.createElement('div');
        this.elements.STAT_TABLE.classList.add('statistics__table-container');
        const table = document.createElement('table');
        table.classList.add('statistics__table');
        for (const line of data) {
            const tr = document.createElement('tr');
            tr.classList.add('statistics__row');
            if (line[1] == 'Word') {
                tr.classList.add('statistics__row--header');
            }
            for (let i = 0; i < line.length; i++) {
                const cell = document.createElement('td');
                cell.classList.add('statistics__cell');
                cell.classList.add(`statistics__cell--0${i + 1}`);
                cell.innerText = line[i];
                tr.append(cell);
            }
            table.append(tr);
        }
        this.elements.STAT_TABLE.append(table);
        this.elements.STAT_CONTAINER.append(this.elements.STAT_TABLE);
    }

    createStatResetBtn() {
        this.elements.STAT_RESET_BTN = document.createElement('button');
        this.elements.STAT_RESET_BTN.classList.add('statistics__reset-btn');
        this.elements.STAT_RESET_BTN.innerText = 'Reset';
    }

    createStatRepeatBtn() {
        this.elements.STAT_REPEAT_BTN = document.createElement('button');
        this.elements.STAT_REPEAT_BTN.classList.add('statistics__reset-btn');
        this.elements.STAT_REPEAT_BTN.innerText = 'Repeat difficult words';
    }

    createStatSortBtns(headerLine) {
        this.elements.STAT_SORT_BTNS = [];
        this.elements.STAT_BTNS_CONTAINER = document.createElement('div');
        this.elements.STAT_BTNS_CONTAINER.classList.add('statistics__btns');
        this.elements.STAT_BTNS_CONTAINER.innerText = 'Sort by: ';
        for (const item of headerLine) {
            const btn = document.createElement('button');
            btn.classList.add('statistics__btn');
            btn.innerText = item;
            this.elements.STAT_SORT_BTNS.push(btn);
            this.elements.STAT_BTNS_CONTAINER.append(btn);
        }
        this.elements.STAT_SORT_TOGGLE = document.createElement('div');
        this.elements.STAT_SORT_TOGGLE.classList.add('statistics__toggle');
        this.elements.STAT_SORT_TOGGLE.innerHTML = '<p class="statistics__toggle-text">Descending order</p>';
        this.elements.STAT_BTNS_CONTAINER.append(this.elements.STAT_SORT_TOGGLE);
    }

    updateStatBtns(btn) {
        this.unpressStatSortingBtns();
        btn.classList.add('statistics__btn--active');
    }

    toggleStatSorting(isDescending) {
        this.elements.STAT_SORT_TOGGLE.classList.toggle('statistics__toggle--ascending');
        if (isDescending) {
            this.elements.STAT_SORT_TOGGLE.innerHTML = '<p class="statistics__toggle-text">Descending order</p>';
        } else {
            this.elements.STAT_SORT_TOGGLE.innerHTML = '<p class="statistics__toggle-text">Ascending order</p>';
        }
    }

    unpressStatSortingBtns() {
        for (const statBtn of this.elements.STAT_SORT_BTNS) {
            if (statBtn.classList.contains('statistics__btn--active')) {
                statBtn.classList.remove('statistics__btn--active');
            }
        }
    }
}
