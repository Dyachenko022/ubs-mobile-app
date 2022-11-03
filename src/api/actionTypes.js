export const Registration = {
  REQ: 'Registration_REQ',
  SUC: 'Registration_SUC',
  FAI: 'Registration_ERR'
};
export const RegistrationApp = {
  REQ: 'RegistrationApp_REQ',
  SUC: 'RegistrationApp_SUC',
  FAI: 'RegistrationApp_ERR'
};

export const BankInquiries = {
  REQ: 'Bankinquiries_REC',
  SUC: 'BankInquiries_SUC',
  FAI: 'Bankinquiries_ERR',
}

export const GetNotifications = {
  REQ: 'GET_NOTIFICATIONS_REQ',
  SUC: 'GET_NOTIFICATIONS_SUC',
  FAI: 'GET_NOTIFICATIONS_FAI',
}

export const GetUnreadNotifications = {
  REQ: 'GET_UNREAD_NOTIFICATIONS_REQ',
  SUC: 'GET_UNREAD_NOTIFICATIONS_SUC',
}

export const BankInquiriesToOrder = {
  REQ: 'BankinquiriesToOrder_REC',
  SUC: 'BankInquiriesToOrder_SUC',
  FAI: 'BankinquiriesToOrder_ERR',
}

export const RegistrationAppNew = {
  REQ: 'RegistrationAppNew_REQ',
  SUC: 'RegistrationAppNew_SUC',
  FAI: 'RegistrationAppNew_ERR'
};
export const RegistrationConfirm = {
  REQ: 'RegistrationConfirm_REQ',
  SUC: 'RegistrationConfirm_SUC',
  FAI: 'RegistrationConfirm_ERR'
};

export const SettingsFront = {
  SUC: 'settingsfrontSuccess',
};

export const personalOffers = {
  SUC: 'personalOffers_SUC',
  OFFER_DESCRIPTION_SUC: 'personaloffersDescription_SUC',
};

export const GetServiceBranch = {
  REQ: 'GetServiceBranch_REQ',
  SUC: 'GetServiceBranch_SUC',
  FAI: 'GetServiceBranch_ERR',

  SET_API_ROUTE: 'SET_API_ROUTE'
};

export const Errors = {
  GLOBAL_ERROR_SHOW: 'GLOBAL_ERROR_SHOW',
  GLOBAL_ERROR_HIDE: 'GLOBAL_ERROR_HIDE'
};

export const UserInfo = {
  GET_USER_PHOTO_REQ: `REQUEST/UserInfo.GET_USER_PHOTO`,
  GET_USER_PHOTO_SUC: `SUCCESS/UserInfo.GET_USER_PHOTO`,
  GET_USER_PHOTO_FAI: `FAILURE/UserInfo.GET_USER_PHOTO`,

  GET_USER_INFO_REQ: `REQUEST/UserInfo.GET_USER_INFO_REQ`,
  GET_USER_INFO_SUC: `SUCCESS/UserInfo.GET_USER_INFO_SUC`,
  GET_USER_INFO_FAI: `FAILURE/UserInfo.GET_USER_INFO_FAI`,

  CHECK_CONTRACT_DATA: 'userInfo/CHECK_CONTRACT_DATA',
};

export const MessagesPage = {
  GET_MESSAGES_REQ: `REQUEST/GET_MESSAGES`,
  GET_MESSAGES_SUC: `SUCCESS/GET_MESSAGES`,
  GET_MESSAGES_FAI: `FAILURE/GET_MESSAGES`,

  READ_MESSAGE_REQ: `REQUEST/READ_MESSAGE`,
  READ_MESSAGE_SUC: `SUCCESS/READ_MESSAGE`,
  READ_MESSAGE_FAI: `FAILURE/READ_MESSAGE`,

  GET_SENT_MESSAGES_REQ: '[REQ] Messages -> sent messages',
  GET_SENT_MESSAGES_SUC: '[SUC] Messages -> sent messages',
  GET_SENT_MESSAGES_FAI: '[FAI] Messages -> sent messages',

  READ_SENT_MESSAGES_REQ: '[REQ] Messages -> read out message',
  READ_SENT_MESSAGES_SUC: '[SUC] Messages -> read out message',
  READ_SENT_MESSAGES_FAI: '[FAI] Messages -> read out message',

  STATE_MESSAGE_REQ: `REQUEST/STATE_MESSAGE`,
  STATE_MESSAGE_SUC: `SUCCESS/STATE_MESSAGE`,
  STATE_MESSAGE_FAI: `FAILURE/STATE_MESSAGE`
};

