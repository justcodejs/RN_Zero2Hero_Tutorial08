# Setup Steps from Tutorial 7 to 8
This guide will show you the steps to perform if you are working from Tutorial 7 source code.

# Components to install
We need to install a few modules to enable push notification.

```
yarn add @react-native-firebase/app \
@react-native-firebase/messaging

cd ios

# Because in Tutorial 5 we had install Firebase for OCR
# and now the Firebase have new version released,
# so we need to update it.
pod update Firebase/CoreOnly  

cd ..

yarn add react-native-version-number
pod install
```
