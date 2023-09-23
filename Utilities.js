export const getLocalISOString = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const date = String(now.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${date}`;
  };

  export const getEventsForDate = (date, scheduleData) => {
    return scheduleData.filter(event => event.date === date);
  };
  
  export const calculateTimePosition = (startTime, startingHour, endingHour) => {
    const [hour, minute] = startTime.split(':').map(Number);
    const totalMinutes = ((hour - 6 + 24) % 24) * 60 + minute; // Adjust for 6AM start
  
    const position = (totalMinutes / ((endingHour - startingHour + 1) * 60) * 93 + 7); //1260 minutes from 6AM to 2AM
  
    return `${position}%`;
  };
  
  export const calculateBlockHeight = (startTime, endTime, startingHour, endingHour) => {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
  
    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;
  
    const durationMinutes = endTotalMinutes - startTotalMinutes;
  
    const height = (durationMinutes / ((endingHour - startingHour + 1) * 60)) * 93; // Adjusted for 20-hour range
    return `${height}%`;
  };
  
  export const formatTime = (time) => {
    const [hour, minute] = time.split(":").map(Number);
    const period = hour < 12 || hour === 24 ? "AM" : "PM";
    const formattedHour = hour === 0 ? 12 : (hour > 12 ? hour - 12 : hour);
    const formattedMinute = String(minute).padStart(2, "0");

    return `${formattedHour}:${formattedMinute} ${period}`;
  };
  
  export const calculateCurrentTimePosition = (startingHour, endingHour) => {
    const now = getCurrentDate();
    const minutes = new Date();
    
    const totalMinutes = ((now.getHours() - startingHour) % 24) * 60 + minutes.getMinutes();
    const position = (totalMinutes / ((endingHour - startingHour + 1) * 60)) * 93 + 7;
  
    return `${position}%`;
  };

  export const getCurrentDate = () => {
    return new Date();
};