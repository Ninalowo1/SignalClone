const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.resolver.alias = {
  "@": "./src",
  "@/convex": "./convex", // Map @/convex to the convex directory
};

module.exports = config;