import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, path: url } = request;
    const userAgent = request.get('user-agent') || '';

    this.logger.log(`-> ${method} ${url} - ${userAgent} ${ip}`);

    response.on('close', () => {
      const { statusCode } = response;

      this.logger.log(`<- ${method} ${url} ${statusCode} - ${userAgent} ${ip}`);
    });

    next();
  }
}
