// Compare completed months only when both contain positive recorded amounts.
export function completedMonthChange(trends, key) {
  if (!Array.isArray(trends) || trends.length < 3) return null;
  const before = Number(trends.at(-3)?.[key]);
  const last = Number(trends.at(-2)?.[key]);
  if (!Number.isFinite(before) || !Number.isFinite(last) || before <= 0 || last <= 0) return null;
  return (last - before) / before * 100;
}
