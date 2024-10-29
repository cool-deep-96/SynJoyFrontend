export const formatTime = (time: number) => {
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    const minutes = Math.floor((time / 60) % 60).toString().padStart(2, '0');
    const hours = Math.floor(time / 3600).toString().padStart(2, '0');
  
    return hours === '00' 
      ? `${minutes}:${seconds}` 
      : `${hours}:${minutes}:${seconds}`;
  };
  