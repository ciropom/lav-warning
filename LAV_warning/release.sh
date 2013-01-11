#!/bin/bash
#init

MOBILE_SDK=$TITANIUM_SDK
#ANDROID_SDK=/Users/ttp/Documents/Development/android-sdk-mac_x86

mkdir temp
mkdir dist
rm -r temp/*
rm -r dist/*

#copy apk
cp build/android/bin/app.apk .
unzip -o -d temp/ app.apk

#remove some things - you may want to remove other cruft
#rm -rf temp/lib/armeabi
rm -rf temp/lib/x86

#zip it
cd temp
zip -r ../dist/app-unsigned.apk *
cd ..

#sign I haven't a key
#jarsigner -sigalg MD5withRSA -digestalg SHA1 -storepass tirocks -keystore "$MOBILE_SDK/android/dev_keystore" -signedjar dist/app.apk dist/app-unsigned.apk tidev
#$ANDROID_SDK/tools/zipalign -v 4 dist/app.apk dist/app.apkz
#mv dist/app.apkz dist/app.apk

#install
#$ANDROID_SDK/platform-tools/adb -d install -r dist/app.apk
 
#size
echo "Optimized app from "
du -hs app.apk
echo "to"
du -hs dist/app-unsigned.apk
