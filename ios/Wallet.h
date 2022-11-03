//
//  Wallet.h
//  unisab_dbo_app
//
//  Created by Cyrill Samohvalov on 11/04/2019.
//  Copyright © 2019 Facebook. All rights reserved.
//

#ifndef Wallet_h
#define Wallet_h

#endif /* Wallet_h */
#import <PassKit/PassKit.h>
#import <React/RCTEventEmitter.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTBridge.h>
#import <React/RCTUtils.h>

@interface Wallet : NSObject <RCTBridgeModule, PKAddPassesViewControllerDelegate, PKAddPaymentPassViewControllerDelegate> {
  NSString *jwt;
  NSString *cardId;
  NSString *cardName;
  NSString *clientName;
  NSString *lastDigits;
  NSString *url;
}
@end
