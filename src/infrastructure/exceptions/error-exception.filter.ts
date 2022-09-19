import { ExceptionFilter, Catch, Logger } from '@nestjs/common';

@Catch(Error)
export class ErrorExceptionFilter implements ExceptionFilter {
  catch(exception: Error) {
    Logger.log(exception.message, 'Error Exception Filter');
  }
}
