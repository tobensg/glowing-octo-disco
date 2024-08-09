"use strict";

// Print all entries, across all of the *async* sources, in chronological order.

const getLogAsync = async (logSource, index) => {
  return logSource.popAsync().then(value => {return value ? {...value, index, nextLog: logSource.popAsync()} : value});
}

module.exports = (logSources, printer) => {
  const sourcePromises = logSources.map(
    (source, index) => {
      return getLogAsync(source, index);
    }
  )
  Promise.all(sourcePromises).then(async logArray => {
    logArray.sort((a, b) => b.date - a.date);
    while (logArray.length) {
      const nextLog = logArray.pop();
      printer.print(nextLog);
      const logIndex = nextLog.index;
      const secondLog = await nextLog.nextLog
      if (secondLog) {
        const newLog = {...secondLog, index: logIndex, nextLog: logSources[logIndex].popAsync()}
        logArray.push(newLog);
        logArray.sort((a, b) => b.date - a.date);
      }
    }
    printer.done()
  });
  return new Promise((resolve, reject) => {
    resolve(console.log("Async sort complete."));
  });
};
