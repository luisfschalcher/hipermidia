document.addEventListener('DOMContentLoaded', () => {

    const API_BASE = 'http://localhost:4000/mentorias';

    let mentores = [];

    const listaEl = document.getElementById('listaMentores');
    const temaInput = document.getElementById('tema');
    const valorInput = document.getElementById('valor');
    const listaTemasEl = document.getElementById('listaTemas');

    async function carregarMentores() {
        try {
            console.log('GET', API_BASE);
            const response = await fetch(API_BASE);
            if (!response.ok) throw new Error("Erro ao carregar API: " + response.status);

            const data = await response.json();
            mentores = Array.isArray(data) ? data : (data.posts || []);

            preencherTemas(mentores);
            render(mentores);

        } catch (err) {
            console.error("Erro ao buscar mentorias:", err);
            listaEl.innerHTML = `<div class="vazio">Erro ao carregar mentorias.</div>`;
        }
    }

    function preencherTemas(lista) {
        listaTemasEl.innerHTML = '';

        const temasUnicos = [...new Set(lista.map(m => m.tema))].sort();

        temasUnicos.forEach(t => {
            const op = document.createElement('option');
            op.value = t;
            listaTemasEl.appendChild(op);
        });
    }

    function formatarValor(v) {
        return 'R$ ' + Number(v).toLocaleString('pt-br', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    function render(lista) {
        listaEl.innerHTML = '';

        lista.forEach(m => {
            const card = document.createElement('article');
            card.className = 'cardMentor';

            card.innerHTML = `
            <div class="cardTop">
                <div>
                    <div class="nomeMentor">${m.mentor}</div>
                    <div class="temaMentor">${m.tema}</div>
                </div>
                <div class="metaDir">
                    <div style="text-align:right; font-size:12px; color:#666">
                        Slots: <strong>${m.slotsDisponiveis}</strong>
                    </div>
                </div>
            </div>

            <div class="bio">${m.bioCurta || ''}</div>

            <div class="cardMeta">
                <div class="metaEsq">
                    <span class="valor">${formatarValor(m.valorSessao)}</span>
                </div>
                <div>
                    <a class="agendar" href="${m.linkAgenda}" target="_blank">Agendar</a>
                </div>
            </div>

            <div class="controls">
                <button class="btnEditar" data-id="${m.id}">Editar</button>
                <button class="btnExcluir" data-id="${m.id}">Excluir</button>
            </div>
        `;

            listaEl.appendChild(card);
        });

        document.querySelectorAll('.btnExcluir').forEach(btn => {
            btn.removeEventListener('click', excluirMentoria);
            btn.addEventListener('click', excluirMentoria);
        });

        document.querySelectorAll('.btnEditar').forEach(btn => {
            btn.removeEventListener('click', abrirEdicao);
            btn.addEventListener('click', abrirEdicao);
        });
    }


    function valorIn(str) {
        if (!str) return null;
        const only = String(str).replace(/[^\d.,-]/g, '').trim();
        if (!only) return null;
        const asDot = only.replace(',', '.');
        const n = Number(asDot);
        return Number.isNaN(n) ? null : n;
    }

    function aplicarFiltros() {
        const tema = temaInput.value.trim().toLowerCase();
        const valorMax = valorIn(valorInput.value);

        const filtrados = mentores.filter(m => {
            let okTema = true;
            let okValor = true;

            if (tema) {
                okTema = (m.tema || '').toLowerCase().includes(tema) ||
                    (m.mentor || '').toLowerCase().includes(tema);
            }

            if (valorMax !== null) {
                okValor = Number(m.valorSessao) <= valorMax;
            }

            return okTema && okValor;
        });

        render(filtrados);
    }

    temaInput.addEventListener('input', aplicarFiltros);
    valorInput.addEventListener('input', aplicarFiltros);

    temaInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            temaInput.value = '';
            aplicarFiltros();
        }
    });

    valorInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            valorInput.value = '';
            aplicarFiltros();
        }
    });

    carregarMentores();

    const formCriar = document.getElementById('formCriar');

    formCriar.addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = Object.fromEntries(new FormData(formCriar));
        console.log('Enviar POST para', API_BASE, 'payload:', data);

        try {
            const resp = await fetch(API_BASE, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const respText = await resp.text();
            let respBody;
            try { respBody = JSON.parse(respText); } catch { respBody = respText; }

            if (!resp.ok) {
                console.error('Erro create status:', resp.status, 'body:', respBody);
                alert(`Erro ao criar mentoria: ${resp.status}. Veja console para detalhes.`);
                return;
            }

            console.log('Criado:', respBody);
            formCriar.reset();
            carregarMentores();

        } catch (err) {
            alert("Erro ao criar mentoria. Veja o console para detalhes.");
            console.error('Fetch POST erro:', err);
        }
    });

    async function excluirMentoria(e) {
        const id = e.target.dataset.id;

        if (!confirm("Tem certeza que deseja excluir?")) return;

        try {
            const resp = await fetch(`${API_BASE}/${id}`, {
                method: "DELETE"
            });

            if (!resp.ok) {
                const t = await resp.text().catch(()=>'');
                console.error('Erro delete', resp.status, t);
                throw new Error('Erro ao deletar');
            }

            carregarMentores();

        } catch (err) {
            alert("Erro ao deletar mentoria.");
            console.error(err);
        }
    }

    const formEditar = document.getElementById('formEditar');
    const cancelarEdicao = document.getElementById('cancelarEdicao');

    function abrirEdicao(e) {
        const id = e.target.dataset.id;
        const m = mentores.find(x => x.id == id);

        if (!m) return;

        formEditar.style.display = 'block';

        formEditar.elements.id.value = m.id;
        formEditar.elements.mentor.value = m.mentor;
        formEditar.elements.tema.value = m.tema;
        formEditar.elements.bioCurta.value = m.bioCurta;
        formEditar.elements.slotsDisponiveis.value = m.slotsDisponiveis;
        formEditar.elements.valorSessao.value = m.valorSessao;
        formEditar.elements.linkAgenda.value = m.linkAgenda;
    }

    formEditar.addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = Object.fromEntries(new FormData(formEditar));
        const id = data.id;
        delete data.id;

        try {
            const resp = await fetch(`${API_BASE}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            if (!resp.ok) {
                const t = await resp.text().catch(()=>'');
                console.error('Erro edit', resp.status, t);
                throw new Error('Erro ao editar');
            }

            formEditar.style.display = 'none';
            carregarMentores();

        } catch (err) {
            alert("Erro ao editar mentoria.");
            console.error(err);
        }
    });

    cancelarEdicao.addEventListener('click', () => {
        formEditar.style.display = 'none';
    });

});