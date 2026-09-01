document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formpedido");

  // Se estamos na página de cadastro
  if (form) {
    form.addEventListener("submit", function(event) {
      event.preventDefault();

      const nome = document.getElementById("nome").value.trim();
      const email = document.getElementById("email").value.trim();
      const numero = document.getElementById("numero").value.trim();
      const endereco = document.getElementById("endereco").value.trim();

      // Recupera carrinho
      const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

      // Monta texto do pedido
      const pedidoTexto = carrinho.map(item =>
        `${item.nome} (x${item.quantidade}) - R$${(item.preco * item.quantidade).toFixed(2)}`
      ).join("\n");

      const total = carrinho.reduce((acc, item) => acc + item.preco * item.quantidade, 0);

      // Cria objeto do pedido
      const novoPedido = { nome, email, numero, endereco, pedido: pedidoTexto, valor: total, status: "Pendente", pagamento: "Pix" };

      // Recupera lista existente ou cria nova
      let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
      pedidos.push(novoPedido);
      localStorage.setItem("pedidos", JSON.stringify(pedidos));

      // Calcula faturamento total
      let faturamentoTotal = pedidos.reduce((acc, p) => acc + (p.valor || 0), 0);

      // Exibe no elemento de faturamento
      document.getElementById("faturamento").textContent = "R$ " + faturamentoTotal.toFixed(2);


      // Monta mensagem para WhatsApp
      let mensagem = `Olá! Gostaria de finalizar meu pedido (pagamento no SIte):\n\n${pedidoTexto}\n\nTotal: R$${total.toFixed(2)}\n\nDados do cliente:\nNome: ${nome}\nTelefone: ${numero}\nEmail: ${email}\nEndereço: ${endereco}`;

      const numeroWhatsApp = "5541997029155"; // número da pizzaria
      const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
      window.open(urlWhatsApp, "_blank");

      // Limpa carrinho
      localStorage.removeItem("carrinho");

      // Redireciona para painel
      window.location.href = "pagamento-pix.html";
    });

    const btnEntrega = document.getElementById("btnEntrega");

if (btnEntrega) {
  btnEntrega.addEventListener("click", function(event) {
    event.preventDefault();

    // Captura os mesmos dados do formulário
    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const numero = document.getElementById("numero").value.trim();
    const endereco = document.getElementById("endereco").value.trim();

    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

    const pedidoTexto = carrinho.map(item =>
      `${item.nome} (x${item.quantidade}) - R$${(item.preco * item.quantidade).toFixed(2)}`
    ).join("\n");

    const total = carrinho.reduce((acc, item) => acc + item.preco * item.quantidade, 0);

    // Cria objeto do pedido
    const novoPedido = { nome, email, numero, endereco, pedido: pedidoTexto, valor: total, status: "Pendente", pagamento: "Entrega" };

    let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
    pedidos.push(novoPedido);
    localStorage.setItem("pedidos", JSON.stringify(pedidos));

    // Monta mensagem para WhatsApp
    let mensagem = `Olá! Gostaria de finalizar meu pedido (pagamento na entrega):\n\n${pedidoTexto}\n\nTotal: R$${total.toFixed(2)}\n\nDados do cliente:\nNome: ${nome}\nTelefone: ${numero}\nEmail: ${email}\nEndereço: ${endereco}`;

    const numeroWhatsApp = "5541997029155";
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
    window.open(urlWhatsApp, "_blank");

    // Limpa carrinho
    localStorage.removeItem("carrinho");

    // Redireciona para página de confirmação
    window.location.href = "confirmação.html";
  });
  }

  }

  // Se estamos no painelpedidos.html
  const tabela = document.getElementById("lista-pedidos");
  if (tabela) {
    let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

    pedidos.forEach((p, index) => {
      const linha = tabela.insertRow();
      linha.insertCell().textContent = p.nome;
      linha.insertCell().textContent = p.email;
      linha.insertCell().textContent = p.numero;
      linha.insertCell().textContent = p.pedido;
      linha.insertCell().textContent = p.endereco;
      linha.insertCell().textContent = "R$ " + (p.valor ? p.valor.toFixed(2) : "0.00");


      // Coluna de status com select
      const statusCell = linha.insertCell();
      const select = document.createElement("select");
      ["Pendente", "Entregue", "Cancelado"].forEach(opt => {
        const option = document.createElement("option");
        option.value = opt;
        option.textContent = opt;
        if (p.status === opt) option.selected = true;
        select.appendChild(option);
      });

      // Aplica cor inicial
      aplicarCor(select, p.status);

      // Atualiza status e cor no localStorage quando mudar
      select.addEventListener("change", () => {
        pedidos[index].status = select.value;
        localStorage.setItem("pedidos", JSON.stringify(pedidos));
        aplicarCor(select, select.value);
      });

      statusCell.appendChild(select);
    });
  }

  // Função para aplicar cores conforme status
  function aplicarCor(elemento, status) {
    elemento.style.color = "#000"; // texto padrão
    if (status === "Pendente") {
      elemento.style.backgroundColor = "#ffea04";
    } else if (status === "Entregue") {
      elemento.style.backgroundColor = "#00ff73";
    } else if (status === "Cancelado") {
      elemento.style.backgroundColor = "#f10707";
      elemento.style.color = "#fff"; // texto branco para contraste
    }
  }
});

