import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }), // Allow logging Error stack traces
  winston.format.splat(),
  winston.format.json(), // Use JSON format for structured logging (Easier for Logstash/Elasticsearch)
);

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: logFormat,
  transports: [
    // 1. Log errors to a separate file (e.g., logs/error-2023-10-01.log)
    new DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxFiles: '14d', // Keep logs for 14 days
    }),

    // 2. Log all other levels (info, debug, warn) to combined file
    new DailyRotateFile({
      filename: 'logs/combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
    }),
  ],
});

// If we're not in production then log to the console with colors
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(), // Add beautiful colors for development
        winston.format.printf(
          ({ level, message, timestamp, stack }) => `${timestamp} ${level}: ${stack || message}`,
        ),
      ),
    }),
  );
}
