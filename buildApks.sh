cd ./android
mkdir -p ../buildApk

function copyWithRename() {
  targetFile=$(find $1 -name "*.apk" -type f)
  cp $targetFile "../buildApk/$2_${targetFile##*/}" && echo "Copied $2"
}

./gradlew task assembleRsi
copyWithRename "./app/build/outputs/apk/rsiBankServerRsi/release" "RSI BANK"
copyWithRename  "./app/build/outputs/apk/rsiSaturn/release" "RSI_SATURN"
copyWithRename  "./app/build/outputs/apk/rsiSupport/release" "RSI_SUPPORT"

./gradlew task assembleRub
copyWithRename "./app/build/outputs/apk/rubBankServerRub/release" "RUB BANK"
copyWithRename  "./app/build/outputs/apk/rubSaturn/release" "RUB_SATURN"
copyWithRename  "./app/build/outputs/apk/rubSupport/release" "RUB_SUPPORT"

./gradlew task assembleIpb
copyWithRename "./app/build/outputs/apk/ipbBankServerIpb/release" "IPB BANK"
copyWithRename  "./app/build/outputs/apk/ipbSaturn/release" "IPB_SATURN"
copyWithRename  "./app/build/outputs/apk/ipbSupport/release" "IPB_SUPPORT"

./gradlew task assembleKrk
copyWithRename "./app/build/outputs/apk/krkBankServerKrk/release" "KRK BANK"
copyWithRename  "./app/build/outputs/apk/krkSaturn/release" "KRK_SATURN"
copyWithRename  "./app/build/outputs/apk/krkSupport/release" "KRK_SUPPORT"

./gradlew task assembleElt
copyWithRename "./app/build/outputs/apk/eltBankServerElt/release" "ELT BANK"
copyWithRename  "./app/build/outputs/apk/eltSaturn/release" "ELT_SATURN"
copyWithRename  "./app/build/outputs/apk/eltSupport/release" "ELT_SUPPORT"