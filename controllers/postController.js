import * as PostService from '../services/postService.js';

export const createPost = async (req, res) => {
  try {
    console.log('POST /mentorias body:', req.body);

    const {
      mentor,
      tema,
      bioCurta,
      slotsDisponiveis,
      valorSessao,
      linkAgenda
    } = req.body;

    if (
      mentor == null || String(mentor).trim() === '' ||
      tema == null || String(tema).trim() === '' ||
      bioCurta == null || String(bioCurta).trim() === '' ||
      slotsDisponiveis == null || slotsDisponiveis === '' ||
      valorSessao == null || valorSessao === '' ||
      linkAgenda == null || String(linkAgenda).trim() === ''
    ) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

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
    console.error('Erro ao criar mentoria:', error);
    res.status(500).json({ error: 'Erro ao criar mentoria.', details: error.message });
  }
};

export const getAllPosts = async (req, res) => {
    try {
        const posts = await PostService.getAllPosts();
        res.status(200).json(posts);
    } catch (error) {
        console.error('Erro ao listar mentorias:', error.message);
        res.status(500).json({ error: 'Erro ao listar mentorias.' });
    }
};

export const getPostById = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await PostService.getPostById(id);

        if (!post) return res.status(404).json({ error: 'Mentoria não encontrada.' });

        res.status(200).json(post);

    } catch (error) {
        console.error('Erro ao buscar mentoria:', error.message);
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

        if (!updated) return res.status(404).json({ error: 'Mentoria não encontrada.' });

        res.status(200).json(updated);

    } catch (error) {
        console.error('Erro ao atualizar mentoria:', error.message);
        res.status(500).json({ error: 'Erro ao atualizar mentoria.' });
    }
};

export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await PostService.deletePost(id);

        if (!deleted) return res.status(404).json({ error: 'Mentoria não encontrada.' });

        res.status(204).send();

    } catch (error) {
        console.error('Erro ao deletar mentoria:', error.message);
        res.status(500).json({ error: 'Erro ao deletar mentoria.' });
    }
};