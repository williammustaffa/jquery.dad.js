var liveServer = require("live-server");
 
var params = {
  port: 3000,
  root: "./demo",
  open: true,
  file: "index.html",
};

liveServer.start(params);