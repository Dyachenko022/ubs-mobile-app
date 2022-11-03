public class BankTheme: NSObject, BankThemeBase {
  public var color1: String = "#f47321";
  
  public var serverUrl: String = "https://on-linem.ipb.ru";
  public var udSuiteName: String = "group.ipb.notificationsService";
  public var showNotificationsSetting = true
  public var showBonusesPage: Bool = true
  public var statusBarTheme: String = "light"
  public var navigationBackgroundColor: String = "#f47321"
  public var allowAddCardsToWallet = true;
  public var showPersonalOffersOnMyBankPage = true
  public var allowShowCvvCode = false;
  public var bankPhoneNumber = "+74954110000"
  public var pushNotificationsUsed = true;
  public var bankMessagesUsed: Bool = false;
  
  public var defaultMapLocation: MapLocation = MapLocation(latitude: "55.661112", longitude: "37.626922")
  
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
