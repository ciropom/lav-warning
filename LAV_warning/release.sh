#!/bin/bash
#init

MOBILE_SDK=$TITANIUM_SDK
#ANDROID_SDK=/Users/ttp/Documents/Development/android-sdk-mac_x86

mkdir temp
mkdir dist
rm -rf temp/*
rm -rf dist/*

#copy apk
cp build/android/bin/app-unsigned.apk .
unzip -o -d temp/ app-unsigned.apk

#remove some things - you may want to remove other cruft
#rm -rf temp/lib/armeabi
#rm -rf temp/lib/armeabi-v7a
rm -rf temp/lib/x86
#this is needed since 2.1.0
#rm -rf temp/res/drawable/background.png
rm -rf temp/ti

#zip it
cd temp
#solve eventual rights problem
chmod -R 777 *
zip -r ../dist/LAV_Warning-unsigned.apk *
cd ..

#sign
jarsigner -sigalg MD5withRSA -digestalg SHA1 -keystore ../apk.keystore -signedjar dist/LAV_Warning.apk dist/LAV_Warning-unsigned.apk mykey
$ANDROID_SDK/tools/zipalign -v 4 dist/LAV_Warning.apk dist/LAV_Warning.apkz
mv dist/LAV_Warning.apkz dist/LAV_Warning.apk

#install
#$ANDROID_SDK/platform-tools/adb -d install -r dist/app.apk
 
#size
echo "Optimized app from "
du -hs app-unsigned.apk
echo "to"
du -hs dist/LAV_Warning.apk
