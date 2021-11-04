const webpack = require("webpack")
const _ = require("lodash")
const FRONTEND_EXPOSED_VARIABLES = require("./exposed-variables")

const plugin = env => {
  const dotEnvFilePath = _.get(env, "DOTENV_PATH", ".env")
  const frontendEnvVariables = {}

  require("dotenv").config({ path: dotEnvFilePath })

  console.log(`Frontend Env Variables Plugin"`)
  console.log(`.env path="${dotEnvFilePath}`)

  Object.keys(process.env).forEach(key => {
    if (_.includes(FRONTEND_EXPOSED_VARIABLES, key)) {
      frontendEnvVariables[key] = process.env[key]
    }
  })

  const envVariables = JSON.stringify(frontendEnvVariables)
  console.log(`ENV_VARIABLES=${envVariables}`)

  return new webpack.DefinePlugin({
    ENV_VARIABLES: envVariables,
  })
}
module.exports = plugin
