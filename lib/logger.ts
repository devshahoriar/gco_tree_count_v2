import winston from 'winston'
import  'winston-daily-rotate-file';

const { combine, timestamp, json } = winston.format

const transport = new winston.transports.DailyRotateFile({
  filename: './log/application-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  maxSize: '20m',
  maxFiles: '14d'
});

const logger = winston.createLogger({
  level: 'info',
  format: combine(timestamp(), json({})),
  transports: [
    transport,
  ],
})

export default logger
