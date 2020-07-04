var Stomp = require('./stomp.js');
var StompNode = require('./stomp-node.js');

module.exports = Stomp.Stomp;
module.exports.overTCP = StompNode.overTCP;
module.exports.overWS = StompNode.overWS;
