document.addEventListener('DOMContentLoaded', () => {

    const mentores = [
        {
            "mentor": "Carla M.",
            "tema": "UX",
            "bioCurta": "10 anos em produto",
            "slotsDisponiveis": 5,
            "valorSessao": 250,
            "linkAgenda": "https://agenda.exemplo/carla"
        },
        {
            "mentor": "Ana P.",
            "tema": "Administração",
            "bioCurta": "MBA e experiência em startups",
            "slotsDisponiveis": 2,
            "valorSessao": 150,
            "linkAgenda": "https://agenda.exemplo/ana"
        },
        {
            "mentor": "Diego R.",
            "tema": "Arquitetura",
            "bioCurta": "Arquiteto de software senior",
            "slotsDisponiveis": 3,
            "valorSessao": 300,
            "linkAgenda": "https://agenda.exemplo/diego"
        },
        {
            "mentor": "Bruno S.",
            "tema": "Investimentos",
            "bioCurta": "Investidor anjo e mentor",
            "slotsDisponiveis": 1,
            "valorSessao": 200,
            "linkAgenda": "https://agenda.exemplo/bruno"
        }
    ];

    const temasUnicos = [...new Set(mentores.map(m => m.tema))].sort(); //não repetir os temas na hora de filtrar
    const lista = document.getElementById('listaTemas');
    temasUnicos.forEach(t => {
        const op = document.createElement('option');
        op.value = t;
        lista.appendChild(op);
    });

    const listaEl = document.getElementById('listaMentores');

    function formatarValor(v) {
        fmt = 'R$ ' + Number(v).toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        return fmt;
    }

    function render(lista) {
        listaEl.innerHTML = '';
        if (!lista.length) {
            const vazio = document.createElement('div');
            vazio.className = 'vazio';
            vazio.textContent = 'Nenhum mentor encontrado';
            listaEl.appendChild(vazio);
            return;
        }

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
            <div style="text-align:right; font-size:12px; color:#666">Slots: <strong>${m.slotsDisponiveis}</strong></div>
          </div>
        </div>

        <div class="bio">${m.bioCurta || ''}</div>

        <div class="cardMeta">
          <div class="metaEsq">
            <span>${formatarValor(m.valorSessao)}</span>
          </div>
          <div>
            <a class="agendar" href="${m.linkAgenda}" target="_blank" rel="noopener">Agendar</a>
          </div>
        </div>
      `;

            listaEl.appendChild(card);
        });
    }

    render(mentores);

    const temaInput = document.getElementById('tema');

    function aplicarFiltro() {
        const q = temaInput.value.trim().toLowerCase();
        if (!q) {
            render(mentores);
            return;
        }
        const filtrados = mentores.filter(m =>
            m.tema.toLowerCase().includes(q) ||
            m.mentor.toLowerCase().includes(q)
        );
        render(filtrados);
    }

    temaInput.addEventListener('input', aplicarFiltro);

    temaInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            temaInput.value = '';
            aplicarFiltro();
        }
    });
});