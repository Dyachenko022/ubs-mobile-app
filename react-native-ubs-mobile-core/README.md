
# react-native-ubs-mobile-core

## Getting started

`$ npm install react-native-ubs-mobile-core --save`

### Mostly automatic installation

`$ react-native link react-native-ubs-mobile-core`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-ubs-mobile-core` and add `RNUbsMobileCore.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNUbsMobileCore.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.reactlibrary.RNUbsMobileCorePackage;` to the imports at the top of the file
  - Add `new RNUbsMobileCorePackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-ubs-mobile-core'
  	project(':react-native-ubs-mobile-core').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-ubs-mobile-core/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-ubs-mobile-core')
  	```

#### Windows
[Read it! :D](https://github.com/ReactWindows/react-native)

1. In Visual Studio add the `RNUbsMobileCore.sln` in `node_modules/react-native-ubs-mobile-core/windows/RNUbsMobileCore.sln` folder to their solution, reference from their app.
2. Open up your `MainPage.cs` app
  - Add `using Ubs.Mobile.Core.RNUbsMobileCore;` to the usings at the top of the file
  - Add `new RNUbsMobileCorePackage()` to the `List<IReactPackage>` returned by the `Packages` method


## Usage
```javascript
import RNUbsMobileCore from 'react-native-ubs-mobile-core';

// TODO: What to do with the module?
RNUbsMobileCore;
```
  