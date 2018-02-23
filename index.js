const APP_SERVER = 'http://localhost';
const APP_PORT = 8182;
const ACTIVITI_IMAGE_SERVER = 'http://localhost:9000';




var http = require('http'),
    httpProxy = require('http-proxy');
var liveServer = require("live-server");
var _ = require('lodash');


var proxy = httpProxy.createProxyServer({});

function outputPlantumlImage(req, res, next) {
  if(_.endsWith(req.url, '.bpmn.png'))
  {
    const name = req.url.substring(1,req.url.length-4);
    res.setHeader('Content-Type', 'image/png');
    req.url = `/activiti_image_server/proxy?name=${name}&src=${APP_SERVER}:${APP_PORT}/${name}`;
    proxy.web(req, res, { target: ACTIVITI_IMAGE_SERVER });
  }else{
    next();
  }
}

var params = {
    port: APP_PORT, // Set the server port. Defaults to 8080. 
    host: "0.0.0.0", // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP. 
    open: true, // When false, it won't load your browser by default. 
    ignore: 'scss,my/templates', // comma-separated string for paths to ignore 
    file: "index.html", // When set, serve this file for every 404 (useful for single-page applications) 
    wait: 1000, // Waits for all changes, before reloading. Defaults to 0 sec. 
    mount: [['/components', './node_modules']], // Mount a directory to a route. 
    logLevel: 0, // 0 = errors only, 1 = some, 2 = lots 
    middleware: [outputPlantumlImage] // Takes an array of Connect-compatible middleware that are injected into the server middleware stack 
};

console.info(`http://0.0.0.0:${APP_PORT}/index.html`);

liveServer.start(params);
