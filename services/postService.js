import db from '../config/database.js';

export const createPost = (mentor, tema, bioCurta, slotsDisponiveis, valorSessao, linkAgenda) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO posts (mentor, tema, bioCurta, slotsDisponiveis, valorSessao, linkAgenda)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const slots = Number(slotsDisponiveis);
    const valor = Number(valorSessao);

    db.run(query, [mentor, tema, bioCurta, slots, valor, linkAgenda], function (err) {
      if (err) {
        console.error('DB ERROR insert post:', err);
        reject(err);
      } else {
        resolve({
          id: this.lastID,
          mentor,
          tema,
          bioCurta,
          slotsDisponiveis: slots,
          valorSessao: valor,
          linkAgenda,
        });
      }
    });
  });
};

export const getAllPosts = () => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM posts`;
        db.all(query, [], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

export const getPostById = (id) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM posts WHERE id = ?`;
        db.get(query, [id], (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

export const updatePost = (id, mentor, tema, bioCurta, slotsDisponiveis, valorSessao, linkAgenda) => {
    return new Promise((resolve, reject) => {
        const query = `
            UPDATE posts
            SET mentor = ?, tema = ?, bioCurta = ?, slotsDisponiveis = ?, valorSessao = ?, linkAgenda = ?
            WHERE id = ?
        `;
        db.run(query, [mentor, tema, bioCurta, slotsDisponiveis, valorSessao, linkAgenda, id], function (err) {
            if (err) {
                reject(err);
            } else if (this.changes === 0) {
                resolve(null);
            } else {
                resolve({
                    id,
                    mentor,
                    tema,
                    bioCurta,
                    slotsDisponiveis,
                    valorSessao,
                    linkAgenda,
                });
            }
        });
    });
};

export const deletePost = (id) => {
    return new Promise((resolve, reject) => {
        const query = `DELETE FROM posts WHERE id = ?`;
        db.run(query, [id], function (err) {
            if (err) reject(err);
            else resolve(this.changes > 0);
        });
    });
};