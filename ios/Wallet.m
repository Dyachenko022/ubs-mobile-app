//
//  Wallet.m
//  unisab_dbo_app
//
//  Created by Cyrill Samohvalov on 11/04/2019.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

#import "Wallet.h"
#import <React/RCTLog.h>
#import <PassKit/PassKit.h>

@implementation Wallet

- (NSString*)NSDataToString:(NSData*) dat {
  NSUInteger len = [dat length];
  Byte *bytedata = (Byte*)malloc(len);
  [dat getBytes:bytedata length:len];
  NSString *str = @"<";
  int p = 0;
  while(p < len) {
    str = [str stringByAppendingString:[NSString stringWithFormat:@"%02x", bytedata[p]]];
    p++;
    if (p % 4 == 0 && p != len) {
      str = [str stringByAppendingString:@" "];
    }
  }
  str = [str stringByAppendingString:@">"];
  free(bytedata);
  return str;
}

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(click:(NSString *)jwt cardId:(NSString *)cardId cardName:(NSString *)cardName clientName:(NSString *)clientName lastDigits:(NSString *)lastDigits url:(NSString *)url)
{
  BOOL mayAddCard = [PKAddPaymentPassViewController canAddPaymentPass];
  
  self->jwt = jwt;
  self->cardId = cardId;
  self->url = url;
  
  if(mayAddCard) {
    UIApplication *sharedApplication = RCTSharedApplication();
    UIWindow *window = sharedApplication.keyWindow;
    if (window) {
      UIViewController *rootViewController = window.rootViewController;
      if (rootViewController) {
        PKAddPaymentPassRequestConfiguration *addRequest = [[PKAddPaymentPassRequestConfiguration alloc] initWithEncryptionScheme:PKEncryptionSchemeECC_V2];
        addRequest.cardholderName = clientName;
        addRequest.primaryAccountSuffix = lastDigits;
        
        PKAddPaymentPassViewController *vc = [[PKAddPaymentPassViewController alloc] initWithRequestConfiguration:addRequest delegate:self];
        
        if(vc) {
          [rootViewController presentViewController:vc animated:YES completion:nil];
        }
        return;
      }
    }
  }
}

- (void)addPaymentPassViewController:(PKAddPaymentPassViewController *)controller generateRequestWithCertificateChain:(nonnull NSArray<NSData *> *)certificates nonce:(nonnull NSData *)nonce nonceSignature:(nonnull NSData *)nonceSignature completionHandler:(nonnull void (^)(PKAddPaymentPassRequest * _Nonnull))handler {
  NSString *url = self->url;
  NSString* arrSeparator = @"\n    ";
  NSString* certStr = @"(";
  NSUInteger len = [certificates count];
  for (int i = 0; i < len; i++) {
    NSData* a = certificates[i];
    NSString* str = [self NSDataToString:a];
    certStr = [[certStr stringByAppendingString:arrSeparator] stringByAppendingString: str];
    if (i != len - 1) {
      certStr = [certStr stringByAppendingString:@","];
    }
  }
  certStr = [certStr stringByAppendingString:@"\n)"];
  NSString *nonceStr = [self NSDataToString:nonce];
  NSString *nonceSignatureStr = [self NSDataToString:nonceSignature];
  NSArray *parameters = @[
                          @{
                            @"name":@"Идентификатор карты",
                            @"value":self->cardId,
                            @"type":@"int"
                            },
                          @{
                            @"name": @"Сертификат",
                            @"value": certStr,
                            @"type":@"string"
                            },
                          @{
                            @"name":@"Идентифкатор устройства",
                            @"value":[[[UIDevice currentDevice] identifierForVendor] UUIDString],
                            @"type":@"string"
                            },
                          @{
                            @"name":@"Тип кошелька",
                            @"value":@"apple",
                            @"type":@"string"
                            },
                          @{
                            @"name":@"Код операции кошелька",
                            @"value":nonceStr,
                            @"type":@"string"
                            },
                          @{
                            @"name":@"Код авторизации",
                            @"value":nonceSignatureStr,
                            @"type":@"string"
                            }
                          ];
  
  NSDictionary *jsonBodyDict = @{
                                 @"parameters": parameters,
                                 @"sidRequest":@"GetPayLoadToWallet"
                                 };
  
  NSData *jsonBodyData = [NSJSONSerialization dataWithJSONObject:jsonBodyDict options:NSJSONWritingPrettyPrinted error:nil];
  NSMutableURLRequest *request = [NSMutableURLRequest new];
  request.HTTPMethod = @"POST";
  
  NSLog(@"The request data is: %@", jsonBodyData);
  
  [request setURL:[NSURL URLWithString:url]];
  [request setValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
  [request setValue:@"application/json" forHTTPHeaderField:@"Accept"];
  [request setValue:self->jwt forHTTPHeaderField:@"UbsJWT"];
  [request setValue:@"execute/GetPayLoadToWallet" forHTTPHeaderField:@"sidRequest"];
  [request setValue:@"2221-12-31T23:59:59.660" forHTTPHeaderField:@"timeRequest"];
  [request setHTTPBody:jsonBodyData];
  
  NSURLSessionConfiguration *config = [NSURLSessionConfiguration defaultSessionConfiguration];
  
  NSURLSession *session = [NSURLSession sessionWithConfiguration:config delegate:nil delegateQueue:[NSOperationQueue mainQueue]];
  
  NSURLSessionDataTask *task = [session dataTaskWithRequest:request completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
    NSDictionary *forJSONObject = [NSJSONSerialization JSONObjectWithData:data options:kNilOptions error:nil];
    
    NSArray *values = forJSONObject[@"values"];
    
    NSPredicate *predicate1 = [NSPredicate predicateWithFormat:@"name == %@", @"Данные аутентификации"];
    NSPredicate *predicate2 = [NSPredicate predicateWithFormat:@"name == %@", @"Данные активации"];
    NSPredicate *predicate3 = [NSPredicate predicateWithFormat:@"name == %@", @"Эфемерный открытый ключ"];
    
    NSString *encryptedPassData = [[values filteredArrayUsingPredicate:predicate1] objectAtIndex:0][@"value"];
    NSString *activationData = [[values filteredArrayUsingPredicate:predicate2] objectAtIndex:0][@"value"];
    NSString *ephemeralPublicKey = [[values filteredArrayUsingPredicate:predicate3] objectAtIndex:0][@"value"];

    PKAddPaymentPassRequest * paymentPassRequest = [[PKAddPaymentPassRequest alloc] init];
    if (encryptedPassData && activationData && ephemeralPublicKey) {
      paymentPassRequest.encryptedPassData = [[NSData alloc]
                                              initWithBase64EncodedString:encryptedPassData options:0];
      paymentPassRequest.activationData = [activationData dataUsingEncoding: NSUTF8StringEncoding];
      paymentPassRequest.ephemeralPublicKey = [[NSData alloc]
                                               initWithBase64EncodedString:ephemeralPublicKey options:0];
    }
    handler (paymentPassRequest);
  }];
  [task resume];
};