export const TemplatesPage = {
  GET_TEMPLATES_REQ: `REQUEST/[REQ] -> GET templates`,
  GET_TEMPLATES_SUC: `SUCCESS/[SUC] -> GET templates`,
  GET_TEMPLATES_FAI: `FAILURE/[FAI] -> GET templates`,

  DELETE_TEMPLATE_REQ: `REQUEST/[REQ] -> DELETE template`,
  DELETE_TEMPLATE_SUC: `SUCCESS/[SUC] -> DELETE template`,
  DELETE_TEMPLATE_FAI: `FAILURE/[FAI] -> DELETE template`,

  RENAME_TEMPLATE_REQ: `REQUEST/[REQ] -> RENAME template`,
  RENAME_TEMPLATE_SUC: `SUCCESS/[SUC] -> RENAME template`,
  RENAME_TEMPLATE_FAI: `FAILURE/[FAI] -> RENAME template`
};

export const LoginPage = {
  GET_AD_REQ: `REQUEST/LoginPage.ad`,
  GET_AD_SUC: `SUCCESS/LoginPage.ad`,
  GET_AD_FAI: `FAILURE/LoginPage.ad`,

  GET_RATES_REQ: `REQUEST/rates`,
  GET_RATES_SUC: `SUCCESS/rates`,
  GET_RATES_FAI: `FAILURE/rates`,

  EXIT_REQ: 'REQUEST/EXIT',
  EXIT_SUC: 'SUCCESS/EXIT',
  EXIT_FAI: 'FAILURE/EXIT',

  AUTH_BASE_REQ: 'REQUEST/LoginPage.auth_base',
  AUTH_BASE_SUC: 'SUCCESS/LoginPage.auth_base',
  AUTH_BASE_FAI: 'FAILURE/LoginPage.auth_base',

  AUTH_CONTRACT_REQ: 'REQUEST/LoginPage.auth_contract',
  AUTH_CONTRACT_SUC: 'SUCCESS/LoginPage.auth_contract',
  AUTH_CONTRACT_FAI: 'FAILURE/LoginPage.auth_contract',

  AUTH_GET_CODE_REQ: 'REQUEST/LoginPage.auth_get_code',
  AUTH_GET_CODE_SUC: 'SUCCESS/LoginPage.auth_get_code',
  AUTH_GET_CODE_FAI: 'FAILURE/LoginPage.auth_get_code',

  AUTH_CONFIRM_REQ: 'REQUEST/LoginPage.auth_confirm',
  AUTH_CONFIRM_SUC: 'SUCCESS/LoginPage.auth_confirm',
  AUTH_CONFIRM_FAI: 'FAILURE/LoginPage.auth_confirm'
};

export const NewProductsPage = {
  GET_NEW_PRODUCTS: 'request/GetNewProducts',
  GET_NEW_PRODUCTS_SUC: 'request/GetNewProductsSuc',
  GET_NEW_PRODUCTS_ERR: 'requst/GetNewProductsErr',
};

export const NewsPage = {
  GET_NEWS_REQ: `REQUEST/NewsPage.news`,
  GET_NEWS_SUC: `SUCCESS/NewsPage.news`,
  GET_NEWS_FAI: `FAILURE/NewsPage.news`,
};

export const MapPage = {
  GET_MAP_REQ: `REQUEST/MapPage.points`,
  GET_MAP_SUC: `SUCCESS/MapPage.points`,
  GET_MAP_FAI: `FAILURE/MapPage.points`,

  SET_FILTER_TYPES: `SET/MapPage.filterTypes`,
};

