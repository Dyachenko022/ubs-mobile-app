
public class BankTheme: NSObject, BankThemeBase {
  public var color1: String = "#A52A2A";
  public var serverUrl: String = "https://dbo.bankelita.ru:444";
  public var udSuiteName: String = "elt";
  public var allowShowCvvCode = false;
  public var showNotificationsSetting = true
  public var showBonusesPage: Bool = false
  public var statusBarTheme: String = "light"
  public var navigationBackgroundColor: String = "#A52A2A"
  public var allowAddCardsToWallet = false
  public var bankPhoneNumber = "+74842721465"
  public var showPersonalOffersOnMyBankPage = true
  public var bankMessagesUsed: Bool = true
  public var pushNotificationsUsed: Bool = false
  public var defaultMapLocation: MapLocation = MapLocation(latitude: "54.511425", longitude: "36.259059")

  public var codeSettingPageTheme: CodeSettingPageTheme?

  override init() {
    self.codeSettingPageTheme = CodeSettingPageTheme(backgroundColor: "#fce3d7",
                                                     buttonBackgroundColor: self.color1,
                                       buttonBorderColor: self.color1,
                                       buttonTextColor: self.color1,
                                       textColor: self.color1,
                                       indicatorBorderColor: self.color1,
                                       indicatorEmptyBackgroundColor: "transparent",
                                       indicatorFullBackgroundColor: self.color1
    )
  }
}


