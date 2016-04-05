import Ember from 'ember';

export function math(params/*, hash*/) {
  var operand1 = params[0];
  var operator = params[1];
  var operand2 = params[2];
  var result;

  switch (operator) {
      case '+':
          result = operand1 + operand2;
          break;
      case '-':
          result = operand1 - operand2;
          break;
      case '*':
          result = operand1 * operand2;
          break;
      case '/':
          result = operand1 / operand2;
          break;
  }

  return result;
}

export default Ember.Helper.helper(math);
