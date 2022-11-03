package ru.ubsmobile.BankTheme;

import android.graphics.Color;

import com.facebook.react.bridge.ReactApplicationContext;

public class BankTheme extends BankThemeBase {

    public BankTheme(ReactApplicationContext context) {
        super(context);
    }

    public static String BackgroundColor = "#A52A2A";

    public void requestAutostartPermission() {
        super.requestAutostartPermission();
    }

    @Override
    protected String Color1() {
        return "#A52A2A";
    }

    @Override
    protected boolean AllowShowCvvCode() { return false; }

    @Override
    protected String NavigationBackgroundColor() {
        return "#A52A2A";
    }

    @Override
    protected MapLocation DefaultMapLocation() {
        return new MapLocation("54.511425", "36.259059");
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
    protected boolean ShowPersonalOffersOnMyBankPage() {
        return true;
    }

    @Override
    protected CodeSettingPageTheme CodeSettingPageTheme() {
        CodeSettingPageTheme c = new CodeSettingPageTheme();
        c.backgroundColor = "#fce3d7";
        c.buttonBorderColor = Color1();
        c.buttonTextColor = Color1();
        c.textColor = Color1();
        c.indicatorBorderColor = Color1();
        c.indicatorEmptyBackgroundColor = "transparent";
        c.indicatorFullBackgroundColor = Color1();
        return c;
    }

    @Override
    protected String BankPhoneNumber() {
        return "+74842721465";
    }
  
    @Override
    protected boolean PushNotificationsUsed() { return false; }

    @Override
    protected boolean BankMessagesUsed() { return true; }

}

