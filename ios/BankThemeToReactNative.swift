import Foundation

// Этот класс импортирует настройки для банка в Реакт Натив.
// Параметры настраиваются для каждого банка отдельно в файле BankTheme.swift

@objc(BankTheme)
internal class BankThemeToReactNative: BankTheme {
  
  public var ServerUrl: String {
    get {
      // В настройках для банков задан url для production!!!
      var serverUrl = self.serverUrl;
      
      // Если нужно тестировать, то тут можно поменять его
      // serverUrl = "https://test.unisab.ru:8064";  // HOT
      //  serverUrl = "https://test.unisab.ru:8095"; // MIS
      serverUrl = "https://test.unisab.ru"; // SATURN
      return serverUrl;
    }
  }
  
  public var UdSuiteName: String {
    get {
      return self.udSuiteName;
    }
  }
  
  @objc
  func constantsToExport() -> [String: Any]! {
    
    return [
      "color1": self.color1,
      "serverUrl": ServerUrl,
      "navigationBackgroundColor" : self.navigationBackgroundColor,
      "statusBarTheme": self.statusBarTheme,
      "defaultMapLocation": self.defaultMapLocation.nsDictionary,
      "showNotificationsSetting": self.showNotificationsSetting,
      "allowShowCvvCode": self.allowShowCvvCode,
      "showBonusesPage": self.showBonusesPage,
      "bankPhoneNumber": self.bankPhoneNumber,
      "allowAddCardsToWallet": self.allowAddCardsToWallet,
      "showPersonalOffersOnMyBankPage": self.showPersonalOffersOnMyBankPage,
      "pushNotificationsUsed": self.pushNotificationsUsed,
      "bankMessagesUsed": self.bankMessagesUsed,
    ]
  }
}
