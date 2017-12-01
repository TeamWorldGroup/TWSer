const Behavior = require("../Server").Behavior;

module.exports.server = function(serv) {
  serv.behavior = new Behavior(serv);
};

module.exports.entity = function (entity) {
  entity.behavior = new Behavior(entity);
};