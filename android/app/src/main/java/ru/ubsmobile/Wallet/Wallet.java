package ru.ubsmobile.Wallet;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.android.gms.identity.intents.model.UserAddress;
import com.google.android.gms.iid.InstanceID;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.tapandpay.TapAndPay;
import com.google.android.gms.tapandpay.TapAndPayStatusCodes;
import com.google.android.gms.tapandpay.issuer.PushTokenizeRequest;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.concurrent.ExecutionException;
import static com.google.android.gms.tapandpay.TapAndPay.TAP_AND_PAY_API;
import static com.google.android.gms.tapandpay.TapAndPay.TOKEN_PROVIDER_VISA;
import static com.google.android.gms.tapandpay.TapAndPay.CARD_NETWORK_VISA;

public class Wallet extends ReactContextBaseJavaModule implements GoogleApiClient.ConnectionCallbacks, GoogleApiClient.OnConnectionFailedListener, ActivityEventListener {

    public static final String REACT_CLASS = "Wallet";
    private static final String TAG = "Unisab";

    // Google API Client
    private GoogleApiClient mGoogleApiClient = null;
    private static ReactApplicationContext reactContext;
    private static final int REQUEST_CODE_PUSH_TOKENIZE = 988;
    private static final int REQUEST_CODE_CREATE_WALLET = 928;
    private static final int REQUEST_CODE_DELETE_TOKEN = 999;
    private Listener onCreateWalletListener = null;
    private String SERVER_URL = "";

    @Override
    public void onActivityResult(Activity activity, final int requestCode, final int resultCode, final Intent intent) {
        if (requestCode == REQUEST_CODE_PUSH_TOKENIZE) {
            if (resultCode == Activity.RESULT_OK) {
                Bundle bundle = intent.getExtras();
                if (bundle != null) {
                    Object id = bundle.get("extra_issuer_token_id");
                    WritableMap prms = Arguments.createMap();
                    prms.putString("result", id != null ? id.toString() : "");
                    sendEvent(reactContext, "executedWallet", prms);
                }
            } else {
                WritableMap params = Arguments.createMap();
                sendEvent(reactContext, "unkownGpayError", params);
            }
        }
        if (requestCode == REQUEST_CODE_DELETE_TOKEN) {
            if (resultCode == Activity.RESULT_OK) {
                WritableMap prms = Arguments.createMap();
                prms.putString("result", "ok");
                sendEvent(reactContext, "tokenDeleted", prms);
            }
        }
        if (requestCode == REQUEST_CODE_CREATE_WALLET) {
            if (resultCode == Activity.RESULT_OK) {
                if (onCreateWalletListener != null) {
                    onCreateWalletListener.onDone();
                }
            }
        }
    }

    @Override
    public void onNewIntent(Intent intent) {
    }

