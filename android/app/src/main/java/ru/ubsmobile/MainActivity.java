package ru.ubsmobile;

import android.app.NotificationManager;
import android.content.Context;
import android.content.res.Configuration;
import android.graphics.Color;
import android.os.Bundle;
import android.util.DisplayMetrics;
import android.view.Gravity;
import android.view.View;
import android.widget.ImageView;
import android.widget.LinearLayout;

import androidx.appcompat.app.AppCompatDelegate;

import com.reactnativenavigation.NavigationActivity;

import ru.ubsmobile.BankTheme.BankTheme;

public class MainActivity extends NavigationActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        adjustFontScale();
        setSplashLayout();
        AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO);
        // Чистим все уведомления
        NotificationManager notificationManager = (NotificationManager)getSystemService(Context.NOTIFICATION_SERVICE);
        notificationManager.cancelAll();
    }

    @Override
    protected void onResume() {
        super.onResume();
        // Чистим все уведомления
        NotificationManager notificationManager = (NotificationManager)getSystemService(Context.NOTIFICATION_SERVICE);
        notificationManager.cancelAll();
    }

    private void setSplashLayout() {
        ImageView img = new ImageView(this);
        img.setImageDrawable(getResources().getDrawable(R.drawable.splash_logo));
        int uiOptions = getWindow().getDecorView().getSystemUiVisibility();
        img.setScaleType(ImageView.ScaleType.FIT_CENTER);
        int newUiOptions = uiOptions;

            newUiOptions ^= View.SYSTEM_UI_FLAG_HIDE_NAVIGATION;
            newUiOptions ^= View.SYSTEM_UI_FLAG_FULLSCREEN;
            newUiOptions ^= View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY;

        getWindow().getDecorView().setSystemUiVisibility(newUiOptions);

        LinearLayout rlmain = new LinearLayout(this);
        LinearLayout.LayoutParams llp = new LinearLayout.LayoutParams(LinearLayout.LayoutParams.FILL_PARENT,LinearLayout.LayoutParams.FILL_PARENT);
        LinearLayout   ll1 = new LinearLayout (this);

        rlmain.setBackgroundColor(Color.parseColor(BankTheme.BackgroundColor));
        ll1.setGravity(Gravity.CENTER);

        LinearLayout .LayoutParams lp = new LinearLayout.LayoutParams(LinearLayout.LayoutParams.WRAP_CONTENT, LinearLayout.LayoutParams.WRAP_CONTENT);

        img.setLayoutParams(lp);
        ll1.addView(img);
        rlmain.setGravity(Gravity.CENTER);
        rlmain.addView(ll1);
        setContentView(rlmain, llp);
    }

    public void adjustFontScale() {
        Configuration configuration = getResources().getConfiguration();
        configuration.fontScale=(float) 1; //0.85 small size, 1 normal size, 1,15 big etc
        DisplayMetrics metrics = new DisplayMetrics();
        getWindowManager().getDefaultDisplay().getMetrics(metrics);
        metrics.scaledDensity = configuration.fontScale * metrics.density;
        getBaseContext().getResources().updateConfiguration(configuration, metrics);
    }
}
