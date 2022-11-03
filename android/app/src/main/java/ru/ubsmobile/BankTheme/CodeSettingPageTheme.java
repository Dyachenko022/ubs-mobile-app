package ru.ubsmobile.BankTheme;

import java.util.HashMap;

public class CodeSettingPageTheme {
    public String backgroundColor;
    public String buttonBorderColor;
    public String buttonTextColor;
    public String textColor;
    public String indicatorBorderColor;
    public String indicatorEmptyBackgroundColor;
    public String indicatorFullBackgroundColor;

    public HashMap<String, Object> ToHashMap() {
        HashMap<String, Object> result = new HashMap<>();
        result.put("backgroundColor", backgroundColor);
        result.put("buttonBorderColor", buttonBorderColor);
        result.put("buttonTextColor", buttonTextColor);
        result.put("textColor", textColor);
        result.put("indicatorBorderColor", indicatorBorderColor);
        result.put("indicatorEmptyBackgroundColor", indicatorEmptyBackgroundColor);
        result.put("indicatorFullBackgroundColor", indicatorFullBackgroundColor);
        return result;
    }
}
