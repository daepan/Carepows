export const isPastEndTime = (endTime: string) => {
  const currentTime = new Date();
  const [hours, minutes] = endTime.split(':').map(Number);
  const endDate = new Date();
  endDate.setHours(hours, minutes, 0, 0);
  return endDate < currentTime;
};
