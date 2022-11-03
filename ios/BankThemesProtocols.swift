// Настройка цветов на форме вводка кода
public struct CodeSettingPageTheme {
  var backgroundColor: String
  var buttonBackgroundColor: String
  var buttonBorderColor: String
  var buttonTextColor: String
  var textColor: String
  var indicatorBorderColor: String
  var indicatorEmptyBackgroundColor: String
  var indicatorFullBackgroundColor: String
  var dictionary: [String: Any] {
      return [
        "backgroundColor": backgroundColor,
        "buttonBackgroundColor": buttonBackgroundColor,
        "buttonBorderColor": buttonBorderColor,
        "buttonTextColor": buttonTextColor,
        "textColor": textColor,
        "indicatorBorderColor": indicatorBorderColor,
        "indicatorEmptyBackgroundColor": indicatorEmptyBackgroundColor,
        "indicatorFullBackgroundColor": indicatorFullBackgroundColor
      ]
  }
  var nsDictionary: NSDictionary {
      return dictionary as NSDictionary
  }
}

// Настройка координат карты по умолчанию
public struct MapLocation {
  var latitude: String
  var longitude: String
  var dictionary: [String: Any] {
      return ["latitude": latitude,
              "longitude": longitude,
            ]
  }
  var nsDictionary: NSDictionary {
      return dictionary as NSDictionary
  }
}

public protocol BankThemeBase {
  var serverUrl: String {get set};
  var color1: String {get set};
  var allowShowCvvCode: Bool {get set};
  var navigationBackgroundColor: String {get set};
  var statusBarTheme: String {get set};
  var showBonusesPage: Bool {get set};
  var allowAddCardsToWallet: Bool {get set};
  var showNotificationsSetting: Bool {get set};
  var defaultMapLocation: MapLocation {get set};
  var bankPhoneNumber: String {get set};
  
  var bankMessagesUsed: Bool {get set};
  var pushNotificationsUsed: Bool {get set};
  var codeSettingPageTheme: CodeSettingPageTheme? {get set};
  var showPersonalOffersOnMyBankPage: Bool {get set};
  var udSuiteName: String {get set};
}
