public class BankTheme: NSObject, BankThemeBase {
  
  public var color1: String = "#24207D";
  
  public var serverUrl: String = "https://online.crocusbank.ru'";
  public var udSuiteName: String = "krk";
  public var allowShowCvvCode = false
  public var showNotificationsSetting = true
  public var showBonusesPage: Bool = false
  public var statusBarTheme: String = "light"
  public var bankPhoneNumber = "+74952281244"
  public var navigationBackgroundColor: String = "#24207D"
  public var allowAddCardsToWallet = false
  public var showPersonalOffersOnMyBankPage = true;
  public var defaultMapLocation: MapLocation = MapLocation(latitude: "55.824430", longitude: "37.388902")
  public var pushNotificationsUsed: Bool = false
  public var bankMessagesUsed: Bool = true
  
  public var codeSettingPageTheme: CodeSettingPageTheme?
  
  override init() {
    self.codeSettingPageTheme = CodeSettingPageTheme(backgroundColor: self.color1,
                                       buttonBackgroundColor: "white",
                                       buttonBorderColor: self.color1,
                                       buttonTextColor: self.color1,
                                       textColor: "white",
                                       indicatorBorderColor: "white",
                                       indicatorEmptyBackgroundColor: "transparent",
                                       indicatorFullBackgroundColor: "white"
    )
  }
}


