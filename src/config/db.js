import { createPool } from 'mysql2/promise';

let pool = null;

/**
 * Cria um pool de conexões com o MySQL limitando a qantidade de conexões que podem ser criadas
 * @returns 
 */
async function criarPoolDeConexoes() {
    if (!pool) {
        pool = createPool({
            host: process.env.HOST,
            port: process.env.PORT_MYSQL,
            database: process.env.DATABASE,
            user: process.env.USER,
            password: process.env.PASSWORD,
            waitForConnections: true, // Aguarda conexões se não houver disponíveis no momento
            connectionLimit: 10, // Limite máximo de conexões no pool
            multipleStatements: true // Permitir a execução de várias queries ao mesmo tempo
        });
        // console.log("Pool de conexões criado.");
    }
    return pool;
}

async function sqlExecute(conn, ...queries) {
    try {
        await conn.beginTransaction();

        const results = [];
        let insertId;
        // Realiza o for no array de queries que é recebido
        for (let i = 0; i < queries.length; i++) {
            let { pSql, pValues } = queries[i];
            // console.log(pSql, pValues);

            // Substitui o ID retornado do primeiro insert, se necessário
            // Lembrando que essa funcionalidade só será executada após o primeiro insert ter sido realizado
            if (i > 0 && insertId) {
                pValues = pValues.map(value => value === 'insertId' ? insertId : value);
            }

            // Executa a query
            const [result] = await conn.query(pSql, pValues);
            results.push(result);

            // Captura o insertId do primeiro resultado (ou qualquer outro que for relevante)
            if (i === 0) {
                insertId = result.insertId;
            }
        }

        await conn.commit();
        return results;
    } catch (error) {
        await conn.rollback();
        throw error;
    } finally {
        await conn.release();
    }
};


async function obterConexaoDoPool() {
    const pool = await criarPoolDeConexoes();
    return pool.getConnection();
};

export { obterConexaoDoPool, sqlExecute };
