        // Sidebar toggle logic
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('mainContent');
        document.getElementById('toggleSidebar').onclick = function () {
            sidebar.classList.add('collapsed');
            mainContent.classList.add('collapsed');
        };
        document.getElementById('returnSidebar').onclick = function () {
            sidebar.classList.remove('collapsed');
            mainContent.classList.remove('collapsed');
        };

        // Mock de dados
        const dadosEstoque = [
            { produto: "Pão de Hambúrguer", quantidade: 120, unidade: "un", atualizado: "2024-06-18" },
            { produto: "Carne 150g", quantidade: 60, unidade: "un", atualizado: "2024-06-18" },
            { produto: "Queijo Cheddar", quantidade: 30, unidade: "fatias", atualizado: "2024-06-18" },
            { produto: "Bacon", quantidade: 20, unidade: "fatias", atualizado: "2024-06-18" }
        ];
        const dadosVendas = [
            { data: "2024-06-17", produto: "Hambúrguer Clássico", quantidade: 15, valor: 180.00 },
            { data: "2024-06-17", produto: "Cheeseburger", quantidade: 10, valor: 120.00 },
            { data: "2024-06-18", produto: "Bacon Burger", quantidade: 8, valor: 112.00 },
            { data: "2024-06-18", produto: "Combo Família", quantidade: 3, valor: 149.70 }
        ];
        const dadosFinanceiro = [
            { data: "2024-06-17", tipo: "Entrada", descricao: "Venda balcão", valor: 200.00 },
            { data: "2024-06-17", tipo: "Saída", descricao: "Compra de ingredientes", valor: 80.00 },
            { data: "2024-06-18", tipo: "Entrada", descricao: "iFood", valor: 150.00 },
            { data: "2024-06-18", tipo: "Saída", descricao: "Pagamento funcionário", valor: 100.00 }
        ];

        const registrosPorPagina = 10;
        let paginaAtual = 1;
        let tipoAtual = "estoque";
        let dadosFiltrados = [];

        function renderTabela() {
            const head = document.getElementById('relatorioHead');
            const tbody = document.getElementById('relatorioBody');
            tbody.innerHTML = '';
            head.innerHTML = '';
            let dados = [];
            if (tipoAtual === "estoque") {
                head.innerHTML = `
          <tr>
            <th>Produto</th>
            <th>Quantidade</th>
            <th>Unidade</th>
            <th>Atualizado em</th>
          </tr>
        `;
                dados = dadosFiltrados.length ? dadosFiltrados : dadosEstoque;
                dados.slice((paginaAtual - 1) * registrosPorPagina, paginaAtual * registrosPorPagina).forEach(r => {
                    tbody.innerHTML += `
            <tr>
              <td>${r.produto}</td>
              <td>${r.quantidade}</td>
              <td>${r.unidade}</td>
              <td>${r.atualizado.split('-').reverse().join('/')}</td>
            </tr>
          `;
                });
            } else if (tipoAtual === "vendas") {
                head.innerHTML = `
          <tr>
            <th>Data</th>
            <th>Produto</th>
            <th>Quantidade Vendida</th>
            <th>Valor Total (R$)</th>
          </tr>
        `;
                dados = dadosFiltrados.length ? dadosFiltrados : dadosVendas;
                dados.slice((paginaAtual - 1) * registrosPorPagina, paginaAtual * registrosPorPagina).forEach(r => {
                    tbody.innerHTML += `
            <tr>
              <td>${r.data.split('-').reverse().join('/')}</td>
              <td>${r.produto}</td>
              <td>${r.quantidade}</td>
              <td>${r.valor.toFixed(2)}</td>
            </tr>
          `;
                });
            } else if (tipoAtual === "financeiro") {
                head.innerHTML = `
          <tr>
            <th>Data</th>
            <th>Tipo</th>
            <th>Descrição</th>
            <th>Valor (R$)</th>
          </tr>
        `;
                dados = dadosFiltrados.length ? dadosFiltrados : dadosFinanceiro;
                dados.slice((paginaAtual - 1) * registrosPorPagina, paginaAtual * registrosPorPagina).forEach(r => {
                    tbody.innerHTML += `
            <tr>
              <td>${r.data.split('-').reverse().join('/')}</td>
              <td>${r.tipo}</td>
              <td>${r.descricao}</td>
              <td class="${r.tipo === 'Saída' ? 'text-danger' : 'text-success'}">${r.tipo === 'Saída' ? '-' : ''}R$ ${r.valor.toFixed(2)}</td>
            </tr>
          `;
                });
            }
            if (tbody.innerHTML === '') {
                tbody.innerHTML = `<tr><td colspan="10" class="text-center text-secondary">Nenhum registro encontrado.</td></tr>`;
            }
        }

        function renderPaginacao() {
            const paginacao = document.getElementById('paginacao');
            paginacao.innerHTML = '';
            let total = 0;
            if (tipoAtual === "estoque") total = (dadosFiltrados.length ? dadosFiltrados : dadosEstoque).length;
            if (tipoAtual === "vendas") total = (dadosFiltrados.length ? dadosFiltrados : dadosVendas).length;
            if (tipoAtual === "financeiro") total = (dadosFiltrados.length ? dadosFiltrados : dadosFinanceiro).length;
            const totalPaginas = Math.ceil(total / registrosPorPagina);
            if (totalPaginas <= 1) return;
            for (let i = 1; i <= totalPaginas; i++) {
                paginacao.innerHTML += `
          <li class="page-item ${i === paginaAtual ? 'active' : ''}">
            <button class="page-link" onclick="irParaPagina(${i})">${i}</button>
          </li>
        `;
            }
        }

        function irParaPagina(pagina) {
            paginaAtual = pagina;
            renderTabela();
            renderPaginacao();
        }

        function limparFiltros() {
            document.getElementById('filtroForm').reset();
            dadosFiltrados = [];
            paginaAtual = 1;
            tipoAtual = "estoque";
            document.getElementById('tipoRelatorio').value = "estoque";
            renderTabela();
            renderPaginacao();
        }

        document.getElementById('tipoRelatorio').addEventListener('change', function () {
            tipoAtual = this.value;
            dadosFiltrados = [];
            paginaAtual = 1;
            renderTabela();
            renderPaginacao();
        });

        document.getElementById('filtroForm').addEventListener('submit', function (e) {
            e.preventDefault();
            const dataInicial = document.getElementById('dataInicial').value;
            const dataFinal = document.getElementById('dataFinal').value;
            dadosFiltrados = [];
            if (tipoAtual === "estoque") {
                dadosFiltrados = dadosEstoque.filter(r => {
                    if (dataInicial && r.atualizado < dataInicial) return false;
                    if (dataFinal && r.atualizado > dataFinal) return false;
                    return true;
                });
            } else if (tipoAtual === "vendas") {
                dadosFiltrados = dadosVendas.filter(r => {
                    if (dataInicial && r.data < dataInicial) return false;
                    if (dataFinal && r.data > dataFinal) return false;
                    return true;
                });
            } else if (tipoAtual === "financeiro") {
                dadosFiltrados = dadosFinanceiro.filter(r => {
                    if (dataInicial && r.data < dataInicial) return false;
                    if (dataFinal && r.data > dataFinal) return false;
                    return true;
                });
            }
            paginaAtual = 1;
            renderTabela();
            renderPaginacao();
        });

        // Inicialização
        renderTabela();
        renderPaginacao();

        // Expor função para paginação
        window.irParaPagina = irParaPagina;
        window.limparFiltros = limparFiltros;
