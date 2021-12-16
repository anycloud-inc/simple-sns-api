import {
  validate as _validate,
  ValidationError as _ValidationError,
} from 'class-validator'
import { ValidationError } from '../error'

function getErrorMessage(errors: _ValidationError[]): string {
  return errors
    .map(error => {
      return Object.values(error.constraints || {})
    })
    .join(', ')
}

export const validateOrFail = async (entity: Record<string, any>) => {
  const errors = await _validate(entity)
  if (errors.length > 0) {
    const errorMessage = getErrorMessage(errors)
    throw new ValidationError(errorMessage)
  }
}
