// Conteúdo dinâmico para o Kanban de Produtos
        // Exemplo de produtos por status, agora com imagem
        const produtos = [
            { nome: "Alabama Apimentado", categoria: "Lanches", preco: "R$ 20,00", status: "Ativo", img: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=facearea&w=128&q=80" },
            { nome: "Alabama Bacon Duplo", categoria: "Lanches", preco: "R$ 26,00", status: "Ativo", img: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=facearea&w=128&q=80" },
            { nome: "Alabama Clássico", categoria: "Lanches", preco: "R$ 15,00", status: "Ativo", img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=facearea&w=128&q=80" },
            { nome: "Alabama Filé", categoria: "Lanches", preco: "R$ 22,00", status: "Ativo", img: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=facearea&w=128&q=80" },
            { nome: "Alabama Kids", categoria: "Lanches", preco: "R$ 14,00", status: "Ativo", img: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=facearea&w=128&q=80" },
            { nome: "Batata Frita Tradicional", categoria: "Porções", preco: "R$ 15,00", status: "Ativo", img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=facearea&w=128&q=80" },
            { nome: "Batata C/ Cheddar e Bacon", categoria: "Porções", preco: "R$ 20,00", status: "Ativo", img: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=facearea&w=128&q=80" },
            { nome: "Alabama Vegano", categoria: "Lanches", preco: "R$ 25,00", status: "Ativo", img: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=facearea&w=128&q=80" },
            { nome: "Alabama Supremo", categoria: "Lanches", preco: "R$ 22,00", status: "Ativo", img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=facearea&w=128&q=80" },
            // Inativos
            { nome: "Combo Família", categoria: "Combos", preco: "R$ 49,90", status: "Inativo", img: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=facearea&w=128&q=80" },
            { nome: "Pizza Calabresa", categoria: "Pizzas", preco: "R$ 39,90", status: "Inativo", img: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=facearea&w=128&q=80" },
            { nome: "Pizza Portuguesa", categoria: "Pizzas", preco: "R$ 42,00", status: "Inativo", img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=facearea&w=128&q=80" },
            { nome: "Pizza Frango c/ Catupiry", categoria: "Pizzas", preco: "R$ 44,00", status: "Inativo", img: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=facearea&w=128&q=80" },
            { nome: "Coxinha de Frango", categoria: "Salgados", preco: "R$ 5,00", status: "Inativo", img: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=facearea&w=128&q=80" },
            { nome: "Pastel de Carne", categoria: "Salgados", preco: "R$ 6,00", status: "Inativo", img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=facearea&w=128&q=80" },
            { nome: "Suco Natural", categoria: "Bebidas", preco: "R$ 8,00", status: "Inativo", img: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=facearea&w=128&q=80" },
            { nome: "Água Mineral", categoria: "Bebidas", preco: "R$ 3,00", status: "Inativo", img: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=facearea&w=128&q=80" },
            { nome: "Brownie", categoria: "Doces", preco: "R$ 7,00", status: "Inativo", img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=facearea&w=128&q=80" }
        ];

        // Separar por status (simples: Ativo/Inativo)
        const colunas = [
            { titulo: "Ativos", status: "Ativo" },
            { titulo: "Inativos", status: "Inativo" }
        ];

        const kanbanBoard = document.getElementById('kanbanBoard');
        colunas.forEach(coluna => {
            const colDiv = document.createElement('div');
            colDiv.className = 'kanban-column';
            colDiv.innerHTML = `<h2>${coluna.titulo}</h2><div class="produtos-grid"></div>`;
            const grid = colDiv.querySelector('.produtos-grid');
            // Mostra até 9 produtos por coluna (3x3 grid)
            produtos.filter(p => p.status === coluna.status).slice(0, 9).forEach((produto, idx) => {
                const card = document.createElement('div');
                card.className = 'produto-card';
                card.style.animationDelay = `${idx * 0.08 + 0.1}s`;
                card.innerHTML = `
          <img class="produto-img" src="${produto.img}" alt="${produto.nome}">
          <span class="produto-nome" title="${produto.nome}">${produto.nome}</span>
          <span class="produto-preco">${produto.preco}</span>
          <span class="produto-status${produto.status === "Inativo" ? " inativo" : ""}">${produto.status}</span>
        `;
                grid.appendChild(card);
            });
            kanbanBoard.appendChild(colDiv);
        });

        // Sidebar toggle (responsivo)
        const sidebar = document.getElementById('sidebar');
        const toggleBtn = document.getElementById('toggleSidebar');
        const returnBtn = document.getElementById('returnSidebar');
        const mainContent = document.getElementById('mainContent');
        toggleBtn.onclick = () => {
            sidebar.style.width = '60px';
            mainContent.classList.add('minimized');
            toggleBtn.style.display = 'none';
            returnBtn.style.display = '';
            document.querySelector('.sidebar-label').style.display = 'none';
            document.querySelector('.sidebar-title').style.fontSize = '1.3rem';
        };
        returnBtn.onclick = () => {
            sidebar.style.width = '240px';
            mainContent.classList.remove('minimized');
            toggleBtn.style.display = '';
            returnBtn.style.display = 'none';
            document.querySelector('.sidebar-label').style.display = '';
            document.querySelector('.sidebar-title').style.fontSize = '1.7rem';
        };
  