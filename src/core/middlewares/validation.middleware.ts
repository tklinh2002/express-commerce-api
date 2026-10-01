import { Request, Response, NextFunction } from 'express';
import { plainToInstance, ClassConstructor } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

export function validationMiddleware<T extends object>(
  type: ClassConstructor<T>,
): (req: Request, res: Response, next: NextFunction) => void {
  return (req: Request, res: Response, next: NextFunction) => {
    // 1. Transform plain JavaScript object (req.body) into a class instance of the DTO
    const dtoObj = plainToInstance(type, req.body);

    // 2. Perform validation using class-validator
    validate(dtoObj).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        // If validation fails, extract constraints and format into an array of error messages
        const dtoErrors = errors.map((error: ValidationError) =>
          Object.values(error.constraints || {}).join(', '),
        );

        // Return 400 Bad Request with error details
        res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: dtoErrors,
        });
      } else {
        // If successful, replace req.body with the validated instance and proceed to the controller
        req.body = dtoObj;
        next();
      }
    });
  };
}
