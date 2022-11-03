/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"
#import <Firebase.h>
#import <ReactNativeNavigation/ReactNativeNavigation.h>
#import <React/RCTLinkingManager.h>
#import <React/RCTBundleURLProvider.h>
#import <RNDeviceInfo/DeviceUID.h>

#import <ReactNativeNavigation/ReactNativeNavigation.h>
#import "RNQuickActionManager.h"

#import <RNDeviceInfo/DeviceUID.h>

#import <React/RCTLog.h>

#ifdef FB_SONARKIT_ENABLED
  #import <FlipperKit/FlipperClient.h>
  #import <FlipperKitLayoutPlugin/FlipperKitLayoutPlugin.h>
  #import <FlipperKitUserDefaultsPlugin/FKUserDefaultsPlugin.h>
  #import <FlipperKitNetworkPlugin/FlipperKitNetworkPlugin.h>
  #import <SKIOSNetworkPlugin/SKIOSNetworkAdapter.h>
  #import <FlipperKitReactPlugin/FlipperKitReactPlugin.h>


  static void InitializeFlipper(UIApplication *application) {
    FlipperClient *client = [FlipperClient sharedClient];
    SKDescriptorMapper *layoutDescriptorMapper = [[SKDescriptorMapper alloc] initWithDefaults];
    [client addPlugin:[[FlipperKitLayoutPlugin alloc] initWithRootNode:application withDescriptorMapper:layoutDescriptorMapper]];
    [client addPlugin:[[FKUserDefaultsPlugin alloc] initWithSuiteName:nil]];
    [client addPlugin:[FlipperKitReactPlugin new]];
    [[FlipperClient sharedClient] addPlugin: [[FlipperKitNetworkPlugin alloc] initWithNetworkAdapter:[SKIOSNetworkAdapter new]]];

    [client start];
 }
#endif

@implementation AppDelegate {
  NSString *url;
  NSMutableArray *cachedRequests;
  NSUserDefaults *def;
}

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(setURL:(NSString *)URL)
{
  url = URL;

  NSArray* requests = [def objectForKey:@"cachedRequests"];

  for (NSDictionary *jsonBody in requests) {
    NSData *jsonBodyData = [NSJSONSerialization dataWithJSONObject:jsonBody options:kNilOptions error:nil];

    NSMutableURLRequest *request = [[NSMutableURLRequest alloc] initWithURL:[NSURL URLWithString:self->url]];

    [request setHTTPMethod:@"POST"];
    [request setValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
    [request setValue:@"application/json" forHTTPHeaderField:@"Accept"];
    [request setHTTPBody:jsonBodyData];
  }

  [cachedRequests removeAllObjects];
  [def setValue:cachedRequests forKey:@"requests"];
  [def synchronize];
}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  #ifdef FB_SONARKIT_ENABLED
    InitializeFlipper(application);
  #endif

  [FIRApp configure];
  [FIRMessaging messaging].delegate = self;

  if ([UNUserNotificationCenter class] != nil) {
    // iOS 10 or later
    // For iOS 10 display notification (sent via APNS)
    [UNUserNotificationCenter currentNotificationCenter].delegate = self;
    UNAuthorizationOptions authOptions = UNAuthorizationOptionAlert |
        UNAuthorizationOptionSound | UNAuthorizationOptionBadge;
    [[UNUserNotificationCenter currentNotificationCenter]
        requestAuthorizationWithOptions:authOptions
        completionHandler:^(BOOL granted, NSError * _Nullable error) {
          // ...
        }];
  } else {
    // iOS 10 notifications aren't available; fall back to iOS 8-9 notifications.
    UIUserNotificationType allNotificationTypes =
    (UIUserNotificationTypeSound | UIUserNotificationTypeAlert | UIUserNotificationTypeBadge);
    UIUserNotificationSettings *settings =
    [UIUserNotificationSettings settingsForTypes:allNotificationTypes categories:nil];
    [application registerUserNotificationSettings:settings];
  }

  [application registerForRemoteNotifications];
  [[[NSUserDefaults alloc] initWithSuiteName:UD_SUITE_NAME] setValue:[DeviceUID syncUid] forKey:@"uidDevice"];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  self.window.backgroundColor = BACKGROUND_COLOR;
  def = [NSUserDefaults standardUserDefaults];
  [ReactNativeNavigation bootstrapWithDelegate:self launchOptions:launchOptions];
  NSLog(@"DID FINISH LAUNCH");
  return YES;
}



