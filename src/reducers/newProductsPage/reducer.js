import {NewProductsPage} from '../../api/actionTypes';
import {getPathDescr} from '../../api/actions';
import { isValidURL } from '../../utils/utils';
import * as actions from './actions';

const initialState = {
  products: [],
  categories: [],
  selectedCategoryIndex: -1,
  filter: {},
  filteredProducts: [],
  wasFetched: false,
  wasError: false,
};


export default function reducer(state = initialState, action = {}) {

  const filterByCategory = (indexCategory) => state.products.filter(item => item.sidCategories.includes(state.categories[indexCategory].sid));

  switch (action.type) {
    case NewProductsPage.GET_NEW_PRODUCTS_ERR:
      return {
        ...state,
        wasError: true,
      };
    case actions.CLEAR_FILTER:
      return {
        ...state,
        filteredProducts: filterByCategory(state.selectedCategoryIndex),
        filter: {},
      };
    case actions.SELECT_CATEGORY: {
      const selectedCategoryIndex = action.payload;

      const filteredProducts = filterByCategory(selectedCategoryIndex);

      return {
        ...state,
        filter: {},
        filteredProducts,
        selectedCategoryIndex,
      };
    }
    case actions.APPLY_FILTER : {
      const filter = action.payload;
      const sci = state.selectedCategoryIndex;
      let fp = filterByCategory(sci);
      fp = fp.filter(product => filterProducts(product, filter));
      return {
        ...state,
        filteredProducts: fp,
        filter,
      };
    }
    case NewProductsPage.GET_NEW_PRODUCTS_SUC:
      const categoryCounter = {};
      const data = action.payload;
      data.categories.forEach(item => categoryCounter[item.sid] = 0);
      data.products.forEach(product => {
        product.linkProduct = isValidURL(product.linkProduct) ? product.linkProduct : getPathDescr() + product.linkProduct;
        product.sidCategories.forEach(prodCategory => categoryCounter[prodCategory]++);
      });

      const categories = data.categories
        .filter(category => categoryCounter[category.sid] > 0)
        .map(category => ({...category, productCount: categoryCounter[category.sid]}));
      return {
        ...state,
        categories,
        filter: {},
        products: data.products,
        wasFetched: true,
        wasError: false,
      };
  }
  return state;
}



export const filterProducts = (product, filter) => {
  if (Object.keys(filter).length === 0) return true;

  for(const filterObject of product.filterParam) {

    let checkOneFilterObject = true;

    for (const filterFieldSid in filterObject) {
      //Сначала посмотрим задано ли у нас в фильтре значение для этого поля
      if(!filter[filterFieldSid]) continue;
      let valueInFilter =  filter[filterFieldSid].value;
      if (!valueInFilter) continue;

      if(valueInFilter.value) valueInFilter = valueInFilter.value; // Там может лежать объект {label;value}
      const filteredProductValue = filterObject[filterFieldSid];

      //Теперь проверим является ли значение поля массивом. И если да, то проверяем по нему.
      if (Array.isArray(filteredProductValue))
      {
        if (Array.isArray(valueInFilter)) {
          if (valueInFilter.length === 0) continue;
          if (valueInFilter[0].value) {  //Для ComboBoxMultiSelect это поля типа {value; label}
            valueInFilter = valueInFilter.map(item => item.value)
          }
          let hasIntersection = false;
          for (const d of valueInFilter) {
            if (!filteredProductValue.some(item => item == d)) { //Здесь нельзя использовать includes и надо использовать == для игнорирования проверки типа
              checkOneFilterObject = false;
              break;
            }
          }
        }
        else {
          if(!filteredProductValue.some(item => item ==valueInFilter)){
            checkOneFilterObject = false;
            break;
          }
        }
      }
      else {
        if (Array.isArray(valueInFilter)) {
          if (valueInFilter.length === 0) continue;
          if (valueInFilter[0].value) {  //Для ComboBoxMultiSelect это поля типа {value; label}
            valueInFilter = valueInFilter.map(item => item.value)
          }
          let hasIntersection = false;
         if (!valueInFilter.includes(filteredProductValue)) {
           checkOneFilterObject = false;
           break;
         }
        }
        if(!compareFunc(valueInFilter, filteredProductValue, filter[filterFieldSid].comparisionType))  {
          checkOneFilterObject = false;
          break;
        }
      }
    }
    if (checkOneFilterObject) {
      return true;
    }

  }
  return false;
};

function compareFunc(v1, v2, comparisionType = '=') {
  if (!isNaN(v1) && !isNaN(v2)) {
    v1 = Number(v1);
    v2 = Number(v2);
  }
  switch (comparisionType) {
    case '=': return v1 == v2;
    case '>': return v1 > v2;
    case '<': return v1 < v2;
    case '>=': return v1 >= v2;
    case '<=': return  v1 <= v2;
    case '!=': return v1 != v2;
    default: return v1 == v2;
  }
}
