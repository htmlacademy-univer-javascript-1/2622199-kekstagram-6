function time(startDay, endDay, startTime, lengthTime) {
  const timeOnMinute = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const startDayMinutes = timeOnMinute(startDay);
  const endDayMinutes = timeOnMinute(endDay);
  const startTimeMinutes = timeOnMinute(startTime);
  const endTimeMinutes = startTimeMinutes + lengthTime;

  return startTimeMinutes >= startDayMinutes && endTimeMinutes <= endDayMinutes;
}

time('8:00', '17:00', '17:05', 15);
