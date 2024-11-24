

import bcrypt from 'bcrypt';

let senha = "030904";

//string aleatória que torna o hash imprevisível
const salt = bcrypt.genSaltSync(10)

console.log('Salt: ',salt);


const passwordEncripted = bcrypt.hashSync(senha, salt);
console.log(passwordEncripted);

const isValidPassword = await bcrypt.compare("030904", passwordEncripted)

console.log(isValidPassword);

