import { Request, Response, NextFunction } from "express";
import moment from "moment";

export default function loggingMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(
    `${req.method} made to: ${req.protocol}://${req.header("Host")}${
    req.url
    } --- ${moment().format()}`
  );
  next();
}

// export default loggingMiddleware;
