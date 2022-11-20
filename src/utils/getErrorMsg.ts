export function getErrorMsg (error: any) {
  if (typeof error === 'string') return error
  if (error instanceof Error) return error.message
  return ''
}