import { Catch, ArgumentsHost, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter {
    catch(exception: RpcException, host: ArgumentsHost) {
        const ctx = host.switchToRpc();
        const rpcError = exception.getError();

        // Si no hay rpcError, se devuelve un mensaje genérico de error interno
        if (!rpcError) {
            return {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Internal server error',
            };
        }

        // Si rpcError es un string que contiene "Empty response", se maneja de manera especial
        if (typeof rpcError === 'string' && rpcError.includes('Empty response')) {
            return {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: rpcError.substring(0, rpcError.indexOf('(') - 1),
            };
        }

        // Si rpcError es un objeto, se verifican las propiedades 'status' y 'message'
        if (typeof rpcError === 'object' && rpcError !== null && 'status' in rpcError && 'message' in rpcError) {
            return {
                status: typeof rpcError.status !== 'number' ? HttpStatus.BAD_REQUEST : rpcError.status,
                message: rpcError.message,
            };
        }

        // Si rpcError es un string o cualquier otro tipo no manejado, se devuelve un error por defecto
        return {
            status: HttpStatus.BAD_REQUEST,
            message: typeof rpcError === 'string' ? rpcError : exception.message || 'Unknown error',
        };
    }
}
