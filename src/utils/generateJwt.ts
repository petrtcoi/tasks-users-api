import jwt from 'jsonwebtoken'

export function generateJwt (userId: string) {
  const token = jwt.sign({_id: userId}, process.env.SECRET_WORD || 'some_word', {expiresIn: '7 days'})
  return token
}