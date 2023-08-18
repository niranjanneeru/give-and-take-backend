import winston from "winston";



const loggerFactory = (level, transport) : winston.Logger => {
    return winston.createLogger({
        level: level,
        transports: transport
      });
}

export default loggerFactory;