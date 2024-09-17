function convertTimestampToTime(timestamp: string | number) {
  const date = new Date(+timestamp * 1000);
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const formattedHours = hours < 10 ? "0" + hours : hours;
  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

  const timeString = `${formattedHours}:${formattedMinutes}`;

  return timeString;
}

export { convertTimestampToTime };
