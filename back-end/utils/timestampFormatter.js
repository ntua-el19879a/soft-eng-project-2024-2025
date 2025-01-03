//Purpose: Stores utility functions for cross-cutting concerns like logging, formatting, or parsing data.

// Timestamp Formatter functions 

const currentTimestamp = () => {
  // YYYY-MM-DD hh:mm format
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

const timestampFormatter = (date, time) => {
  // from YYYYMMDDhhmm to YYYY-MM-DD hh:mm format
  return `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)} ${time.slice(0, 2)}:${time.slice(2, 4)}`;
}

module.exports = {
  currentTimestamp,
  timestampFormatter
}