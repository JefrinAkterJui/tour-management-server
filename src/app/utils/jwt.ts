import  jwt, { JwtPayload, SignOptions }  from "jsonwebtoken"
export const genaretToken =(paylode: JwtPayload , secret: string,expiresIn: string )=>{
    const token = jwt.sign(paylode, secret, {
        expiresIn
    }as SignOptions)
    return token
}
export const verifyToken = (token: string , secret: string)=>{
    const verifiedToken = jwt.verify(token , secret);
    return verifiedToken
}