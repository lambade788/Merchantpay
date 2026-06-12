import { createContext, useContext, useEffect, useState } from "react";

// Create Context
const RealtimeContext = createContext();

// Provider
export const RealtimeProvider = ({ children }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Placeholder for future SSE / WebSocket
    // Example:
    // const eventSource = new EventSource("http://localhost:8080/api/stream");

    // eventSource.onmessage = (event) => {
    //   const data = JSON.parse(event.data);
    //   setEvents((prev) => [...prev, data]);
    // };

    // return () => eventSource.close();

  }, []);

  return (
    <RealtimeContext.Provider value={{ events }}>
      {children}
    </RealtimeContext.Provider>
  );
};

// Hook
export const useRealtime = () => useContext(RealtimeContext);