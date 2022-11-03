import {SettingsFront} from "../../api/actionTypes";

const initialState = {
  nMaxBonusesSelected: 1,
  forbidSaveAsTemplate: [],
  bankInfo: {},
  linkLogo: '',
  registrationPage: {},
  maxUploadFileSize: 200000,
  allowedFiles: ['pdf', 'docx'],
  colorDiagram: [],
  aboutFormLinks: [],
  informationAboutSecurity: '',
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SettingsFront.SUC:
      return {
        ...initialState,
        nMaxBonusesSelected: action.payload.nMaxBonusesSelected,
        forbidSaveAsTemplate: action.payload.forbidSaveAsTemplate,
        bankInfo: action.payload.bankInfo,
        linkLogo: action.payload.linkLogo,
        linkTariffs: action.payload.registrationPage && action.payload.registrationPage.tariffsLink &&  action.payload.registrationPage.tariffsLink.link,
        linkSpecification: action.payload.registrationPage && action.payload.registrationPage.specificationLink && action.payload.registrationPage.specificationLink.link,
        registrationPage: action.payload.registrationPage && action.payload.registrationPage,
        maxUploadFileSize:  action.payload.documentPage && action.payload.documentPage.maxUploadFileSize,
        allowedFiles:  action.payload.documentPage && action.payload.documentPage.allowedFiles,
        colorDiagram: action.payload.colorDiagram,
        aboutFormLinks: action.payload.mobileAppInfoForm,
        informationAboutSecurity: action.payload.informationAboutSecurity,
      }
  }
  return state;
}
