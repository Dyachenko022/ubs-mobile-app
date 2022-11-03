 package ru.ubsmobile.NativeRequests;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import org.json.JSONObject;

import java.io.DataOutputStream;
import java.net.URL;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;

import javax.net.ssl.HttpsURLConnection;

import ru.ubsmobile.R;

public class NativeRequests extends ReactContextBaseJavaModule {

    private final String ServerUrl;

    public NativeRequests(ReactApplicationContext context) {
        super(context);
        this.ServerUrl = context.getString(R.string.ServerUrl);
    }

    @Override
    public String getName() {
        return "NativeRequests";
    }

    @ReactMethod
    public void deliveredPush(String dateDelivered, String guid, String uid, String text, Promise promise) {
        try {
            JSONObject jsonParam = new JSONObject();
            jsonParam.put("uid", uid);
            jsonParam.put("text", text);
            jsonParam.put("dateDelivered", dateDelivered);
            jsonParam.put("guid", guid);
            URL url = new URL(ServerUrl + "/execute");
            HttpsURLConnection urlConnection = (HttpsURLConnection) url.openConnection();
            urlConnection.setUseCaches(false);
            urlConnection.setRequestMethod("POST");
            urlConnection.setRequestProperty("Content-Type", "application/json; charset=utf-8");
            urlConnection.setRequestProperty("Accept","application/json");
            urlConnection.setRequestProperty("sidrequest", "deliveredPush");
            urlConnection.setDoOutput(true);
            urlConnection.setDoInput(true);
            urlConnection.connect();
            DataOutputStream out = new DataOutputStream(urlConnection.getOutputStream());
            ByteBuffer byteBuffer = StandardCharsets.UTF_8.encode(jsonParam.toString());
            byte[] arr = new byte[byteBuffer.remaining()];
            byteBuffer.get(arr);
            out.write(arr);
            out.flush();
            out.close();
            int respCOde =urlConnection.getResponseCode();
            System.out.println("respCode " + Integer.toString(respCOde));
            urlConnection.disconnect();
            promise.resolve(null);

        } catch (Exception e) {
            System.out.println(e.getMessage());
            promise.reject(e);
        }
    }

    @ReactMethod
    public void testConnection(Promise promise) {
        try {
            URL url = new URL(ServerUrl + "/public/settingsFrontSys.json");
            HttpsURLConnection urlConnection = (HttpsURLConnection) url.openConnection();
            urlConnection.setUseCaches(false);
            urlConnection.setRequestMethod("GET");
            urlConnection.setRequestProperty("Content-Type", "application/json");
            urlConnection.setDoOutput(false);
            urlConnection.setDoInput(true);
            urlConnection.connect();
            int respCOde =urlConnection.getResponseCode();
            System.out.println("respCode-- " + Integer.toString(respCOde));
            urlConnection.disconnect();
            promise.resolve(respCOde);

        } catch (Exception e) {
            System.out.println(e.getMessage());
            promise.reject(e);
        }
    }
}
