import {HistoryPage as types, LoginPage} from "../../api/actionTypes";

const initialState = {
  data: [],
  sections: [],
  refreshing: false,
  count: 0,
};

export default function historyPage(state = initialState, action = {}) {
  switch (action.type) {
    case LoginPage.EXIT_SUC:
      return {...initialState};

    case types.GET_OPERATIONS_REQ:
      return {
        ...state,
        refreshing: true
      };
    case types.GET_OPERATIONS_SUC:
      let data = action.clear ? [...action.data] : [...state.data, ...action.data];

      let sections = [];
      let order = [];
      let operations = {};

      data.forEach(el => {
        let date = el.date;

        if (operations[date]) {
          operations[date].push(el);
        } else {
          operations[date] = [el];
          order.push(date);
        }
      });

      order.forEach((date, idx) => {
        if (idx === order.length-1) {
          sections.push({ title: date, data: [...operations[date], { end: true }] })
        } else {
          sections.push({title: date, data: operations[date]})
        }
      });
      const count = sections.reduce((acc, value) => acc + value.data.length, 0);
      return {
        ...state,
        data,
        operations,//: [...state.operations, ...action.operations],
        sections,//: [...state.sections, ...action.sections],
        count,
        refreshing: false
      };

    case types.CLEAR:
      return {
        ...state,
        data: [],
        sections: [],
        refreshing: false
      };
    case types.GET_OPERATIONS_FAI:
      return {
        ...state,
        refreshing: false
      };
    default:
      return state;
  }
}