- (void)addPaymentPassViewController:(PKAddPaymentPassViewController *)controller didFinishAddingPaymentPass:(PKPaymentPass *)pass error:(NSError *)error
{
  UIApplication *sharedApplication = RCTSharedApplication();
  UIWindow *window = sharedApplication.keyWindow;
  if (window) {
    UIViewController *rootViewController = window.rootViewController;
    [rootViewController dismissViewControllerAnimated:YES completion:nil];
  }
};

RCT_REMAP_METHOD(checkCardBySuffix,
                 suffix:(NSString *)suffix
                 findEventsWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  NSMutableDictionary* dictionary = [[NSMutableDictionary alloc] init];
  [dictionary setObject:@NO forKey:@"isInWallet"];
  [dictionary setObject:@NO forKey:@"isInWatch"];
  [dictionary setObject:@"" forKey:@"FPANID"];
  
  PKPassLibrary *passLib = [[PKPassLibrary alloc] init];
  
  for (PKPaymentPass *pass in [passLib passesOfType:PKPassTypePayment]){
    if ([pass.primaryAccountNumberSuffix isEqualToString:suffix]) {
      [dictionary setObject:@YES forKey:@"isInWallet"];
      [dictionary setObject:pass.primaryAccountIdentifier forKey:@"FPANID"];
      break;
    }
  }
  
  for (PKPaymentPass *remotePass in [passLib remotePaymentPasses]){
    if([remotePass.primaryAccountNumberSuffix isEqualToString:suffix]){
      [dictionary setObject:@YES forKey:@"isInWatch"];
      [dictionary setObject:remotePass.primaryAccountIdentifier forKey:@"FPANID"];
      break;
    }
  }
  
  if (dictionary) {
    resolve(dictionary);
  } else {
    NSError *error =nil;
    reject(@"no_events", @"There were no events", error);
  }
}

RCT_REMAP_METHOD(canAddPaymentPass,
                 findEventsWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  BOOL mayAddCard = [PKAddPaymentPassViewController canAddPaymentPass];
  
  if (mayAddCard) {
    resolve(@YES);
  } else {
    NSError *error = nil;
    reject(@"no_events", @"App can't add cards to Apple Wallet", error);
  }
}

RCT_EXPORT_METHOD(openWallet) {
  UIApplication *application = [UIApplication sharedApplication];
  NSURL *URL = [NSURL URLWithString:@"shoebox://"];
  [application openURL:URL options:@{} completionHandler:nil];
}


@end
