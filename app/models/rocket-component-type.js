import Model from 'ember-data/model';
import attr from 'ember-data/attr';
// import { belongsTo, hasMany } from 'ember-data/relationships';

export default Model.extend({
    type: attr('String'),
    costs: attr('number'),
    seconds_needed_for_construction: attr('number')
});