// Carrinho de Compras

document.addEventListener("DOMContentLoaded", () => {
  let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

  // Captura todos os botões de adicionar ao carrinho
  const botoesCarrinho = document.querySelectorAll(".btn-carrinho");
  botoesCarrinho.forEach(botao => {
    botao.addEventListener("click", () => {
      const nome = botao.getAttribute("data-nome");
      const preco = parseFloat(botao.getAttribute("data-preco"));

      // Verifica se já existe o item
      const existente = carrinho.find(item => item.nome === nome);

      if (existente) {
        existente.quantidade++;
      } else {
        carrinho.push({ nome: nome, preco: preco, quantidade: 1 });
      }

      localStorage.setItem("carrinho", JSON.stringify(carrinho));
      alert(`${nome} foi adicionado ao carrinho!`);
    });
  });

  // Renderiza carrinho se existir seção no HTML
  function renderCarrinho() {
    const lista = document.getElementById("lista-carrinho");
    const totalElement = document.getElementById("total");
    if (!lista) return;

    lista.innerHTML = "";
    let total = 0;

    carrinho.forEach((item, i) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span>${item.nome} - R$${item.preco.toFixed(2)}</span>
        <div>
          <button class="menos">➖</button>
          <span>${item.quantidade}</span>
          <button class="mais">➕</button>
          <button class="remover">❌</button>
        </div>
      `;

      // Botão menos
      li.querySelector(".menos").addEventListener("click", () => {
        if (item.quantidade > 1) {
          item.quantidade--;
        } else {
          carrinho.splice(i, 1);
        }
        salvarCarrinho();
      });

      // Botão mais
      li.querySelector(".mais").addEventListener("click", () => {
        item.quantidade++;
        salvarCarrinho();
      });

      // Botão remover
      li.querySelector(".remover").addEventListener("click", () => {
        carrinho.splice(i, 1);
        salvarCarrinho();
      });

      lista.appendChild(li);
      total += item.preco * item.quantidade;
    });

    if (totalElement) {
      totalElement.textContent = `Total: R$${total.toFixed(2)}`;
    }
  }

  function salvarCarrinho() {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    renderCarrinho();
  }

  const finalizarBtn = document.getElementById("finalizar");
  if (finalizarBtn) {
    finalizarBtn.addEventListener("click", () => {
      if (carrinho.length === 0) {
        alert("Seu carrinho está vazio.");
        return;
      }

      // Salva o carrinho no localStorage para usar depois
      localStorage.setItem("carrinho", JSON.stringify(carrinho));

      // Redireciona para a página de cadastro
      window.location.href = "cadastro.html";
    });
  }

  renderCarrinho();
});

//Painel de login e lógica de acesso ao painel de pedidos
 document.getElementById("loginForm").addEventListener("submit", function(e) {
      e.preventDefault();

      const usuario = document.getElementById("usuario").value.trim();
      const senha = document.getElementById("senha").value.trim();
      const erro = document.getElementById("erro");

      // Defina aqui o usuário e senha do dono da pizzaria
      const usuarioCorreto = "admin";
      const senhaCorreta = "1234";

      if (usuario === usuarioCorreto && senha === senhaCorreta) {
        // Marca login como válido
        localStorage.setItem("logado", "true");
        window.location.href = "painelpedidos.html";
      } else {
        erro.textContent = "Usuário ou senha inválidos!";
      }
    });