export const MyBankPage = {
  GET_CARDS_REQ: 'REQUEST/MyBankPage.get_cards',
  GET_CARDS_SUC: 'SUCCESS/MyBankPage.get_cards',
  GET_CARDS_FAI: 'FAILURE/MyBankPage.get_cards',

  GET_CREDITS_REQ: 'REQUEST/MyBankPage.get_credits',
  GET_CREDITS_SUC: 'SUCCESS/MyBankPage.get_credits',
  GET_CREDITS_FAI: 'FAILURE/MyBankPage.get_credits',

  GET_DEPOSITS_REQ: 'REQUEST/MyBankPage.get_deposits',
  GET_DEPOSITS_SUC: 'SUCCESS/MyBankPage.get_deposits',
  GET_DEPOSITS_FAI: 'FAILURE/MyBankPage.get_deposits',

  GET_ACCOUNTS_REQ: 'REQUEST/MyBankPage.get_accounts',
  GET_ACCOUNTS_SUC: 'SUCCESS/MyBankPage.get_accounts',
  GET_ACCOUNTS_FAI: 'FAILURE/MyBankPage.get_accounts',

  SYNC_REQ: 'REQUEST/SYNC',
  SYNC_SUC: 'SUCCESS/SYNC',
  SYNC_FAI: 'FAILURE/SYNC',
};

export const ProductPage = {
  GET_CARD_INFO_REQ:'REQUEST/ProductPage.get_card_info',
  GET_CARD_INFO_SUC:'SUCCESS/ProductPage.get_card_info',
  GET_CARD_INFO_FAI:'FAILURE/ProductPage.get_card_info',

  GET_WALLETS:'REQUEST/ProductPage.GET_WALLETS',
  GET_WALLETS_SUC:'SUCCESS/ProductPage.GET_WALLETS',
  GET_WALLETS_FAI:'FAILURE/ProductPage.GET_WALLETS',

  GetPayLoadToWallet:'REQUEST/ProductPage.GetPayLoadToWallet',
  GetPayLoadToWallet_SUC:'SUCCESS/ProductPage.GetPayLoadToWallet',
  GetPayLoadToWallet_FAI:'FAILURE/ProductPage.GetPayLoadToWallet',

  GET_CARD_OP_REQ: 'REQUEST/MyBankPage.get_card_operations',
  GET_CARD_OP_SUC: 'SUCCESS/MyBankPage.get_card_operations',
  GET_CARD_OP_FAI: 'FAILURE/MyBankPage.get_card_operations',


  GET_DEPOSIT_INFO_REQ:'REQUEST/ProductPage.get_DEPOSIT_info',
  GET_DEPOSIT_INFO_SUC:'SUCCESS/ProductPage.get_DEPOSIT_info',
  GET_DEPOSIT_INFO_FAI:'FAILURE/ProductPage.get_DEPOSIT_info',

  GET_DEPOSIT_OP_REQ: 'REQUEST/MyBankPage.get_DEPOSIT_operations',
  GET_DEPOSIT_OP_SUC: 'SUCCESS/MyBankPage.get_DEPOSIT_operations',
  GET_DEPOSIT_OP_FAI: 'FAILURE/MyBankPage.get_DEPOSIT_operations',

  GET_DEPOSIT_PROXY_REQ: 'REQUEST/MyBankPage.get_PROXY_operations',
  GET_DEPOSIT_PROXY_SUC: 'SUCCESS/MyBankPage.get_PROXY_operations',
  GET_DEPOSIT_PROXY_FAI: 'FAILURE/MyBankPage.get_PROXY_operations',


  GET_CREDIT_INFO_REQ:'REQUEST/ProductPage.get_CREDIT_info',
  GET_CREDIT_INFO_SUC:'SUCCESS/ProductPage.get_CREDIT_info',
  GET_CREDIT_INFO_FAI:'FAILURE/ProductPage.get_CREDIT_info',

  GET_CREDIT_OP_REQ: 'REQUEST/MyBankPage.get_CREDIT_operations',
  GET_CREDIT_OP_SUC: 'SUCCESS/MyBankPage.get_CREDIT_operations',
  GET_CREDIT_OP_FAI: 'FAILURE/MyBankPage.get_CREDIT_operations',

  GET_CREDIT_SCH_REQ: 'REQUEST/MyBankPage.get_CREDIT_schedules',
  GET_CREDIT_SCH_SUC: 'SUCCESS/MyBankPage.get_CREDIT_schedules',
  GET_CREDIT_SCH_FAI: 'FAILURE/MyBankPage.get_CREDIT_schedules',

  GET_ACCOUNT_INFO_REQ:'REQUEST/ProductPage.get_ACCOUNT_info',
  GET_ACCOUNT_INFO_SUC:'SUCCESS/ProductPage.get_ACCOUNT_info',
  GET_ACCOUNT_INFO_FAI:'FAILURE/ProductPage.get_ACCOUNT_info',

  GET_ACCOUNT_OP_REQ: 'REQUEST/MyBankPage.get_ACCOUNT_operations',
  GET_ACCOUNT_OP_SUC: 'SUCCESS/MyBankPage.get_ACCOUNT_operations',
  GET_ACCOUNT_OP_FAI: 'FAILURE/MyBankPage.get_ACCOUNT_operations',

  ACCOUNT_DETAILS_REQ: '[REQ] -> account details',
  ACCOUNT_DETAILS_SUC: '[SUC] -> account details',
  ACCOUNT_DETAILS_FAI: '[FAI] -> account details',

  GET_CARD2_PART_REQ: 'REQUEST/ProductPage.GET_CARD2_PART_REQ',
  GET_CARD2_PART_SUC: 'REQUEST/ProductPage.GET_CARD2_PART_SUC',

  GET_CARD_CVV_REQ : 'productPage/GET_CARD_CVV_REQ',
  GET_CARD_CVV_SUC : 'productPage/GET_CARD_CVV_SUC',

  EXTRACT_REQ: '[REQ] -> EXTRACT',
  EXTRACT_SUC: '[SUC] -> EXTRACT',
  EXTRACT_FAI: '[FAI] -> EXTRACT',

  CHANGE_ADDITIONAL_CARD__ACCESS_REQ: 'req/chagenadditioncardaccess',

  SetDescriptionProduct_REQ: '[REQ] => setDescriptionProduct',
  SetDescriptionProduct_SUC: '[SUC] => setDescriptionProduct',
  SetDescriptionProduct_FAI: '[FAI] => setDescriptionProduct',

  GET_OPERATION_ACCESS_REQ: 'productpage/getoperationaccessreq',
  GET_OPERATION_ACCESS_SUC: 'productpage/getoperationaccessSuc',
};

