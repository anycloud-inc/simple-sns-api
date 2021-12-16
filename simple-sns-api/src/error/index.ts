import AppError from './AppError'

export class InvalidRequestError extends AppError {
  constructor(message?: string) {
    super(message || 'Invalid request')
  }
}

export class RequestParameterError extends AppError {
  constructor(message?: string) {
    super(message || 'Invalid request parameters')
  }
}

export class AuthError extends AppError {
  constructor(message?: string) {
    super(message || 'ログインが必要です')
  }
}

export class LoginError extends AppError {
  constructor(message?: string) {
    super(message || 'メールアドレスかパスワードが間違っています')
  }
}

export class EnvVarError extends AppError {
  constructor(message?: string) {
    super(message || 'Required env variables are NOT set')
  }
}

export class ValidationError extends AppError {
  constructor(message?: string) {
    super(message || 'Validation failed')
  }
}

export class AclError extends AppError {
  constructor(message?: string) {
    super(message || '権限がありません')
  }
}
