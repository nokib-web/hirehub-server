import { Response } from 'express';

const sendResponse = <T>(
  res: Response,
  data: {
    success: boolean;
    message: string;
    data: T;
    meta?: any;
    statusCode: number;
  }
): void => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message,
    data: data.data,
    meta: data.meta,
  });
};

export default sendResponse;