export const SbpAcceptancesPage = {
  GET_ACCEPTANCES_REQ: 'sbpa/get_acceptances_req',
  GET_ACCEPTANCES_SUC: 'sbpa/get_acceptances_suc',
  GET_ACCEPTANCES_ERR: 'sbpa/get_acceptances_err',
}

export const LimitsPage ={
  GET_LIMITS_REQ: 'req-get-limits',
  GET_LIMITS_SUC: 'req-get-limits-suc',
  GET_LIMITS_ERR: 'req-get-limits-err',
}

export const ProductsPage = {
  REQ_PARAM_CARD: '[REQ] -> paramProductCard',
  SUC_PARAM_CARD: '[SUC] -> paramProductCard',
  FAI_PARAM_CARD: '[FAI] -> paramProductCard',

  REQ_PARAM_CREDIT: '[REQ] -> paramProductCredit',
  SUC_PARAM_CREDIT: '[SUC] -> paramProductCredit',
  FAI_PARAM_CREDIT: '[FAI] -> paramProductCredit',

  REQ_PARAM_DEPOSIT: '[REQ] -> paramProductDeposit',
  SUC_PARAM_DEPOSIT: '[SUC] -> paramProductDeposit',
  FAI_PARAM_DEPOSIT: '[FAI] -> paramProductDeposit',

  REQ_PARAM_FIELDS: '[REQ] -> param fields new product',
  SUC_PARAM_FIELDS: '[SUC] -> param fields new product',
  FAI_PARAM_FIELDS: '[FAI] -> param fields new product',

  SET_FIELDS_VALUES: 'ProductsPage:SET_FIELDS_VALUE',
  CLEAR_FIELDS_VALUES: 'ProductsPage:CLEAR_FIELDS_VALUES',
};

export const HistoryPage = {
  GET_OPERATIONS_REQ:'REQUEST/HistoryPage.get_operations',
  GET_OPERATIONS_SUC:'SUCCESS/HistoryPage.get_operations',
  GET_OPERATIONS_FAI:'FAILURE/HistoryPage.get_operations',

  // GET_OPERATIONS_CLEAR: 'CLEAR/HistoryPage.get_operations'
  CLEAR: 'CLEAR/HistoryPage.get_operations'
};

export const SBPayScreen = {
  GET_SBPAY_TOKENS_REQ: 'getSbpayTokens_Req',
  GET_SBPAY_TOKENS_SUC: 'getSbpayTokens_Suc',
  GET_SBPAY_TOKENS_ERR: 'getSbpayTokens_err',
}

