package ru.ubsmobile.BankTheme;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;

public class BankTheme extends BankThemeBase {

    public BankTheme(ReactApplicationContext context) {
        super(context);
    }

    public static String BackgroundColor = "#0970cd";

    public void requestAutostartPermission() {
        super.requestAutostartPermission();
    }

    @Override
    public String Color1() {
        return "#0970cd";
    }

    @Override
    protected boolean AllowShowCvvCode() { return false; }

    @Override
    protected String NavigationBackgroundColor() {
        return "#0970cd";
    }

    @Override
    protected MapLocation DefaultMapLocation() {
        return new MapLocation("55.761099", "37.654990");
    }

    @Override
    protected boolean ShowBonusesPage() {
        return false;
    }

    @Override
    protected boolean ShowNotificationsSetting() {
        return false;
    }

    @Override
    protected boolean AllowAddCardsToWallet() {
        return false;
    }

    @Override
    protected boolean ShowPersonalOffersOnMyBankPage() { return false; }

    @Override
    protected CodeSettingPageTheme CodeSettingPageTheme() {
        return null;
    }

    @Override
    protected String BankPhoneNumber() {
        return "+74956483687";
    }

    @Override
    protected boolean PushNotificationsUsed() { return false; }

    @Override
    protected boolean BankMessagesUsed() { return true; }

}