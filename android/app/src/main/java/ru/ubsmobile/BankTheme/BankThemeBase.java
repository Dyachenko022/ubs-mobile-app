package ru.ubsmobile.BankTheme;

import android.content.ComponentName;
import android.content.Intent;
import android.util.Log;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;
import ru.ubsmobile.BankTheme.MapLocation;
import ru.ubsmobile.BuildConfig;
import ru.ubsmobile.R;

public abstract class BankThemeBase extends ReactContextBaseJavaModule {

    abstract protected String Color1();
    abstract protected String NavigationBackgroundColor();
    abstract protected MapLocation DefaultMapLocation();
    abstract protected boolean ShowBonusesPage();
    abstract protected boolean ShowNotificationsSetting();
    abstract protected boolean AllowAddCardsToWallet();
    abstract protected boolean ShowPersonalOffersOnMyBankPage();
    abstract protected CodeSettingPageTheme CodeSettingPageTheme();
    abstract protected boolean AllowShowCvvCode();
    public final String ServerUrl;
    abstract protected String BankPhoneNumber();
    abstract protected boolean PushNotificationsUsed();
    abstract protected boolean BankMessagesUsed();

    public BankThemeBase(ReactApplicationContext context) {
        super(context);
        this.ServerUrl = context.getString(R.string.ServerUrl);;
    }

    public boolean hasEmui() {
        try {
            Class propertyClass = Class.forName("android.os.SystemProperties");
            Method method = propertyClass.getMethod("get", String.class);
            String versionEmui = (String)method.invoke(propertyClass, "ro.build.version.emui");
            return versionEmui != null && !versionEmui.isEmpty();
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public String getName() {
        return "BankTheme";
    }

    public void requestAutostartPermission() {
        Intent intent1 = new Intent();
        intent1.setComponent(new ComponentName("com.miui.securitycenter", "com.miui.permcenter.autostart.AutoStartManagementActivity"));
        getCurrentActivity().startActivity(intent1);
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put("color1", Color1());
        constants.put("allowShowCvvCode", AllowShowCvvCode());
        constants.put("navigationBackgroundColor", NavigationBackgroundColor());
        constants.put("defaultMapLocation", DefaultMapLocation().ToHashMap());
        constants.put("showBonusesPage", ShowBonusesPage());
        constants.put("showNotificationsSetting", ShowNotificationsSetting());
        constants.put("allowAddCardsToWallet", AllowAddCardsToWallet());
        constants.put("showPersonalOffersOnMyBankPage", ShowPersonalOffersOnMyBankPage());
        constants.put("serverUrl", ServerUrl);
        constants.put("bankPhoneNumber", BankPhoneNumber());
        if (CodeSettingPageTheme() != null) {
            constants.put("codeSettingPageTheme", CodeSettingPageTheme().ToHashMap());
        }
        constants.put("bankMessagesUsed", BankMessagesUsed());
        constants.put("pushNotificationsUsed", PushNotificationsUsed());
        constants.put("hasEmui", hasEmui());
        return constants;
    }
}
