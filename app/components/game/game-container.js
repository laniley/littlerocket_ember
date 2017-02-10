import Ember from 'ember';
import { PerfectScrollbarMixin } from 'ember-perfect-scrollbar';

export default Ember.Component.extend(PerfectScrollbarMixin, {
    classNames: ['game-container']
});
