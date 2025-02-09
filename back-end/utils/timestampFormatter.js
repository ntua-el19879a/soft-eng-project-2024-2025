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

function timestampFormatter(dateStr, timeStr) {
  // YYYYMMDD to MongoDB Date format
  const year = parseInt(dateStr.slice(0, 4), 10);
  const month = parseInt(dateStr.slice(4, 6), 10) - 1; // Month is 0-indexed
  const day = parseInt(dateStr.slice(6, 8), 10);
  const hours = parseInt(timeStr.slice(0, 2), 10);
  const minutes = parseInt(timeStr.slice(2, 4), 10);

  // 3. Create Date object in UTC
  const date = new Date(Date.UTC(year, month, day, hours, minutes, 0)); // Seconds are always 0

  return date;
}
function formatTimestamp(date) {
  // MongoDb Date format to YYYY-MM-DD HH:mm
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

module.exports = {
  currentTimestamp,
  timestampFormatter,
  formatTimestamp
}