const express = require("express");
const port = 3000;
const app = express();
const path = require('path')

app.get("/", function (request, response) {
  app.use('/public', express.static("./src/public"));
  app.use('/static', express.static('./src/static'))
  app.use('/modules', express.static('./src/modules'))
  app.use('/utils', express.static('./src/utils'))
  app.use('/data', express.static('./src/data'))
  app.use('/shaders', express.static('./src/shaders'))
  response.sendFile(__dirname + "/src/views/index.html");
});

app.get("/boids", function (request, response) {
  console.log('...Serving Boids...')
  app.use('/public', express.static("./src/public"));
  app.use('/static', express.static('./src/static'))
  app.use('/modules', express.static('./src/modules'))
  app.use('/utils', express.static('./src/utils'))
  app.use('/data', express.static('./src/data'))
  app.use('/shaders', express.static('./src/shaders'))
  response.sendFile(__dirname + "/src/views/boids.html");
});

app.get("/delaunay", function (request, response) {
  console.log('...Serving Delaunay...')
  app.use('/public', express.static("./src/public"));
  app.use('/static', express.static('./src/static'))
  app.use('/modules', express.static('./src/modules'))
  app.use('/utils', express.static('./src/utils'))
  app.use('/data', express.static('./src/data'))
  app.use('/shaders', express.static('./src/shaders'))
  response.sendFile(__dirname + "/src/views/delaunay.html");
});

app.get("/delaunay", function (request, response) {
  console.log('...Serving Delaunay...')
  app.use('/public', express.static("./src/public"));
  app.use('/static', express.static('./src/static'))
  app.use('/modules', express.static('./src/modules'))
  app.use('/utils', express.static('./src/utils'))
  app.use('/data', express.static('./src/data'))
  app.use('/shaders', express.static('./src/shaders'))
  response.sendFile(__dirname + "/src/views/delaunay.html");
});
// app.get("/sound_galaxy", function (request, response) {
//   app.use("sound_galaxy/public", express.static("./src/public"));
//   app.use("sound_galaxy/static", express.static("./src/static"));
//   app.use("sound_galaxy/modules", express.static("./src/modules"));
//   app.use("sound_galaxy/shaders", express.static("./src/shaders"));
//   app.use("sound_galaxy/utils", express.static("./src/utils"));
//   app.use("sound_galaxy/data", express.static("./src/data"));
//   response.sendFile(__dirname + "/src/views/index.html");
// });
app.get("/sound_galaxy", function (request, response) {
  app.use('/sound_galaxy/public', express.static("./sound_galaxy/src/public"));
  app.use('/sound_galaxy/static', express.static('./sound_galaxy/src/static'))
  app.use('/sound_galaxy/modules', express.static('./sound_galaxy/src/modules'))
  app.use('/sound_galaxy/utils', express.static('./sound_galaxy/src/utils'))
  app.use('/sound_galaxy/data', express.static('./sound_galaxy/src/data'))
  response.sendFile(__dirname + "/sound_galaxy/src/views/index.html");
});





var server = app.listen(process.env.PORT || port, listen);


function listen() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('App listening at http://' + host + ':' + port);
    console.log('App listening at http://localhost:'+ port);
}
