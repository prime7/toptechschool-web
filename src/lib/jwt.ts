import { SignJWT, jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key')

export const createVerificationToken = async (email: string) => {
    const token = await new SignJWT({ email })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('1h')
        .sign(secret)
    return token
}

export const verifyToken = async (token: string) => {
    try {
        const { payload } = await jwtVerify(token, secret)
        return payload.email as string
    } catch {
        return null
    }
}