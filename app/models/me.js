/* global FB */
import DS from 'ember-data';

export default DS.Model.extend({
  isLoggedIn: DS.attr('boolean', { defaultValue: false })
});
