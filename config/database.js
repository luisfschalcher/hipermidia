import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { verbose } = sqlite3;
const db = verbose();
const dbPath = path.join(__dirname, '..', 'database.sqlite');

const database = new db.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite');
    initDatabase().catch(err => console.error('Erro ao inicializar banco:', err));
  }
});
// a única mudança com relação ao arquivo fornecido está aqui, onde eu adaptei a tabela para conter os campos necessários
async function initDatabase() {
  return new Promise((resolve, reject) => {
    database.run(`
      CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        mentor TEXT NOT NULL,
        tema TEXT NOT NULL,
        bioCurta TEXT,
        slotsDisponiveis INTEGER DEFAULT 0,
        valorSessao REAL DEFAULT 0,
        linkAgenda TEXT
      )
    `, (err) => {
      if (err) {
        console.error('Erro ao criar tabela:', err.message);
        reject(err);
      } else {
        console.log('Tabela posts criada/verificada com sucesso');
        resolve();
      }
    });
  });
}

export default database;