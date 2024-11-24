import { StatusCodes } from 'http-status-codes';
import { ValidationError } from 'yup';

export const validation = (getAllSchemas) => async (req, res, next) => {
  const schemas = getAllSchemas((schema) => schema);


  const errorsResult = {};

  Object.entries(schemas).forEach(([key, schema]) => {
    try {
      schema.validateSync(req[key], { abortEarly: false });
    } catch (err) {
      const yupError = err instanceof ValidationError ? err : null;
      if (yupError) {
        const errors = {};
        yupError.inner.forEach((error) => {
          if (error.path === undefined) return;
          errors[error.path] = error.message;
        });
        errorsResult[key] = errors;
      }
    }
  });

  if (Object.keys(errorsResult).length === 0) {
    return next();
  } else {
    return res.status(StatusCodes.BAD_REQUEST).json({ errors: errorsResult });
  }
};
