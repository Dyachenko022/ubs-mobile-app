package ru.ubsmobile.BankTheme;

import java.util.HashMap;

public class MapLocation {

    private String latitude;
    private String longitude;

    public MapLocation(String latitude, String longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public HashMap<String, Object> ToHashMap() {
        HashMap<String, Object> defaultMapLocation = new HashMap<>();
        defaultMapLocation.put("latitude", this.latitude);
        defaultMapLocation.put("longitude", this.longitude);
        return defaultMapLocation;
    }
}
