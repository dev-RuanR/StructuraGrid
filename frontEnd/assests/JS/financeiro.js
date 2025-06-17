// Sidebar toggle
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggleSidebar');
const returnBtn = document.getElementById('returnSidebar');
const topMenuWrapper = document.querySelector('.top-menu-wrapper');
toggleBtn.addEventListener('click', () => {
  sidebar.classList.add('minimized');
  topMenuWrapper.style.marginLeft = "72px";
});
returnBtn.addEventListener('click', () => {
  sidebar.classList.remove('minimized');
  topMenuWrapper.style.marginLeft = "250px";
});

// Exibe o modal ao clicar em Formas de Pagamento
document.getElementById('formasPagamentoBtn').onclick = function() {
  document.getElementById('formasPagamentoModal').style.display = 'flex';
  renderFormasPagamento();
};

// Tabs do modal estilo Consumer
document.querySelectorAll('#formasPagamentoModal .tab-list button').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('#formasPagamentoModal .tab-list button').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('#formasPagamentoModal .tab-pane').forEach(tab => tab.classList.remove('active'));
    this.classList.add('active');
    document.getElementById(this.getAttribute('data-tab')).classList.add('active');
  });
});

// Fecha modal ao pressionar ESC
document.addEventListener('keydown', function(e) {
  if (e.key === "Escape") {
    document.getElementById('formasPagamentoModal').style.display = 'none';
    document.getElementById('modalAddForma').style.display = 'none';
  }
});

// --- FUNCIONALIDADE FORMAS DE PAGAMENTO ---
let formasPagamento = [
  "Dinheiro", "Cheque", "Cartão de Crédito", "Cartão de Débito", "Vale Alimentação", "Vale Refeição",
  "Vale Presente", "Boleto Bancário", "Transferência Bancária", "Depósito Bancário", "PIX",
  "Carteira Digital", "PagSeguro", "Mercado Pago", "PicPay", "iFood", "Voucher", "Crédito Loja", "Fiado", "Outros", "Desconto"
];
let formasSelecionadas = [0]; // índice dos selecionados
let editIndex = null;

function renderFormasPagamento() {
  const tbody = document.querySelector("#formasTable tbody");
  tbody.innerHTML = "";
  formasPagamento.forEach((forma, idx) => {
    const tr = document.createElement("tr");
    if (formasSelecionadas.includes(idx)) tr.classList.add("selected");
    tr.innerHTML = `
      <td><input type="checkbox" ${formasSelecionadas.includes(idx) ? "checked" : ""} data-idx="${idx}"></td>
      <td class="${formasSelecionadas.includes(idx) ? "text-blue" : ""}">${forma}</td>
    `;
    tbody.appendChild(tr);
  });
  // Checkbox click
  tbody.querySelectorAll('input[type="checkbox"]').forEach(chk => {
    chk.onclick = function() {
      const idx = Number(this.getAttribute("data-idx"));
      if (this.checked) {
        if (!formasSelecionadas.includes(idx)) formasSelecionadas.push(idx);
      } else {
        formasSelecionadas = formasSelecionadas.filter(i => i !== idx);
      }
      renderFormasPagamento();
    };
  });
  // Row click for edit
  tbody.querySelectorAll('tr').forEach((tr, idx) => {
    tr.onclick = function(e) {
      if (e.target.tagName !== "INPUT") {
        tbody.querySelectorAll('tr').forEach(row => row.classList.remove('selected'));
        tr.classList.add('selected');
        editIndex = idx;
      }
    };
  });
}

// Modal Add Forma
const modalAddForma = document.getElementById("modalAddForma");
const inputAddForma = document.getElementById("inputAddForma");
const formAddForma = document.getElementById("formAddForma");
document.getElementById("btnAddForma").onclick = function(e) {
  e.preventDefault();
  inputAddForma.value = "";
  modalAddForma.style.display = "flex";
  setTimeout(() => inputAddForma.focus(), 100);
  // Restaura submit padrão para adicionar
  formAddForma.onsubmit = defaultAddFormaSubmit;
};
document.getElementById("closeAddForma").onclick = function() {
  modalAddForma.style.display = "none";
};
document.getElementById("cancelAddForma").onclick = function() {
  modalAddForma.style.display = "none";
};
modalAddForma.onclick = function(e) {
  if (e.target === modalAddForma) modalAddForma.style.display = "none";
};
formAddForma.onsubmit = defaultAddFormaSubmit;
function defaultAddFormaSubmit(e) {
  e.preventDefault();
  let nome = inputAddForma.value.trim();
  if (nome) {
    formasPagamento.push(nome);
    renderFormasPagamento();
    modalAddForma.style.display = "none";
  } else {
    inputAddForma.focus();
  }
}

// Editar forma selecionada
document.getElementById("btnEditForma").onclick = function(e) {
  e.preventDefault();
  const tbody = document.querySelector("#formasTable tbody");
  let idx = Array.from(tbody.querySelectorAll('tr')).findIndex(tr => tr.classList.contains('selected'));
  if (idx === -1) {
    alert("Selecione uma forma para editar.");
    return;
  }
  let nomeAtual = formasPagamento[idx];
  inputAddForma.value = nomeAtual;
  modalAddForma.style.display = "flex";
  setTimeout(() => inputAddForma.focus(), 100);
  formAddForma.onsubmit = function(ev) {
    ev.preventDefault();
    let novoNome = inputAddForma.value.trim();
    if (novoNome) {
      formasPagamento[idx] = novoNome;
      renderFormasPagamento();
      modalAddForma.style.display = "none";
      // Restaura submit padrão para adicionar
      formAddForma.onsubmit = defaultAddFormaSubmit;
    } else {
      inputAddForma.focus();
    }
  };
};

// Excluir forma selecionada
document.getElementById("btnDeleteForma").onclick = function(e) {
  e.preventDefault();
  const tbody = document.querySelector("#formasTable tbody");
  let idx = Array.from(tbody.querySelectorAll('tr')).findIndex(tr => tr.classList.contains('selected'));
  if (idx === -1) {
    alert("Selecione uma forma para excluir.");
    return;
  }
  if (confirm("Deseja realmente excluir esta forma de pagamento?")) {
    formasPagamento.splice(idx, 1);
    formasSelecionadas = formasSelecionadas.filter(i => i !== idx).map(i => i > idx ? i - 1 : i);
    renderFormasPagamento();
  }
};

// Inicializa tabela ao abrir modal
renderFormasPagamento();