var logger = require('./logger');
module.exports = function(app) {
  if(typeof app.channel !== 'function') {
    // If no real-time functionality has been configured just return
    return;
  }

  app.on('connection', connection => {
    // for this app only one channel is necessarry since authentication is done via middleware and
    
    app.channel('anonymous').join(connection)
  });
  
  // eslint-disable-next-line no-unused-vars
  app.publish((data, context) => {
    logger.info('publishing data to anonymous channel')
    return app.channel('anonymous')
  });
};
