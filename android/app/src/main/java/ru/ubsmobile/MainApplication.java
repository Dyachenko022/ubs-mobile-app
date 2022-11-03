package ru.ubsmobile;

import android.content.Context;
import androidx.multidex.MultiDex;

import com.facebook.react.ReactPackage;
import com.facebook.react.PackageList;
import com.facebook.soloader.SoLoader;
import com.reactnativenavigation.NavigationApplication;
import com.reactnativecommunity.netinfo.NetInfoPackage;
import com.wix.interactable.Interactable;
import com.reactnativecommunity.geolocation.GeolocationPackage;
import com.facebook.react.ReactNativeHost;
import com.reactnativenavigation.react.NavigationReactNativeHost;

import java.util.List;

import ru.ubsmobile.NativeRequests.NativeRequestsPackage;
import ru.ubsmobile.Wallet.WalletPackage;
import ru.ubsmobile.WalletButton.WalletButtonPackage;
import ru.ubsmobile.BankTheme.BankThemePackage;


public class MainApplication extends NavigationApplication {

    private final ReactNativeHost mReactNativeHost =  new NavigationReactNativeHost(this) {
                    @Override
                    public boolean getUseDeveloperSupport() {
                        return BuildConfig.DEBUG;
                    }
                    @Override
                    protected List<ReactPackage> getPackages() {
                        List<ReactPackage> packages = new PackageList(this).getPackages();
                        packages.add(new NetInfoPackage());
                        packages.add(new GeolocationPackage());
                        packages.add(new WalletPackage());
                        packages.add(new WalletButtonPackage());
                        packages.add(new Interactable());
                        packages.add(new BankThemePackage());
                        packages.add(new NativeRequestsPackage());
                        return packages;
                    }
                    @Override
                    protected String getJSMainModuleName() {
                        return "index.android";
                    }
                };
    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
    }

    @Override
    protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
        MultiDex.install(this);
    }


}
