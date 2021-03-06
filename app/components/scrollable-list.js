import Ember from 'ember';
import { PerfectScrollbarMixin } from 'ember-perfect-scrollbar';

export default Ember.Component.extend(PerfectScrollbarMixin, {

  classNames: ['scrollable_list'],

  classNameBindings: ['scrollbars:scrollable_list--with-scrollbars'],

});
