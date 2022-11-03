package ru.ubsmobile.WalletButton;

import android.content.Context;
import android.graphics.Color;
import android.util.AttributeSet;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
//import android.widget.Button;
import android.widget.LinearLayout;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.RCTEventEmitter;

import ru.ubsmobile.R;

public class WalletButton extends LinearLayout {
//public class WalletButton extends Button {
  public WalletButton(Context context) {
    super(context);

    Log.d("TAG_ASD", "ASD");

    LayoutInflater mInflatater = (LayoutInflater)context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
    mInflatater.inflate(R.layout.add_to_googlepay_button, this, true);

    this.setOnClickListener(onClickListener);
  }

  public WalletButton(Context context, AttributeSet attrs) {
    super(context, attrs);
  }

  public WalletButton(Context context, AttributeSet attrs, int defStyle) {
    super(context, attrs, defStyle);
  }

  private OnClickListener onClickListener = new OnClickListener() {
    public void onClick(View v) {
      Log.d("TAG_ASD", "ASD");
      onClickHandler();
      Log.d("TAG_ASD", "ASD");
    }
  };

  private void onClickHandler() {
    WritableMap event = Arguments.createMap();
    ReactContext reactContext = (ReactContext)getContext();

    reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
            getId(),
            "addToWalletClick",
            event
    );
  }
}
