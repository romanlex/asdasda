const getPerformance = (): Performance => {
  if (process.env.BUILD_TARGET === 'server') {
    return require('perf_hooks').performance
  }
  return global.performance
}

// eslint-disable-next-line no-console
export function measurement(name: string, commonLog = console.log) {
  const performance = getPerformance()
  const timeStart = performance.now()
  return {
    measure: (log = commonLog, text = name) => {
      const difference = performance.now() - timeStart
      log(`[PERF] ${text} for ${difference.toFixed(2)}ms`)
      return difference
    },
  }
}
