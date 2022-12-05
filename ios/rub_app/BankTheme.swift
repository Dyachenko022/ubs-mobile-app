public class BankTheme: NSObject, BankThemeBase {
  public var udSuiteName: String = "group.rub.notificationsService"
  public var color1: String = "#0970cd";
  public var serverUrl: String = "https://212.48.39.11:11443";
  public var showNotificationsSetting = false
  public var showQrCodeIcon = false
  public var showBonusesPage: Bool = false
  public var statusBarTheme: String = "light"
  public var navigationBackgroundColor: String = "#0970cd"
  public var allowAddCardsToWallet = false
  public var allowShowCvvCode = false
  public var showPersonalOffersOnMyBankPage = false
  public var bankPhoneNumber: String = "+74956483687"
  public var pushNotificationsUsed: Bool = false;
  public var bankMessagesUsed: Bool = true;

  public var defaultMapLocation: MapLocation = MapLocation(latitude: "55.761099", longitude: "37.654990")

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
