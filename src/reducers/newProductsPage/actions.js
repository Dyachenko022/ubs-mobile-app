export const SELECT_CATEGORY = '/newproductspage/selectcategory';
export const APPLY_FILTER = '/newproductspage/applyFilter';
export const CLEAR_FILTER = '/newproductspage/clearFilter';


export function selectCategory(categoryIndex) {
  return {
    type: SELECT_CATEGORY,
    payload: categoryIndex,
  }
}

export function applyFilter(filter) {
  return {
    type: APPLY_FILTER,
    payload: filter,
  }
}

export function clearFilter() {
  return {
    type: CLEAR_FILTER,
  }
}
