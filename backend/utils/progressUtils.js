const buildLastYearDates = () => {
  const dates = [];

  for (let i = 364; i >= 0; i -= 1) {
    const dateObj = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    dates.push(dateObj.toLocaleDateString('en-CA'));
  }

  return dates;
};

const calculateStatsFromEntries = (entries) => {
  const totalSolved = entries.reduce((sum, entry) => sum + entry.level, 0);

  let currentStreak = 0;
  for (let i = entries.length - 1; i >= 0; i -= 1) {
    if (entries[i].level > 0) {
      currentStreak += 1;
    } else if (i === entries.length - 1) {
      continue;
    } else {
      break;
    }
  }

  let bestStreak = 0;
  let ongoingStreak = 0;
  entries.forEach((entry) => {
    if (entry.level > 0) {
      ongoingStreak += 1;
      if (ongoingStreak > bestStreak) {
        bestStreak = ongoingStreak;
      }
    } else {
      ongoingStreak = 0;
    }
  });

  return {
    totalSolved,
    currentStreak,
    bestStreak,
  };
};

const buildProgressPayload = (progressHistory = []) => {
  const progressMap = new Map(
    progressHistory.map((entry) => [entry.date, Math.max(0, Math.min(4, Number(entry.level) || 0))]),
  );

  const activity = buildLastYearDates().map((date) => ({
    date,
    level: progressMap.get(date) || 0,
  }));

  return {
    activity,
    stats: calculateStatsFromEntries(activity),
  };
};

module.exports = {
  buildProgressPayload,
};