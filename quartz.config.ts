// 환경에 따라 적절한 설정 파일을 import
const isDev = process.env.NODE_ENV === "development" || process.env.QUARTZ_ENV === "dev"

let config
if (isDev) {
  config = require("./quartz.config.dev").default
} else {
  config = require("./quartz.config.prod").default
}

export default config
