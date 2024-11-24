import { genSalt, hash, compare } from 'bcrypt';


const SALT_RANDOMS = 8;

const hashPassword = async (password) => {
  const saltGenerated = await genSalt(SALT_RANDOMS);

  return await hash(password, saltGenerated);
};

const verifyPassword = async (password, hashedPassword) => {
  return await compare(password, hashedPassword);
};


export const PasswordCrypto = {
  hashPassword,
  verifyPassword,
};