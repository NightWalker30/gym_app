const { getDefaultConfig } = require('expo/metro-config');
const{ withNativeWind}=require('nativewind/metro');
// Obtenir la configuration par défaut
const config = getDefaultConfig(__dirname);



module.exports = withNativeWind(config,{ input: './app/globals.css'});
