
            // Sidebar toggle logic
            const sidebar = document.getElementById('sidebar');
            const toggleBtn = document.getElementById('toggleSidebar');
            const returnBtn = document.getElementById('returnSidebar');
            function updateBarsMargin() {
                const bars = document.querySelectorAll('.top-actions-bar, .search-footer-bar, .bottom-menu-bar, .produtos-board, #estoque-funcional');
                bars.forEach(bar => {
                    if (sidebar.classList.contains('minimized')) {
                        bar.style.marginLeft = '72px';
                    } else {
                        bar.style.marginLeft = '250px';
                    }
                });
            }
            if (toggleBtn && returnBtn && sidebar) {
                toggleBtn.addEventListener('click', () => {
                    sidebar.classList.add('minimized');
                    updateBarsMargin();
                });
                returnBtn.addEventListener('click', () => {
                    sidebar.classList.remove('minimized');
                    updateBarsMargin();
                });
            }
            updateBarsMargin();

            // --------- Funcionalidades de Estoque ---------
            // Persistência localStorage
            let produtos = [];
            if (localStorage.getItem('produtos')) {
                try {
                    produtos = JSON.parse(localStorage.getItem('produtos'));
                } catch {
                    produtos = [];
                }
            } else {
                produtos = [
                    {
                        id: 1,
                        nome: "Cheeseburger Clássico",
                        quantidade: 20,
                        quantidadeMinima: 10,
                        validade: "2025-07-09",
                        historico: [
                            { tipo: "entrada", quantidade: 10, data: "2024-07-09", origem: "compra" },
                            { tipo: "saida", quantidade: 5, data: "2024-06-18", origem: "venda" }
                        ]
                    },
                    {
                        id: 2,
                        nome: "Batata Frita",
                        quantidade: 50,
                        quantidadeMinima: 15,
                        validade: "2025-10-25",
                        historico: [
                            { tipo: "entrada", quantidade: 30, data: "2024-06-10", origem: "compra" },
                            { tipo: "saida", quantidade: 10, data: "2024-06-18", origem: "venda" }
                        ]
                    },
                    {
                        id: 3,
                        nome: "Coca Cola Lata",
                        quantidade: 100,
                        quantidadeMinima: 40,
                        validade: "2026-10-31",
                        historico: [
                            { tipo: "entrada", quantidade: 50, data: "2024-06-10", origem: "compra" },
                            { tipo: "saida", quantidade: 10, data: "2024-06-18", origem: "venda" }
                        ]
                    },
                    {
                        id: 4,
                        nome: "Pão",
                        quantidade: 38,
                        quantidadeMinima: 40,
                        validade: "2025-07-03",
                        historico: [
                            { tipo: "entrada", quantidade: 50, data: "2024-06-10", origem: "compra" },
                            { tipo: "saida", quantidade: 10, data: "2024-06-18", origem: "venda" }
                        ]
                    }
                ];
            }

            // IDs dos alertas fechados
            let alertasFechados = [];

            // Toast feedback
            function showToast(msg, type = "success") {
                const toastEl = document.getElementById('toastFeedback');
                const toastMsg = document.getElementById('toastFeedbackMsg');
                toastMsg.innerHTML = msg;
                toastEl.className = `toast align-items-center text-bg-${type} border-0`;
                const toast = new bootstrap.Toast(toastEl);
                toast.show();
            }

            // Função para verificar alertas de vencimento e excesso de estoque (VISUAL)
            function verificarAlertas() {
                const hoje = new Date();
                let alertasHtml = '';
                produtos.forEach(produto => {
                    const validade = new Date(produto.validade);
                    const diasParaVencer = (validade - hoje) / (1000 * 60 * 60 * 24);

                    // Alerta de vencimento
                    if (diasParaVencer <= 5 && !alertasFechados.includes('venc_' + produto.id)) {
                        alertasHtml += `
                        <div class="alert alert-warning d-flex align-items-center justify-content-between py-2 mb-2 w-100" role="alert" style="font-size:1rem; max-width:700px;">
                            <div>
                                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                                <strong>${produto.nome}:</strong> vence em ${Math.ceil(diasParaVencer)} dia(s)!
                            </div>
                            <button type="button" class="btn-close ms-2" aria-label="Fechar" onclick="fecharAlerta('venc_${produto.id}')"></button>
                        </div>
                    `;
                    }
                    // Alerta de excesso
                    if (produto.quantidade > produto.quantidadeMinima * 3 && !alertasFechados.includes('exc_' + produto.id)) {
                        alertasHtml += `
                        <div class="alert alert-info d-flex align-items-center justify-content-between py-2 mb-2 w-100" role="alert" style="font-size:1rem; max-width:700px;">
                            <div>
                                <i class="bi bi-arrow-up-circle-fill me-2"></i>
                                <strong>${produto.nome}:</strong> está com excesso de estoque!
                            </div>
                            <button type="button" class="btn-close ms-2" aria-label="Fechar" onclick="fecharAlerta('exc_${produto.id}')"></button>
                        </div>
                    `;
                    }
                });
                document.getElementById('insumos-alertas').innerHTML = alertasHtml;
            }

            // Função para fechar alerta
            function fecharAlerta(alertaId) {
                alertasFechados.push(alertaId);
                verificarAlertas();
            }

            // Função para registrar movimentação (entrada/saída)
            function registrarMovimentacao(id, tipo, quantidade, origem = "manual") {
                const produto = produtos.find(p => p.id === id);
                if (!produto) return;
                if (tipo === "entrada") {
                    produto.quantidade += quantidade;
                } else if (tipo === "saida") {
                    produto.quantidade -= quantidade;
                }
                produto.historico.push({
                    tipo,
                    quantidade,
                    data: new Date().toISOString().slice(0, 10),
                    origem
                });
                salvarProdutos();
            }

            // Função para gerar relatório de movimentação
            function gerarRelatorioMovimentacao(id) {
                const produto = produtos.find(p => p.id === id);
                if (!produto) return [];
                return produto.historico;
            }

            // Renderiza a lista de insumos e controles de entrada/saída
            function renderInsumos() {
                const tbody = document.getElementById('insumos-lista');
                tbody.innerHTML = '';
                produtos.forEach(produto => {
                    // Verifica alertas
                    let alerta = '';
                    const hoje = new Date();
                    const validade = new Date(produto.validade);
                    const diasParaVencer = (validade - hoje) / (1000 * 60 * 60 * 24);
                    if (diasParaVencer <= 5) {
                        alerta += `<span class="badge bg-warning text-dark">Vence em ${Math.ceil(diasParaVencer)}d</span> `;
                    }
                    if (produto.quantidade <= produto.quantidadeMinima) {
                        alerta += `<span class="badge bg-danger">Estoque Mínimo</span> `;
                    }
                    if (produto.quantidade > produto.quantidadeMinima * 3) {
                        alerta += `<span class="badge bg-info text-dark">Excesso</span>`;
                    }

                    tbody.innerHTML += `
                <tr id="row_${produto.id}">
                    <td>${produto.nome}</td>
                    <td>${produto.quantidade}</td>
                    <td>${produto.quantidadeMinima}</td>
                    <td>${produto.validade}</td>
                    <td>
                        <input type="number" min="1" style="width:60px" id="ent_${produto.id}" aria-label="Entrada de ${produto.nome}">
                        <button class="btn btn-success btn-sm" onclick="entradaProduto(${produto.id})" aria-label="Adicionar entrada"><i class="bi bi-plus"></i></button>
                    </td>
                    <td>
                        <input type="number" min="1" style="width:60px" id="sai_${produto.id}" aria-label="Saída de ${produto.nome}">
                        <button class="btn btn-danger btn-sm" onclick="saidaProduto(${produto.id})" aria-label="Registrar saída"><i class="bi bi-dash"></i></button>
                    </td>
                    <td>${alerta}</td>
                    <td>
                        <button class="btn btn-secondary btn-sm" onclick="mostrarHistorico(${produto.id})" aria-label="Ver histórico"><i class="bi bi-clock-history"></i> Ver</button>
                    </td>
                </tr>
                `;
                });
            }

            // Função para entrada de produto
            function entradaProduto(id) {
                const input = document.getElementById('ent_' + id);
                const qtd = parseInt(input.value);
                if (qtd > 0) {
                    registrarMovimentacao(id, "entrada", qtd, "manual");
                    verificarAlertas();
                    renderInsumos();
                    input.value = '';
                    highlightRow(id);
                    showToast("Entrada registrada com sucesso!", "success");
                } else {
                    showToast("Informe uma quantidade válida para entrada.", "danger");
                }
            }

            // Função para saída de produto
            function saidaProduto(id) {
                const input = document.getElementById('sai_' + id);
                const qtd = parseInt(input.value);
                if (qtd > 0) {
                    registrarMovimentacao(id, "saida", qtd, "manual");
                    verificarAlertas();
                    renderInsumos();
                    input.value = '';
                    highlightRow(id);
                    showToast("Saída registrada com sucesso!", "success");
                } else {
                    showToast("Informe uma quantidade válida para saída.", "danger");
                }
            }

            // Mostra histórico em modal
            function mostrarHistorico(id) {
                const hist = gerarRelatorioMovimentacao(id);
                const conteudo = document.getElementById('historicoConteudo');
                if (!hist.length) {
                    conteudo.innerHTML = "<p>Sem histórico.</p>";
                } else {
                    conteudo.innerHTML = "<ul class='list-group'>" + hist.map(h =>
                        `<li class="list-group-item bg-dark text-light">${h.data} - <b>${h.tipo.toUpperCase()}</b> - ${h.quantidade} (${h.origem})</li>`
                    ).join('') + "</ul>";
                }
                new bootstrap.Modal(document.getElementById('modalHistorico')).show();
            }

            // Adicionar/remover insumo com validação e feedback
            function adicionarInsumo() {
                const nome = document.getElementById('novoInsumoNome').value.trim();
                const quantidade = parseInt(document.getElementById('novoInsumoQtd').value);
                const quantidadeMinima = parseInt(document.getElementById('novoInsumoQtdMin').value);
                const validade = document.getElementById('novoInsumoValidade').value;
                const feedback = document.getElementById('form-feedback');
                feedback.innerHTML = '';

                if (!nome) {
                    feedback.innerHTML = `<div class="alert alert-danger py-1 my-1">Digite o nome do insumo.</div>`;
                    showToast("Digite o nome do insumo.", "danger");
                    return;
                }
                if (isNaN(quantidade) || quantidade < 0 || isNaN(quantidadeMinima) || quantidadeMinima < 0 || !validade) {
                    feedback.innerHTML = `<div class="alert alert-danger py-1 my-1">Preencha todos os campos corretamente.</div>`;
                    showToast("Preencha todos os campos corretamente.", "danger");
                    return;
                }
                if (produtos.some(p => p.nome.toLowerCase() === nome.toLowerCase())) {
                    feedback.innerHTML = `<div class="alert alert-warning py-1 my-1">Já existe um insumo com esse nome.</div>`;
                    showToast("Já existe um insumo com esse nome.", "warning");
                    return;
                }
                // Gera novo ID
                const novoId = produtos.length ? Math.max(...produtos.map(p => p.id)) + 1 : 1;
                produtos.push({
                    id: novoId,
                    nome,
                    quantidade,
                    quantidadeMinima,
                    validade,
                    historico: []
                });
                salvarProdutos();
                document.getElementById('form-insumo').reset();
                feedback.innerHTML = `<div class="alert alert-success py-1 my-1">Insumo adicionado com sucesso!</div>`;
                showToast("Insumo adicionado com sucesso!", "success");
                verificarAlertas();
                renderInsumos();
                document.getElementById('novoInsumoNome').focus();
            }

            function removerInsumo() {
                const nome = document.getElementById('novoInsumoNome').value.trim().toLowerCase();
                const feedback = document.getElementById('form-feedback');
                feedback.innerHTML = '';
                if (!nome) {
                    feedback.innerHTML = `<div class="alert alert-danger py-1 my-1">Digite o nome do insumo para remover.</div>`;
                    showToast("Digite o nome do insumo para remover.", "danger");
                    return;
                }
                const idx = produtos.findIndex(p => p.nome.toLowerCase() === nome);
                if (idx === -1) {
                    feedback.innerHTML = `<div class="alert alert-warning py-1 my-1">Insumo não encontrado.</div>`;
                    showToast("Insumo não encontrado.", "warning");
                    return;
                }
                produtos.splice(idx, 1);
                salvarProdutos();
                document.getElementById('form-insumo').reset();
                feedback.innerHTML = `<div class="alert alert-success py-1 my-1">Insumo removido com sucesso!</div>`;
                showToast("Insumo removido com sucesso!", "success");
                verificarAlertas();
                renderInsumos();
                document.getElementById('novoInsumoNome').focus();
            }

            // Persistência dos dados
            function salvarProdutos() {
                localStorage.setItem('produtos', JSON.stringify(produtos));
            }

            // Feedback visual ao atualizar linha
            function highlightRow(id) {
                const row = document.getElementById('row_' + id);
                if (row) {
                    row.classList.add('table-success');
                    setTimeout(() => row.classList.remove('table-success'), 700);
                }
            }

            // UX: Foco automático no próximo campo ao pressionar Enter
            document.querySelectorAll('#form-insumo input').forEach((input, idx, arr) => {
                input.addEventListener('keydown', function (e) {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        if (idx < arr.length - 1) {
                            arr[idx + 1].focus();
                        } else {
                            document.querySelector('#form-insumo button.btn-success').focus();
                        }
                    }
                });
            });

            // Acessibilidade: aria-label já adicionado nos botões/inputs

            // Atualiza a lista ao carregar
            window.addEventListener('DOMContentLoaded', () => {
                verificarAlertas();
                renderInsumos();
            });