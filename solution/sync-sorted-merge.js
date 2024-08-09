"use strict";
const getLog = (logSource, index) => {
  const log = logSource.pop();
  // this allows us to pass either the log object with an included 
  // index or just the false value
  return log ? {...log, index} : log;
};

const fetchAndSortLogs = (logSources) => {
  const logs = logSources.reduce((acc, curr, ind) => {
    const fetchedLog = getLog(curr, ind)
    const logs = fetchedLog ? [...acc, fetchedLog] : acc;
    return logs;
  }, []);
  return logs.sort((a, b) => b.date - a.date);
};
// Print all entries, across all of the sources, in chronological order.
module.exports = (logSources, printer) => {
  // syncLogSources has n sources.  call pop to get data
  // data object contains date and msg
  const sortedLogs = fetchAndSortLogs(logSources);
  while (sortedLogs.length) {
    const nextLog = sortedLogs.pop();
    printer.print(nextLog);
    const fetchedLog = getLog(logSources[nextLog.index], nextLog.index)
    if (fetchedLog) {
      sortedLogs.push(fetchedLog)
      sortedLogs.sort((a, b) => b.date - a.date);
    }
  }
  printer.done()
  return console.log("Sync sort complete.");
};
