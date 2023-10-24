module.exports.logger = (req, res, next) => {
  let requestColor;
  switch (req.method) {
    case "GET":
      requestColor = "\x1b[34m"; // Blue color for GET requests
      break;
    case "POST":
      requestColor = "\x1b[33m"; // Yellow color for POST requests
      break;
    case "PUT":
      requestColor = "\x1b[36m"; // Cyan color for PUT requests
      break;
    case "DELETE":
      requestColor = "\x1b[31m"; // Red color for DELETE requests
      break;
    default:
      requestColor = "\x1b[0m"; // Default color
  }

  console.log(`${requestColor}${req.method} ${req.url}\x1b[0m`);
  res.on("finish", () => {
    let responseColor;
    if (res.statusCode >= 200 && res.statusCode < 300) {
      responseColor = "\x1b[32m"; // Green color for 2xx codes
    } else if (res.statusCode >= 300 && res.statusCode < 400) {
      responseColor = "\x1b[33m"; // Yellow color for 3xx codes
    } else if (res.statusCode >= 400 && res.statusCode < 500) {
      responseColor = "\x1b[31m"; // Red color for 4xx codes
    } else if (res.statusCode >= 500) {
      responseColor = "\x1b[35m"; // Magenta color for 5xx codes
    } else {
      responseColor = "\x1b[0m"; // Default color
    }

    console.log(`Response ${responseColor}${res.statusCode}\x1b[0m`);
  });
  next();
};
