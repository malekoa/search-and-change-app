import { useState, useEffect } from 'react';

function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  function resetTimer() {
    setSeconds(0);
  }

  function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const remainingSeconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${remainingSeconds}`;
  }

  return (
    <div>
      <p>Timer: {formatTime(seconds)}</p>
      <button onClick={resetTimer}>Reset</button>
    </div>
  );
}

export default Timer;


