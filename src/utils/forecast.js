const request = require("request");

const forecast = (latitude, longitude, callback) => {
  const url = `http://api.weatherstack.com/current?access_key=02cfb75e230968e550bb560c5fb3f1e6&query=${latitude},${longitude}&units=f`;

  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback("Unable to connect to location services", undefined);
    } else if (body.error) {
      callback("Unable to find location. Try another search.", undefined);
    } else {
      callback(
        undefined,
        body.current.weather_descriptions[0] +
          ". It is currently " +
          body.current.temperature +
          " degrees Fahrenheit out. It feels like " +
          body.current.feelslike +
          " degrees Fahrenheit out."
      );
    }
  });
};

module.exports = forecast;
