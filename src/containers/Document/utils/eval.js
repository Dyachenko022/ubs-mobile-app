const comparisonOperatorsFunctions = {
  '==' : (a, b) => a == b,
  '!=' : (a, b) => a != b,
  '>' : (a, b) => a > b ,
  '<' : (a, b) => a < b,
  '>=': (a, b) => a >= b,
  '<=': (a, b) => a <= b,
  '*': (a, b) => true,
  '!*': (a, b) => true
};
const comparisonOperators = ['==', '!=', '>=', '<=', '>', '<', '*', '!*'];
const exprRegExp = /\[.+?\]/g;
const condRegExp = /\([^\)\(]+?\)/g;

const calculateSingleExpression = (exprasion, values) => {
  const compOperator = comparisonOperators.find(op => exprasion.indexOf(op) > -1);

  if (compOperator) {
    const [leftValueKey, rightValueKey] = exprasion.split(compOperator);
    return comparisonOperatorsFunctions[compOperator](values[leftValueKey], rightValueKey);
  } else {
    return true;
  }
};

const log = (f) => (e) => {console.log(e); return f(e)};

const getBooleanFromString = e => e !== 'false' && (e === 'true' || Boolean(Number(e)));
const calculateAnd = f => str => str.split('&&').reduce((a, e) => a && f(e), true);
const calculateOr = f => str => str.split('||').reduce((a, e) => a || f(e), false);
const calculateAndWithBoolFromStr = calculateAnd(getBooleanFromString);
const calculateOrWithBoolAnd = calculateOr(calculateAndWithBoolFromStr);
const calculateSingleCondition = (condition) => calculateOrWithBoolAnd(condition);

const replaceExpression = values => expElement => calculateSingleExpression(expElement.replace(/[\[\]]/g, ''), values);
const replaceExpressionsInString = (exprassion, values) => exprassion.replace(exprRegExp, replaceExpression(values));

const replaceCondition = condition => condition.replace(/[\)\(]/g, '');
const calculateCondition = (condition, values) => {
  const r = calculateSingleCondition(replaceExpressionsInString(condition, values));
  return r;
}
const calculateNestedCondition = (nestedCondition, values) => {
  if (!condRegExp.test(nestedCondition)) return calculateCondition(nestedCondition, values);

  const nestedReplaced = nestedCondition.replace(nestedCondition, (cond) => calculateCondition(replaceCondition(cond), values));
  return calculateNestedCondition(nestedReplaced, values);
};

const memory = {};
const isCache = true;
export const formEval = (str, values) => {
  const valuesDict = {};
  str = str.replace(/ ?&& ?/g, '&&').replace(/ ?\|\| ?/g, '||');

  Object.keys(values).forEach(key => {
    valuesDict[key] = values[key].value
  });

  const valuesJson = JSON.stringify(valuesDict);
  if (isCache && memory[str] && memory[str][valuesJson]) {
    return memory[str][valuesJson];
  }
  if (!memory[str]) memory[str] = {};

  memory[str][valuesJson] = calculateNestedCondition(str, valuesDict);

  setTimeout(() => {
    delete(memory[str][valuesJson]);
  }, 60 * 1000);

  return memory[str][valuesJson]
};