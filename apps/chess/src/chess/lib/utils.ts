function convertTimestampToTime(timestamp: string) {
    const date = new Date(timestamp)
    const hours = date.getHours()
    const minutes = date.getMinutes()
    

     const formattedHours = hours < 10 ? '0' + hours : hours;
     const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
     

     const timeString = `${formattedHours}:${formattedMinutes}`;
 
     return timeString;
}

export { convertTimestampToTime }