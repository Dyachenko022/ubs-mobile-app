package ru.ubsmobile.BankTheme;

import com.facebook.react.bridge.ReactApplicationContext;

public class BankTheme extends BankThemeBase {

    public BankTheme(ReactApplicationContext context) {
        super(context);
    }

    public static String BackgroundColor = "#24207D";
    @Override
    protected String Color1() {
        return "#24207D";
    }

    public void requestAutostartPermission() {
        super.requestAutostartPermission();
    }

    @Override
    protected boolean AllowShowCvvCode() { return false; }

    @Override
    protected String NavigationBackgroundColor() {
        return "#24207D";
    }

    @Override
    protected MapLocation DefaultMapLocation() {
        return new MapLocation("55.824430", "37.388902");
    }

    @Override
    protected boolean ShowBonusesPage() {
        return false;
    }

    @Override
    protected boolean ShowNotificationsSetting() {
        return true;
    }

    @Override
    protected boolean AllowAddCardsToWallet() {
        return false;
    }

    @Override
    protected boolean ShowPersonalOffersOnMyBankPage() { return true; }

    @Override
    protected CodeSettingPageTheme CodeSettingPageTheme() {
        return null;
    }

    @Override
    protected String BankPhoneNumber() { return "+74952281244"; }

    @Override
    protected boolean PushNotificationsUsed() { return false; }

    @Override
    protected boolean ShowQrCodeIcon() { return false; }

    @Override
    protected boolean BankMessagesUsed() { return true; }

}