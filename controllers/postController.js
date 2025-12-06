import * as PostService from '../services/postService.js';

export const createPost = async (req, res) => { // em relação ao arquivo fornecido, os campos obviamente diferem, vou evitar comentar isso quando essa for a única mudança
  try {
    const {
      mentor,
      tema,
      bioCurta,
      slotsDisponiveis,
      valorSessao,
      linkAgenda
    } = req.body;

    if ( // aqui foi apenas uma mudança na forma de escrever pq eu acho melhor msm
      mentor == null || String(mentor).trim() === '' ||
      tema == null || String(tema).trim() === '' ||
      bioCurta == null || String(bioCurta).trim() === '' ||
      slotsDisponiveis == null || slotsDisponiveis === '' ||
      valorSessao == null || valorSessao === '' ||
      linkAgenda == null || String(linkAgenda).trim() === ''
    ) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }
    // garantir que slots e valor são numéricos
    const slotsNum = Number(slotsDisponiveis);
    const valorNum = Number(valorSessao);

    if (!Number.isFinite(slotsNum) || !Number.isFinite(valorNum)) {
      return res.status(400).json({ error: 'Slots e valor devem ser números válidos.' });
    }

    const newPost = await PostService.createPost(
      String(mentor).trim(),
      String(tema).trim(),
      String(bioCurta).trim(),
      slotsNum,
      valorNum,
      String(linkAgenda).trim()
    );

    res.status(201).json(newPost);

  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar mentoria.', details: error.message });
  }
};

export const getAllPosts = async (req, res) => {
    try {
        const posts = await PostService.getAllPosts();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao listar mentorias.' });
    }
};

export const getPostById = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await PostService.getPostById(id);

        if (!post) {
          return res.status(404).json({ error: 'Mentoria não encontrada.' });
        }

        res.status(200).json(post);

    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar mentoria.' });
    }
};

export const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            mentor,
            tema,
            bioCurta,
            slotsDisponiveis,
            valorSessao,
            linkAgenda
        } = req.body;

        const updated = await PostService.updatePost(
            id,
            mentor,
            tema,
            bioCurta,
            slotsDisponiveis,
            valorSessao,
            linkAgenda
        );

        if (!updated) {
          return res.status(404).json({ error: 'Mentoria não encontrada.' });
        }

        res.status(200).json(updated);

    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar mentoria.' });
    }
};

export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await PostService.deletePost(id);

        if (!deleted) {
          return res.status(404).json({ error: 'Mentoria não encontrada.' });
        }

        res.status(204).send();

    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar mentoria.' });
    }
};