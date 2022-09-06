module.exports = {
  preset: "ts-jest",
  transform: {
    "^.+\\.(ts|tsx)?$": "ts-jest",
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  testEnvironment: "jsdom",
  moduleFileExtensions: ["tsx", "ts", "js", "jsx", "wasm"],
  testMatch: ["**/*.(test|spec).(ts|tsx)"],
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  setupFiles: ["<rootDir>/.jest/setup-globals.js"],
}
