import DS from 'ember-data';

export default DS.RESTSerializer.extend({
  primaryKey: 'id',
  keyForRelationship: function(attr /*, relationshipType, method*/) {
    return attr + "_id";
  }
});
