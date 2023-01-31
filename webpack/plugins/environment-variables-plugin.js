const webpack = require("webpack")
const _ = require("lodash")
const FRONTEND_EXPOSED_VARIABLES = require("./exposed-variables")

const getCurrentRevision = () => {
  // Revision hash comes from an environment variable (CI)
  const envRevision = process.env.CI_COMMIT_SHORT_SHA
  if (envRevision) {
    return envRevision
  }
  // Get revision hash from Git commit
  return require("child_process")
    .execSync("git rev-parse HEAD")
    .toString()
    .trim()
    .slice(0, 8)
}

const getPackageVersion = () => process.env.npm_package_version

const plugin = env => {
  const dotEnvFilePath = _.get(env, "DOTENV_PATH", ".env")
  const frontendEnvVariables = {}

  require("dotenv").config({ path: dotEnvFilePath })

  // Add additional variables
  frontendEnvVariables.SPECTACLE_VERSION = getPackageVersion()
  frontendEnvVariables.SPECTACLE_REVISION = getCurrentRevision()

  Object.keys(process.env).forEach(key => {
    if (_.includes(FRONTEND_EXPOSED_VARIABLES, key)) {
      frontendEnvVariables[key] = process.env[key]
    }
  })

  const envVariables = JSON.stringify(frontendEnvVariables)

  return new webpack.DefinePlugin({
    ENV_VARIABLES: envVariables,
  })
}

module.exports = plugin
