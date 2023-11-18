// 로깅을 위한 winston 설정
import winston from "winston";
import winstonDaily from "winston-daily-rotate-file";

const { format } = winston;
const { combine, timestamp, printf } = format;

// 로그 메시지 형식
const customFormat = printf(info => {
  return `${info.timestamp} ${info.level}: ${info.message}`;
});

// 로거 설정
const logger = winston.createLogger({
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    customFormat,
  ),
  transports: [
    new winston.transports.Console(),

    new winstonDaily({
      level: 'info',
      datePattern: 'YYYYMMDD',
      dirname: './logs',
      filename: `asku_%DATE%.log`,
      maxFiles: 14
    }),
  ],
});

const stream = {
  write: (message: string) => {
    logger.info(message);
  }
};

export { logger, stream };