export const PaymentsPage = {
  GET_CONFIGURATION_REQ:'REQUEST/PaymentsPage.get_configuration',
  GET_CONFIGURATION_SUC:'SUCCESS/PaymentsPage.get_configuration',
  GET_CONFIGURATION_FAI:'FAILURE/PaymentsPage.get_configuration',

  GET_PROVIDERS_REQ:'REQUEST/PaymentsPage.get_providers',
  GET_PROVIDERS_SUC:'SUCCESS/PaymentsPage.get_providers',
  GET_PROVIDERS_FAI:'FAILURE/PaymentsPage.get_providers',

  GET_SYSTEMS_REQ:'REQUEST/PaymentsPage.get_systems',
  GET_SYSTEMS_SUC:'SUCCESS/PaymentsPage.get_systems',
  GET_SYSTEMS_FAI:'FAILURE/PaymentsPage.get_systems',

  GET_SERVICE_PAYMENT_REQ:'REQUEST/PaymentsPage.GET_SERVICE_PAYMENT_REQ',
  GET_SERVICE_PAYMENT_SUC:'SUCCESS/PaymentsPage.GET_SERVICE_PAYMENT_SUC',
  GET_SERVICE_PAYMENT_FAI:'FAILURE/PaymentsPage.GET_SERVICE_PAYMENT_FAI',

  SEND_REQUEST_PAYMENTS_SERVICE_REQ:'REQUEST/PaymentsPage.SEND_REQUEST_PAYMENTS_SERVICE_REQ',
  SEND_REQUEST_PAYMENTS_SERVICE_SUC:'SUCCESS/PaymentsPage.SEND_REQUEST_PAYMENTS_SERVICE_SUC',
  SEND_REQUEST_PAYMENTS_SERVICE_FAI:'FAILURE/PaymentsPage.SEND_REQUEST_PAYMENTS_SERVICE_FAI',
};

export const MyFinancesPage = {
  OP_PRODUCT_REQ: '[REQ] MyFinances -> operations Product',
  OP_PRODUCT_SUC: '[SUC] MyFinances -> operations Product',
  OP_PRODUCT_FAI: '[FAI] MyFinances -> operations Product',

  SET_IS_CREDIT: 'MyFinances/Set_IS_Credit'
};


export const BonusesPage = {
  BONUSES_REQ: '[REQ] Bonuses -> get bonuses',
  BONUSES_SUC: '[SUC] Bonuses -> get bonuses',
  BONUSES_FAI: '[FAI] Bonuses -> get bonuses',

  saveParamContract_REQ: '[REQ] Bonuses -> saveParamContract',
  saveParamContract_SUC: '[SUC] Bonuses -> saveParamContract',
  saveParamContract_FAI: '[FAI] Bonuses -> saveParamContract',
};


export const DocumentPage = {
  PRINT_DOCUMENT_REQ: '[REQ] -> PRINT_DOCUMENT',
  PRINT_DOCUMENT_SUC: '[SUC] -> PRINT_DOCUMENT',
  PRINT_DOCUMENT_FAI: '[FAI] -> PRINT_DOCUMENT',

  PRINT_DOCUMENT_HTML_REQ: '[REQ] -> PRINT_DOCUMENT_HTML',
  PRINT_DOCUMENT_HTML_SUC: '[SUC] -> PRINT_DOCUMENT_HTML',
  PRINT_DOCUMENT_HTML_FAI: '[FAI] -> PRINT_DOCUMENT_HTML'
};

export const SettingsPage = {
  SET_TOKEN_REQ: '[REQ] -> SET_TOKEN',
  SET_TOKEN_SUC: '[SUC] -> SET_TOKEN',
  SET_TOKEN_FAI: '[FAI] -> SET_TOKEN',

  ENABLED_PUSH_REQ: '[REQ] -> ENABLED_PUSH',
  ENABLED_PUSH_SUC: '[SUC] -> ENABLED_PUSH',
  ENABLED_PUSH_FAI: '[FAI] -> ENABLED_PUSH',

  DISABLED_PUSH_REQ: '[REQ] -> DISABLED_PUSH',
  DISABLED_PUSH_SUC: '[SUC] -> DISABLED_PUSH',
  DISABLED_PUSH_FAI: '[FAI] -> DISABLED_PUSH'
};


