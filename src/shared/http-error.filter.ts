import { Catch, HttpException, ArgumentsHost, Logger, HttpStatus } from '@nestjs/common';
import { GqlExceptionFilter, GqlArgumentsHost } from '@nestjs/graphql';

@Catch()
export class HttpErrorFilter implements GqlExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const gqlHost = GqlArgumentsHost.create(host);
        const ctx = gqlHost.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse();
        const status = exception.getStatus ? exception.getStatus() :
            HttpStatus.INTERNAL_SERVER_ERROR;
        const errorResponse = {
            code: status,
            timestamp: new Date().toLocaleDateString(),
            path: request.url,
            method: request.method,
            message: (status !== HttpStatus.INTERNAL_SERVER_ERROR) ? (exception.message.error || exception.message || null) :
                'internal server error'};
        if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
            console.log(exception);
        }
        Logger.error(`${request.method} ${request.url}`, JSON.stringify(errorResponse), 'ExceptionFilter');
        response.status(status).json(errorResponse);

        return exception;

    }
}
