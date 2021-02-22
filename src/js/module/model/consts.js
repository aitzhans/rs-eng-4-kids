export const DEFAULT_MODEL_ELEMENTS = {
    CATEGORIES: null,
    ACTIVE_CATEGORY: null,
    ACTIVE_WORDS_CARDS: null,
    IS_TRAIN: true,
};

export const DEFAULT_MODEL_GAME_ELEMENTS = {
    GAME_WORDS: null,
    CURRENT_GAME_WORD: null,
    CORRECT_WORDS_COUNT: 0,
    WRONG_WORDS_COUNT: 0,
    IS_WIN: null,
};

// TCC - train clicks count, CGC - correct game clicks, EGC - error game clicks, CG% - % of correct guesses
export const STATISTIC_HEADER_LINE = ['Category name', 'Word', 'Translation', 'TCC', 'CGC', 'EGC', 'CG%'];

export const INDEXOFWORD = STATISTIC_HEADER_LINE.indexOf('Word');
export const INDEXOFTCC = STATISTIC_HEADER_LINE.indexOf('TCC');
export const INDEXOFCGC = STATISTIC_HEADER_LINE.indexOf('CGC');
export const INDEXOFEGC = STATISTIC_HEADER_LINE.indexOf('EGC');
export const INDEXOFCGP = STATISTIC_HEADER_LINE.indexOf('CG%');
export const MAX_DIFFICULT_WORDS_COUNT = 8;
