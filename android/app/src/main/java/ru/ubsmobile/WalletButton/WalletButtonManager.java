package ru.ubsmobile.WalletButton;

import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;

import java.util.Map;

public class WalletButtonManager extends SimpleViewManager<WalletButton> {
  @Override
  public String getName() {
    return "WalletButton";
  }

  @Override
  protected WalletButton createViewInstance(ThemedReactContext reactContext) {
    return new WalletButton(reactContext);
  }

  @Override
  public Map getExportedCustomBubblingEventTypeConstants() {
    return MapBuilder.builder()
            .put(
                    "addToWalletClick",
                    MapBuilder.of(
                            "phasedRegistrationNames",
                            MapBuilder.of("bubbled", "onClickHandler")
                    )
            ).build();
  }
}
