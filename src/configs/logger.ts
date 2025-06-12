import "dotenv/config";
import path from "path";
import { createLogger, format, transports } from "winston";
import { existsSync, mkdirSync } from "fs";
import winston from "winston";

const { combine, timestamp } = format;

// Define custom levels type with index signature
interface CustomLevels {
  [key: string]: number;
  error: number;
  warn: number;
  info: number;
  http: number;
  verbose: number;
  debug: number;
  silly: number;
}

// Define the levels configuration
const levels: CustomLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
};

// Define colors with proper type
const colors: { [key: string]: string } = {
  error: "red",
  warn: "yellow",
  info: "blue",
  http: "green",
  verbose: "white",
  debug: "orange",
  silly: "cyan",
};

winston.addColors(colors);

const logDir = path.join(__dirname, "..", "..", "logs");
if (!existsSync(logDir)) {
  mkdirSync(logDir);
}

const httpFilter = winston.format((info, opts) => {
  if (info.level === "http") {
    return false;
  }
  return true;
});

const fileFormat = winston.format.combine(
  winston.format.timestamp({
    format: "YYYY-MM-DD HH:mm:ss",
  }),
  winston.format.errors({
    stack: true,
  }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaString =
      Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : "";
    return `${timestamp} [${level}]: ${message}${metaString}`;
  })
);

const logger = createLogger({
  levels: levels,
  level: "debug", // Changed from http to debug to capture all levels
  format: combine(
    timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    format.printf(({ level, message, timestamp }) => {
      return `${timestamp} ${level}: ${message}`;
    })
  ),

  transports: [
    new transports.Console({
      level: "debug",
      format: combine(
        format.colorize(),
        format.timestamp({
          format: "YYYY-MM-DD HH:mm:ss",
        }),
        format.printf(({ timestamp, level, message, ...meta }) => {
          const metaString =
            Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : "";
          return `${timestamp} [${level}]: ${message}${metaString}`;
        })
      ),
    }),

    new transports.File({
      filename: path.join(logDir, "combine.log"),
      format: fileFormat,
    }),

    new transports.File({
      level: "http",
      filename: path.join(logDir, "http.log"),
      format: combine(
        fileFormat,
        winston.format(info => {
          return info.level === "http" ? info : false;
        })()
      ),
    }),

    new transports.File({
      level: "error",
      filename: path.join(logDir, "error.log"),
      format: fileFormat,
    }),
  ],
});

export { logger };
