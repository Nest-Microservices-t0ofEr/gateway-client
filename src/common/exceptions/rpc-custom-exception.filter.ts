import { Catch, ArgumentsHost, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter {
    catch(exception: RpcException, host: ArgumentsHost) {
        const rpcError = exception.getError();
        
        let status = HttpStatus.BAD_REQUEST;
        let message = 'Unknown error';

        if (typeof rpcError === 'string') {
            if (rpcError.includes('Empty response')) {
                status = HttpStatus.INTERNAL_SERVER_ERROR;
                message = rpcError.substring(0, rpcError.indexOf('(')) || rpcError;
            } else {
                message = rpcError;
            }
        } else if (typeof rpcError === 'object' && rpcError !== null) {
            const errorObj = rpcError as { status?: number; message?: string };

            if ('status' in errorObj && 'message' in errorObj) {
                status = typeof errorObj.status === 'number' ? errorObj.status : HttpStatus.BAD_REQUEST;
                message = typeof errorObj.message === 'string' ? errorObj.message : 'Error desconocido';
            }
        }
        console.log({ status, message });
        throw new RpcException({ status, message });
    }
}
