
const memory = {};

export default function checkCondition(field, values) {
  const condition = field.condition;
  if (!condition) return true;

  try {
    return formConditionEvaluation(condition, values);
  } catch (e) {
    console.error(e, condition);
    return false;
  }
}


function formConditionEvaluation (str, values)  {
  const valuesDict = {};
  Object.keys(values).forEach((key) => {
    valuesDict[key] = values[key].value;
  });

  const valuesJson = JSON.stringify(valuesDict);
  if (memory[str] && memory[str][valuesJson]) {
    return memory[str][valuesJson];
  }
  if (!memory[str]) memory[str] = {};
  memory[str][valuesJson] = calculateNestedCondition(str, valuesDict);
  setTimeout(() => {
    delete (memory[str][valuesJson]);
  }, 60 * 1000);

  return memory[str][valuesJson];
};

const comparisonOperatorsFunctions = {
  '==': (a, b) => a == b,
  '!=': (a, b) => a != b,
  '>': (a, b) => a > b,
  '<': (a, b) => a < b,
  '>=': (a, b) => a >= b,
  '<=': (a, b) => a <= b,
  '*': (a, b) => true,
  '!*': (a, b) => true,
};

const comparisonOperators = ['==', '!=', '>=', '<=', '>', '<', '*', '!*'];
const exprRegExp = /\[.+?\]/g;
const condRegExp = /\([^\)\(]+?\)/g;

const parseIfNumber = (v) => {
  if (!v || !(typeof v === 'string' || v instanceof String)) return v;
  const preParse = v.replace(/\s/g, '');
  if (isNaN(preParse)) return v;
  return Number(preParse);
};

const calculateSingleExpression = (exprasion, values) => {
  const compOperator = comparisonOperators.find((op) => exprasion.indexOf(op) > -1);

  if (compOperator) {
    const [leftValueKey, rightValueKey] = exprasion.split(compOperator);

    const a = parseIfNumber(values[leftValueKey]);
    const b = parseIfNumber(rightValueKey);

    return comparisonOperatorsFunctions[compOperator](a, b);
  }
  return true;
};

const getBooleanFromString = (e) => e !== 'false' && (e === 'true' || Boolean(Number(e)));
const calculateAnd = (f) => (str) => str.split('&&').reduce((a, e) => a && f(e), true);
const calculateOr = (f) => (str) => str.split('||').reduce((a, e) => a || f(e), false);
const calculateAndWithBoolFromStr = calculateAnd(getBooleanFromString);
const calculateOrWithBoolAnd = calculateOr(calculateAndWithBoolFromStr);
const calculateSingleCondition = (condition) => calculateOrWithBoolAnd(condition);

const replaceExpression = (values) => (expElement) => calculateSingleExpression(expElement.replace(/[\[\]]/g, ''), values);
const replaceExpressionsInString = (exprassion, values) => exprassion.replace(exprRegExp, replaceExpression(values));

const replaceCondition = (condition) => condition.replace(/[\)\(]/g, '');
const calculateCondition = (condition, values) => calculateSingleCondition(replaceExpressionsInString(condition, values));
const calculateNestedCondition = (nestedCondition, values) => {
  if (!condRegExp.test(nestedCondition)) return calculateCondition(nestedCondition, values);

  const nestedReplaced = nestedCondition.replace(nestedCondition, (cond) => calculateCondition(replaceCondition(cond), values));
  return calculateNestedCondition(nestedReplaced, values);
};
