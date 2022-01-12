const assets: {
  client: {
    css: string
    js: string
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
} = require(process.env.RAZZLE_ASSETS_MANIFEST!)

export { assets }
