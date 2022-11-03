import {DocumentPage as types} from "../../api/actionTypes";

const initialState = {
  loading: true,

  documentFile: '',
  htmlFile: '',
  base64: '',
  src: ''
};

export default function documentPage(state = initialState, action = {}) {
  switch (action.type) {
    case types.PRINT_DOCUMENT_HTML_REQ:
      return {
        ...state,
        loading: true
      };
    case types.PRINT_DOCUMENT_HTML_SUC:
      return {
        ...state,
        loading: false,
        htmlFile: action.htmlFile
      };
    case types.PRINT_DOCUMENT_HTML_FAI:
      return {
        ...state,
        loading: false
      };
    case types.PRINT_DOCUMENT_REQ:
      return {
        ...state,
        loading: true
      };
    case types.PRINT_DOCUMENT_SUC:
      return {
        ...state,
        loading: false,
        base64: action.base64,
        documentFile: action.documentFile,
        src: action.src
      };
    case types.PRINT_DOCUMENT_FAI:
      return {
        ...state,
        loading: false
      };
    default:
      return state;
  }
}
