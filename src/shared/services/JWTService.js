import jwt from "jsonwebtoken";


const signIn = (data) => {
    console.log("Data: ", data);
    
    if (!process.env.JWT_SECRET)
        return 'JWT_SECRET_NOT_FOUND';

    const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '600s' })
    return token;
}

const verify = (token) => {

    if (!process.env.JWT_SECRET)
        return 'JWT_SECRET_NOT_FOUND';

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (typeof decoded === 'string') {
            return 'INVALID TOKEN'
        }
        
        return decoded;
    } catch (error) {
        return 'INVALID TOKEN'
    }
}

export const JWTService = {
    signIn,
    verify
}
