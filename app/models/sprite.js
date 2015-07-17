import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr("String"),
  sheet: DS.attr("String"),
  tileW: DS.attr("Number"),
  tileH: DS.attr("Number"),
  x: DS.attr("Number"),
  y: DS.attr("Number"),
  scale: DS.attr("Number")
});
