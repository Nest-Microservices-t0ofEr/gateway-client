import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch()
export class RpcCustomExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(RpcCustomExceptionFilter.name);

    catch(exception: any, host: ArgumentsHost) {
        this.logger.error('Exception caught', exception);
        let errorData = {};
        // Si la excepción es del tipo RpcException, extraemos el error
        if (exception instanceof RpcException) {
            const errorResponse = exception.getError();
            errorData = {
                status: 'error',
                message: typeof errorResponse === 'string' ? errorResponse : errorResponse.message,
                error: typeof errorResponse === 'object' ? errorResponse.error : 500, // Código de error
            };
            console.log(errorData);
            return errorData;
        }

        // Si es otro tipo de error, respondemos con un mensaje genérico
        errorData= {
            status: 'error',
            message: exception.message || 'Internal server error',
            error: 500,
        };
        console.log(errorData);
        return errorData;
    }   
}