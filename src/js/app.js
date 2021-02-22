import Model from './module/model/model';
import View from './module/view/view';
import Controller from './module/controller/controller';

const model = new Model({
    dataUrl: 'categories.json'
});

const view = new View({
    containerSelector: '.main-content__container',
    menuSelector: '.nav__list'
});

const controller = new Controller(model, view);
controller.init();
