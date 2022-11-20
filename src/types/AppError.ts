export class AppError extends Error {
  route: string
  status: number


  constructor (route: string, message: string, status: number = 500) {
    super()
    this.name = 'AppError'
    this.route = route
    this.message = message
    this.status = status
  }
}