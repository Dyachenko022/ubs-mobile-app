//
//  NotificationService.swift
//  RubNotificationService
//
//  Created by Yuriy Kalugin on 01.11.2021.
//  Copyright © 2021 unisab. All rights reserved.
//

import UserNotifications
import UIKit

class NotificationService: UNNotificationServiceExtension {

  var contentHandler: ((UNNotificationContent) -> Void)?
  var bestAttemptContent: UNMutableNotificationContent?
  var sharedDefault: UserDefaults;
  var serverUrl: String;

  override init() {
    let bankTheme = BankThemeToReactNative();
    self.serverUrl = bankTheme.ServerUrl;
    self.sharedDefault = UserDefaults(suiteName: bankTheme.UdSuiteName)!;
  }
  
  override func didReceive(_ request: UNNotificationRequest, withContentHandler contentHandler: @escaping (UNNotificationContent) -> Void) {
      self.contentHandler = contentHandler
      bestAttemptContent = (request.content.mutableCopy() as? UNMutableNotificationContent)
      if let bestAttemptContent = bestAttemptContent {

        // Зададим номер на бейдже. К сохраненному значению прибавим 1 и сохраним
        bestAttemptContent.badge = 1;
        if let savedBadgeNumber = sharedDefault.value(forKey: "badgeNumber") as? NSNumber {
          bestAttemptContent.badge = (savedBadgeNumber.intValue + 1) as NSNumber;
        }
        sharedDefault.set(bestAttemptContent.badge, forKey: "badgeNumber");
        deliveredPush(guid: bestAttemptContent.userInfo["sdUuid"] as! String, text: bestAttemptContent.body);
        contentHandler(bestAttemptContent)
      }
  }

  override func serviceExtensionTimeWillExpire() {
      if let contentHandler = contentHandler, let bestAttemptContent =  bestAttemptContent {
          contentHandler(bestAttemptContent)
      }
  }

  func deliveredPush(guid: String, text: String) {

    let date = Date();
    let dateFormatter = DateFormatter();
    dateFormatter.dateFormat = "dd.MM.YYYY'T'HH:mm:ss";
    

    let json: [String: Any] = [
      "uid": sharedDefault.value(forKey: "uidDevice"),
      "text": text,
      "dateDelivered": dateFormatter.string(from: date),
      "guid": guid,
    ];

    let jsonData = try? JSONSerialization.data(withJSONObject: json)

    // create post request
    let url = URL(string: serverUrl + "/execute")!
    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    request.addValue("deliveredPush", forHTTPHeaderField: "sidRequest");

    request.httpBody = jsonData

    let task = URLSession.shared.dataTask(with: request) { data, response, error in
        guard let data = data, error == nil else {
            print(error?.localizedDescription ?? "No data")
            return
        }
        let responseJSON = try? JSONSerialization.jsonObject(with: data, options: [])
        if let responseJSON = responseJSON as? [String: Any] {
            print(responseJSON)
        }
    }
    task.resume()
    }
}
