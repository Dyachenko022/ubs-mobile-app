
public class BankTheme: NSObject, BankThemeBase {
  public var color1: String = "#0078C9";
  public var udSuiteName: String = "group.rsi.notificationsService"
  public var serverUrl: String = "https://ib.bankrsi.ru:5555";
  public var allowShowCvvCode = false
  public var showNotificationsSetting = false
  public var showBonusesPage: Bool = false
  public var statusBarTheme: String = "light"
  public var navigationBackgroundColor: String = "#000"
  public var allowAddCardsToWallet = false
  public var showPersonalOffersOnMyBankPage = true;
  public var bankPhoneNumber = "+74959517253"
  public var pushNotificationsUsed: Bool = false
  public var bankMessagesUsed: Bool = true
  
  public var defaultMapLocation: MapLocation = MapLocation(latitude: "55.754219", longitude: "37.619715")
  
  public var codeSettingPageTheme: CodeSettingPageTheme?
  
}