    public Wallet(ReactApplicationContext context) {
        super(context);
        reactContext = getReactApplicationContext();
        context.addActivityEventListener(this);
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @ReactMethod
    public void init(String url) {
        SERVER_URL = url + "execute";
        buildGoogleApiClient(getCurrentActivity());
    }

    private String tokenStateToString(@TapAndPay.TokenState int state) {
        switch (state) {
            case TapAndPay.TOKEN_STATE_UNTOKENIZED:
                return "TOKEN_STATE_UNTOKENIZED";
            case TapAndPay.TOKEN_STATE_PENDING:
                return "TOKEN_STATE_PENDING";
            case TapAndPay.TOKEN_STATE_NEEDS_IDENTITY_VERIFICATION:
                return "TOKEN_STATE_NEEDS_IDENTITY_VERIFICATION";
            case TapAndPay.TOKEN_STATE_SUSPENDED:
                return "TOKEN_STATE_SUSPENDED";
            case TapAndPay.TOKEN_STATE_FELICA_PENDING_PROVISIONING:
                return "TOKEN_STATE_FELICA_PENDING_PROVISIONING";
            case TapAndPay.TOKEN_STATE_ACTIVE:
                return "TOKEN_STATE_ACTIVE";
        }
        return "UNKNOWN";
    }

    @ReactMethod
    public void getTokenStatus(String token, final Promise promise) {
        if (mGoogleApiClient == null) {
            buildGoogleApiClient(getCurrentActivity());
        }
        final TapAndPay tapAndPay = TapAndPay.TapAndPay;
        tapAndPay.getTokenStatus(mGoogleApiClient, CARD_NETWORK_VISA, token)
                .setResultCallback(tokenStatusResult -> {
                    if (tokenStatusResult.getStatus().isSuccess()) {
                        @TapAndPay.TokenState int tokenState = tokenStatusResult.getTokenStatus().getTokenState();
                        boolean isSelected = tokenStatusResult.getTokenStatus().isSelected();
                        WritableMap map = Arguments.createMap();
                        map.putBoolean("isSelected", isSelected);
                        map.putString("state", this.tokenStateToString(tokenState));
                        promise.resolve(map);
                    } else {
                        promise.reject("TOKEN_STATUS_ERROR", "getTokenStatus Could not get token status  " + tokenStatusResult.getStatus().getStatusMessage());
                    }
                });
    }

    public void pushProvisioning(final String opc, String name, String lastDigits, String address, String flatNumber, String city, String postalCode,
                                 String _countryCode, String _country, String _postIndex, String _city, String _region, String _address, String _flat, String _phone
    ) {
        if (mGoogleApiClient == null) {
            buildGoogleApiClient(getCurrentActivity());
        }
        final TapAndPay tapAndPay = TapAndPay.TapAndPay;
        UserAddress userAddress = UserAddress.newBuilder()
                .setAddress1(_address)
                .setAddress2(_flat)
                .setCountryCode("RU") // todo: проверить _countryCode
                .setLocality(_city)
                .setAdministrativeArea(_region)
                .setPostalCode(postalCode)
                .setPhoneNumber(_phone)
                .build();
        PushTokenizeRequest pushTokenizeRequest = new PushTokenizeRequest.Builder()
                .setOpaquePaymentCard(opc.getBytes())
                .setNetwork(CARD_NETWORK_VISA)
                .setTokenServiceProvider(TOKEN_PROVIDER_VISA)
                .setDisplayName(name)
                .setLastDigits(lastDigits)
                .setUserAddress(userAddress)
                .build();
        tapAndPay.pushTokenize(
                mGoogleApiClient,
                getCurrentActivity(),
                pushTokenizeRequest,
                REQUEST_CODE_PUSH_TOKENIZE);
    }

    @ReactMethod
    public void addCard(final String opc, final String name, final String lastDigits, final String clientName) {
        onCreateWalletListener = () -> {
            final TapAndPay tapAndPay1 = TapAndPay.TapAndPay;
            PushTokenizeRequest pushTokenizeRequest1 = new PushTokenizeRequest.Builder()
                    .setOpaquePaymentCard(opc.getBytes())
                    .setNetwork(CARD_NETWORK_VISA)
                    .setTokenServiceProvider(TOKEN_PROVIDER_VISA)
                    .setDisplayName(name)
                    .setLastDigits(lastDigits)
                    .build();

            tapAndPay1.pushTokenize(
                    mGoogleApiClient,
                    getCurrentActivity(),
                    pushTokenizeRequest1,
                    REQUEST_CODE_PUSH_TOKENIZE);
        };
        final TapAndPay tapAndPay = TapAndPay.TapAndPay;
        PushTokenizeRequest.Builder builder = new PushTokenizeRequest.Builder()
                .setOpaquePaymentCard(opc.getBytes())
                .setNetwork(CARD_NETWORK_VISA)
                .setTokenServiceProvider(TOKEN_PROVIDER_VISA)
                .setDisplayName(name)
                .setLastDigits(lastDigits);
        PushTokenizeRequest pushTokenizeRequest = builder.build();
        tapAndPay.pushTokenize(
                mGoogleApiClient,
                getCurrentActivity(),
                pushTokenizeRequest,
                REQUEST_CODE_PUSH_TOKENIZE);
    }

    private void createWallet() {
        TapAndPay tapAndPay = TapAndPay.TapAndPay;
        if (mGoogleApiClient != null) {
            tapAndPay.createWallet(mGoogleApiClient,
                    getCurrentActivity(),
                    REQUEST_CODE_CREATE_WALLET);
        }
    }


    @Override
    public void onConnected(Bundle connectionHint) {
        Log.i(TAG, "Connection success");
    }

    @Override
    public void onConnectionFailed(ConnectionResult result) {
        Log.i(REACT_CLASS, "Connection failed: ConnectionResult.getErrorCode() = " + result.getErrorCode());
    }

    @Override
    public void onConnectionSuspended(int cause) {
        mGoogleApiClient.connect();
    }

    @ReactMethod
    public void removeCard(final String token) {
        if (mGoogleApiClient == null) {
            buildGoogleApiClient(getCurrentActivity());
        }
        final TapAndPay tapAndPay = TapAndPay.TapAndPay;
        tapAndPay.requestDeleteToken(mGoogleApiClient,
                getCurrentActivity(),
                token,
                TOKEN_PROVIDER_VISA,
                REQUEST_CODE_DELETE_TOKEN);
    }

    @ReactMethod
    public void getOPC(final String jwt, final String cardId, final String cardName, final String clientName, final String lastDigits) {
        System.out.println("aqqq");
        if (mGoogleApiClient == null) {
            buildGoogleApiClient(getCurrentActivity());
        }
        final TapAndPay tapAndPay = TapAndPay.TapAndPay;
        tapAndPay.getStableHardwareId(mGoogleApiClient).setResultCallback(
                idResult -> {
                    Log.d(TAG, "ID RESULT " + idResult.getStatus().isSuccess()+" code " + idResult.getStatus().getStatusCode());
                    if (idResult.getStatus().isSuccess()) {
                        System.out.println("aqqq 5");
                        final String hardwareId = idResult.getStableHardwareId();
                        tapAndPay.getActiveWalletId(mGoogleApiClient)
                                .setResultCallback(walletIdResult -> {
                                    if (walletIdResult.getStatus().isSuccess()) {
                                        System.out.println("aqqq 2");
                                        final String walletID = walletIdResult.getActiveWalletId();
                                        sendReq(hardwareId, walletID, jwt, cardId, cardName, clientName, lastDigits);
                                    } else {
                                        System.out.println("aqqq 3");
                                        int code = walletIdResult.getStatus().getStatusCode();
                                        if (code == TapAndPayStatusCodes.TAP_AND_PAY_NO_ACTIVE_WALLET) {
                                            onCreateWalletListener = () -> {
                                                getOPC(jwt, cardId, cardName, clientName, lastDigits);
                                            };
                                            createWallet();
                                        }
                                    }
                                });
                    }
                });
    }

    private static void sendEvent(ReactContext reactContext,
                                  String eventName,
                                  WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    private void buildGoogleApiClient(Activity currentActivity) {
        mGoogleApiClient = new GoogleApiClient.Builder(currentActivity)
                .addConnectionCallbacks(this)
                .addOnConnectionFailedListener(this)
                .addApi(TAP_AND_PAY_API)
                .build();
        mGoogleApiClient.connect();
        TapAndPay.TapAndPay.registerDataChangedListener(mGoogleApiClient, () -> {
            sendEvent(reactContext, "refreshRequired", Arguments.createMap());
        });
    }

    private void sendReq(String hardwareId, String walletID, String jwt, String cardId, String cardName, String clientName, String lastDigits) {
        String url = SERVER_URL;
        String result;
        HttpGetRequest postRequest = new HttpGetRequest();
        try {
            try {
                result = postRequest.execute(url, hardwareId, walletID, jwt, cardId).get();
                try {
                    JSONObject res = new JSONObject(result);
                    Log.d(TAG, "sendReq result is  " + res);
                    String address = "";
                    String flatNumber = "";
                    String city = "";
                    String postalCode = "";

                    String _countryCode = "";
                    String _country = "";
                    String _postIndex = "";
                    String _city = "";
                    String _address = "";
                    String _region = "";
                    String _flat = "";
                    String _phone = "";
                    JSONArray values = res.getJSONArray("values");
                    for (int i = 0; i < values.length(); ++i) {
                        JSONObject rec = values.getJSONObject(i);
                        String name = rec.getString("name");
                        if (name.equalsIgnoreCase("адрес")) {
                            JSONArray value = rec.getJSONArray("value");
                            JSONArray extractedValue = value.getJSONArray(0);

                            address = extractedValue.getString(5);
                            flatNumber = extractedValue.getString(6);
                            city = extractedValue.getString(4);
                            postalCode = extractedValue.getString(2);

                            _countryCode = extractedValue.getString(0);
                            _country = extractedValue.getString(1);
                            _postIndex = extractedValue.getString(2);
                            _region = extractedValue.getString(3);
                            _city = extractedValue.getString(4);
                            _address = extractedValue.getString(5);
                            _flat = extractedValue.getString(6);
                        }
                        if (name.equalsIgnoreCase("телефон")) {
                            _phone = rec.getString("value");
                        }
                    }
                    JSONObject rec = values.getJSONObject(0);
                    String value = rec.getString("value");
                    pushProvisioning(value, cardName, lastDigits, address, flatNumber, city, postalCode, _countryCode, _country, _postIndex, _city, _region, _address, _flat, _phone);
                } catch (JSONException e) {
                    Log.e("TAG_!", e.getMessage());
                }
            } catch (InterruptedException e) {
                Log.e("TAG_!", e.getMessage());
            }
        } catch (ExecutionException e) {
            Log.e("TAG_!", e.getMessage());
        }
    }

    static public class HttpGetRequest extends AsyncTask<String, Void, String> {

        @Override
        protected String doInBackground(String... params) {
            String url = params[0];
            String hardwareId = params[1];
            String walletID = params[2];
            String jwt = params[3];
            String cardId = params[4];
            String rsult = "";
            try {

                String timeRequest = getBaseData(url, jwt);

                JSONObject trobj = new JSONObject(timeRequest);

                URL object = new URL(url);

                HttpURLConnection con = (HttpURLConnection) object.openConnection();
                con.setDoOutput(true);
                con.setDoInput(true);
                con.setRequestProperty("Accept", "application/json, text/plain, */*");
                con.setRequestProperty("Content-Type", "application/json;charset=utf-8");
                con.setRequestProperty("ubsjwt", jwt);
                con.setRequestProperty("sidRequest", "execute/GetPayLoadToWallet");
                con.setRequestProperty("timeRequest", trobj.getString("timeRequest"));
                con.setRequestMethod("POST");

                JSONObject idCard = new JSONObject();
                JSONObject idApp = new JSONObject();
                JSONObject idHard = new JSONObject();
                JSONObject typeW = new JSONObject();
                JSONObject idW = new JSONObject();
                JSONObject providerW = new JSONObject();

                JSONArray parameters = new JSONArray();

                JSONObject parent = new JSONObject();
                try {
                    idCard.put("name", "Идентификатор карты");
                    idCard.put("value", cardId);
                    idCard.put("type", "int");
                    idCard.put("typeColumns", JSONObject.NULL);

                    idApp.put("name", "Уникальный идентификатор приложения");
                    idApp.put("value", InstanceID.getInstance(reactContext).getId());
                    idApp.put("type", "string");
                    idApp.put("typeColumns", JSONObject.NULL);

                    idHard.put("name", "Идентификатор устройства");
                    idHard.put("value", hardwareId);
                    idHard.put("type", "string");
                    idHard.put("typeColumns", JSONObject.NULL);

                    typeW.put("name", "Тип кошелька");
                    typeW.put("value", "android");
                    typeW.put("type", "string");
                    typeW.put("typeColumns", JSONObject.NULL);

                    idW.put("name", "Идентификатор учетной записи кошелька");
                    idW.put("value", walletID);
                    idW.put("type", "string");
                    idW.put("typeColumns", JSONObject.NULL);

                    providerW.put("name", "Провайдер кошелька");
                    providerW.put("value", TOKEN_PROVIDER_VISA);
                    providerW.put("type", "string");
                    providerW.put("typeColumns", JSONObject.NULL);

                    parameters.put(idCard);
                    parameters.put(idApp);
                    parameters.put(idHard);
                    parameters.put(typeW);
                    parameters.put(idW);
                    parameters.put(providerW);

                    parent.put("parameters", parameters);
                    parent.put("sidRequest", "GetPayLoadToWallet");
                    parent.put("jwt", jwt);
                } catch (JSONException e) {
                    Log.e("TAG_!", e.getMessage());
                }

                OutputStreamWriter wr = new OutputStreamWriter(con.getOutputStream());
                wr.write(parent.toString());
                wr.close();

                StringBuilder sb = new StringBuilder();
                int HttpResult = con.getResponseCode();
                if (HttpResult == HttpURLConnection.HTTP_OK) {
                    BufferedReader br = new BufferedReader(
                            new InputStreamReader(con.getInputStream(), "utf-8"));
                    String line;
                    while ((line = br.readLine()) != null) {
                        sb.append(line + "\n");
                    }
                    br.close();
                    rsult = sb.toString();

                    System.out.println("" + sb.toString());
                } else {
                    System.out.println(con.getResponseMessage());
                }
            } catch (Exception e) {
                Log.e("TAG_!", e.getMessage());
                System.out.println("here - " + url);
            }

            return rsult;
        }

        @Override
        protected void onPostExecute(String result) {
            super.onPostExecute(result);
        }

        private String getBaseData(String url, String jwt) {
            String result = "";
            try {
                URL object = new URL(url);

                HttpURLConnection con = (HttpURLConnection) object.openConnection();
                con.setDoOutput(true);
                con.setDoInput(true);
                con.setRequestProperty("Accept", "application/json, text/plain, */*");
                con.setRequestProperty("Content-Type", "application/json;charset=utf-8");
                con.setRequestProperty("ubsjwt", jwt);
                con.setRequestProperty("sidRequest", "baseData");
                con.setRequestMethod("POST");
                int HttpResult = con.getResponseCode();
                if (HttpResult == HttpURLConnection.HTTP_OK) {
                    BufferedReader br = new BufferedReader(
                            new InputStreamReader(con.getInputStream(), "utf-8"));
                    String line;
                    StringBuilder sb = new StringBuilder();
                    while ((line = br.readLine()) != null) {
                        sb.append(line + "\n");
                    }
                    br.close();
                    result = sb.toString();

                    System.out.println("" + sb.toString());
                } else {
                    System.out.println(con.getResponseMessage());
                }
            }
            catch (Exception ex){
                System.out.println("gebd- " + ex.getMessage());
            }
            System.out.println("qqqq-" + result);
            return result;
        }
    }

    private interface Listener {
        void onDone();
    }
}
