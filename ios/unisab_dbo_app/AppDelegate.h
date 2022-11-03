/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import <UIKit/UIKit.h>
#import <React/RCTBridge.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import "./../krk_app/BankTheme.h"
#import "./../ipb_app/BankTheme.h"
#import "./../elt_app/BankTheme.h"
#import "./../rsi_app/BankTheme.h"
#import "./../rub_app/BankTheme.h"

@import UserNotifications;

@interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeModule, UNUserNotificationCenterDelegate>

@property (nonatomic, strong) UIWindow *window;

@end