- (BOOL)application:(UIApplication *)application
   openURL:(NSURL *)url
   options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  return [RCTLinkingManager application:application openURL:url options:options];
}

- (BOOL)application:(UIApplication *)application continueUserActivity:(nonnull NSUserActivity *)userActivity
 restorationHandler:(nonnull void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler
{
 return [RCTLinkingManager application:application
                  continueUserActivity:userActivity
                    restorationHandler:restorationHandler];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  NSURL *jsCodeLocation;
  #ifdef DEBUG
    //  jsCodeLocation = [NSURL URLWithString:@"http://localhost:8081/index.ios.bundle?platform=ios&dev=true"];
    jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];
  #else
    jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
  #endif
  return jsCodeLocation;
}

- (NSArray<id<RCTBridgeModule>> *)extraModulesForBridge:(RCTBridge *)bridge {
  return [ReactNativeNavigation extraModulesForBridge:bridge];
}

- (void)applicationDidEnterBackground:(UIApplication *)application
{
  UIImage *image = [UIImage imageNamed: LAUNCH_LOGO_NAMED];

  UIImageView *imageView = [[UIImageView alloc] initWithImage:image];
  imageView.tag = 101;
  imageView.backgroundColor = BACKGROUND_COLOR;

  [UIApplication.sharedApplication.keyWindow.subviews.lastObject addSubview:imageView];


  //set contentMode to scale aspect to fit
  imageView.contentMode = UIViewContentModeScaleAspectFit;

  CGRect frame = imageView.frame;
  frame.size.width = imageView.superview.frame.size.width;
  frame.size.height = imageView.superview.frame.size.height;
  imageView.frame = frame;
}

- (void)applicationDidBecomeActive:(UIApplication *)application {
  [[UIApplication sharedApplication] setApplicationIconBadgeNumber:0];
  [[[NSUserDefaults alloc] initWithSuiteName:UD_SUITE_NAME] setValue:0 forKey:@"badgeNumber"];
}

- (void)applicationWillEnterForeground:(UIApplication *)application
{
  UIImageView *imageView = (UIImageView *)[UIApplication.sharedApplication.keyWindow.subviews.lastObject viewWithTag:101];   // search by the same tag value

  [imageView removeFromSuperview];
}

- (void)application:(UIApplication *)application performActionForShortcutItem:(UIApplicationShortcutItem *)shortcutItem completionHandler:(void (^)(BOOL succeeded)) completionHandler {
  [RNQuickActionManager onQuickActionPress:shortcutItem completionHandler:completionHandler];
}

- (void)messaging:(FIRMessaging *)messaging didReceiveRegistrationToken:(NSString *)fcmToken {
    NSLog(@"FCM registration token: %@", fcmToken);
    // Notify about received token.
    NSDictionary *dataDict = [NSDictionary dictionaryWithObject:fcmToken forKey:@"token"];
    [[NSNotificationCenter defaultCenter] postNotificationName:
     @"FCMToken" object:nil userInfo:dataDict];
    // TODO: If necessary send token to application server.
    // Note: This callback is fired at each app startup and whenever a new token is generated.
}

// Receive displayed notifications for iOS 10 devices.
// Handle incoming notification messages while app is in the foreground.
- (void)userNotificationCenter:(UNUserNotificationCenter *)center
       willPresentNotification:(UNNotification *)notification
         withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler {
  NSDictionary *userInfo = notification.request.content.userInfo;

  // With swizzling disabled you must let Messaging know about the message, for Analytics
  [[FIRMessaging messaging] appDidReceiveMessage:userInfo];

  // Print full message.
  NSLog(@"%@", userInfo);

  // Change this to your preferred presentation option
  completionHandler(UNNotificationPresentationOptionBadge | UNNotificationPresentationOptionAlert);
}

- (void)userNotificationCenter:(UNUserNotificationCenter *)center
didReceiveNotificationResponse:(UNNotificationResponse *)response
         withCompletionHandler:(void(^)(void))completionHandler {
  NSDictionary *userInfo = response.notification.request.content.userInfo;

  // With swizzling disabled you must let Messaging know about the message, for Analytics
  [[FIRMessaging messaging] appDidReceiveMessage:userInfo];

  // Print full message.
  //NSLog(@"%@", userInfo);

  completionHandler();
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
    fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler {

   [[FIRMessaging messaging] appDidReceiveMessage:userInfo];

  // Print full message.
  // NSLog(@"%@", userInfo);

  completionHandler(UIBackgroundFetchResultNewData);
}

@end
