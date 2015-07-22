import Ember from 'ember';

export function ifEquals(params /* hash */) {
  console.log(params[0], params[1]);
  if(params[0] === params[1]) {
    return true;
  }
  return false;
}

export default Ember.Helper.helper(ifEquals);
