package ru.ubsmobile.BankTheme;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedOutputStream;
import java.io.BufferedWriter;
import java.io.DataOutputStream;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;

import javax.net.ssl.HttpsURLConnection;

public class BankTheme extends BankThemeBase {

    public BankTheme(ReactApplicationContext context) {
        super(context);
    }

    public static String BackgroundColor = "#f47321";

    public void testDontTellMe(String t) {
        return;
    }

    public void requestAutostartPermission() {
        super.requestAutostartPermission();
    }

    @Override
    protected String Color1() {
        return "#f47321";
    }

    @Override
    protected boolean AllowShowCvvCode() { return false; }

    @Override
    protected String NavigationBackgroundColor() {
        return "#f47321";
    }

    @Override
    protected MapLocation DefaultMapLocation() {
        return new MapLocation("55.661112", "37.626922");
    }

    @Override
    protected boolean ShowBonusesPage() {
        return true;
    }

    @Override
    protected boolean ShowNotificationsSetting() {
        return true;
    }

    @Override
    protected boolean AllowAddCardsToWallet() {
        return true;
    }

    @Override
    protected boolean ShowPersonalOffersOnMyBankPage() { return true; }

    @Override
    protected CodeSettingPageTheme CodeSettingPageTheme() {
        return null;
    }

    @Override
    protected String BankPhoneNumber() { return "84954110000"; }

    @Override
    protected boolean PushNotificationsUsed() {
        return true;
    }

    @Override
    protected boolean BankMessagesUsed() {
        return false;
    }

}
