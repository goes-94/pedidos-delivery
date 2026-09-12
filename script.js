// Finalização de pedidos (Pix e Entrega)
document.addEventListener("DOMContentLoaded", () => {
  const btnPix = document.getElementById("btnPix");
  const btnEntrega = document.getElementById("btnEntrega");

  async function processarPedido(tipoPagamento) {
    const nome = document.getElementById("nome")?.value.trim() || "";
    const email = document.getElementById("email")?.value.trim() || "";
    const numero = document.getElementById("numero")?.value.trim() || "";
    const endereco = document.getElementById("endereco")?.value.trim() || "";

    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    const pedidoTexto = carrinho.map(item =>
      `${item.nome} (x${item.quantidade}) - R$${(item.preco * item.quantidade).toFixed(2)}`
    ).join("\n");
    const total = carrinho.reduce((acc, item) => acc + item.preco * item.quantidade, 0);

    const novoPedido = { nome, email, numero, endereco, pedido: pedidoTexto, valor: total, status: "Pendente", pagamento: tipoPagamento };

    let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
    pedidos.push(novoPedido);
    localStorage.setItem("pedidos", JSON.stringify(pedidos));

    if (window.firebasePedidos?.salvarPedido) {
      try {
        const id = await window.firebasePedidos.salvarPedido(novoPedido);
        console.log("Pedido salvo no Firestore com ID:", id);
      } catch (erro) {
        console.error("Erro ao salvar no Firestore:", erro.message, erro);
      }
    }

    let mensagem = `Olá! Gostaria de finalizar meu pedido (pagamento: ${tipoPagamento}):\n\n${pedidoTexto}\n\nTotal: R$${total.toFixed(2)}\n\nDados do cliente:\nNome: ${nome}\nTelefone: ${numero}\nEmail: ${email}\nEndereço: ${endereco}`;
    const numeroWhatsApp = "5541997029155";
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
    window.open(urlWhatsApp, "_blank");

    localStorage.setItem("valorPagamento", total);

    localStorage.removeItem("carrinho");
    setTimeout(() => {
      window.location.href = tipoPagamento === "Pix" ? "pagamento-pix.html" : "confirmacao.html";
    }, 500);
  }

  if (btnPix) btnPix.addEventListener("click", e => { e.preventDefault(); processarPedido("Pix"); });
  if (btnEntrega) btnEntrega.addEventListener("click", e => { e.preventDefault(); processarPedido("Entrega"); });

// Painel pedidos  
const tbody = document.getElementById("lista-pedidos");
if (tbody && window.firebasePedidos?.ouvirPedidos) {
  window.firebasePedidos.ouvirPedidos((pedidos) => {
    tbody.innerHTML = "";
    let faturamentoTotal = 0; // <-- inicializa o acumulador

    pedidos.forEach((p) => {
      faturamentoTotal += p.valor || 0; // <-- soma cada pedido

      const linha = tbody.insertRow();
      linha.insertCell().textContent = p.nome || "-";
      linha.insertCell().textContent = p.email || "-";
      linha.insertCell().textContent = p.numero || "-";
      linha.insertCell().textContent = p.endereco || "-";
      linha.insertCell().textContent = p.pedido || "-";
      linha.insertCell().textContent = "R$ " + (p.valor ? p.valor.toFixed(2) : "0.00");

      const statusCell = linha.insertCell();
      const select = document.createElement("select");
      ["Pendente", "Entregue", "Cancelado"].forEach(opt => {
        const option = new Option(opt, opt, false, p.status === opt);
        select.add(option);
      });

      aplicarCor(select, p.status);

      select.onchange = async () => {
        try {
          await window.firebasePedidos.atualizarStatusPedido(p.id, select.value);
          aplicarCor(select, select.value);
        } catch (erro) {
          console.error("Erro ao atualizar status:", erro);
        }
      };

      statusCell.appendChild(select);
    });

    // Exibe faturamento total
    const faturamentoEl = document.getElementById("faturamento");
    if (faturamentoEl) {
      faturamentoEl.textContent = `Faturamento total: R$ ${faturamentoTotal.toFixed(2)}`;
    }
  });
}





  // Função para aplicar cores conforme status
  function aplicarCor(elemento, status) {
    elemento.style.color = "#000";
    if (status === "Pendente") {
      elemento.style.backgroundColor = "#ffea04"; // amarelo
    } else if (status === "Entregue") {
      elemento.style.backgroundColor = "#00ff73"; // verde
    } else if (status === "Cancelado") {
      elemento.style.backgroundColor = "#f10707"; // vermelho
      elemento.style.color = "#fff"; // texto branco
    }
  }
});

// Carrinho de Compras
document.addEventListener("DOMContentLoaded", () => {
  let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  const botoesCarrinho = document.querySelectorAll(".btn-carrinho");

  botoesCarrinho.forEach(botao => {
    botao.addEventListener("click", () => {
      const nome = botao.getAttribute("data-nome");
      const preco = parseFloat(botao.getAttribute("data-preco"));
      const existente = carrinho.find(item => item.nome === nome);
      if (existente) existente.quantidade++;
      else carrinho.push({ nome, preco, quantidade: 1 });
      localStorage.setItem("carrinho", JSON.stringify(carrinho));
      alert(`${nome} foi adicionado ao carrinho!`);
      renderCarrinho();
    });
  });

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
      li.querySelector(".menos").addEventListener("click", () => {
        if (item.quantidade > 1) item.quantidade--; else carrinho.splice(i, 1);
        salvarCarrinho();
      });
      li.querySelector(".mais").addEventListener("click", () => { item.quantidade++; salvarCarrinho(); });
      li.querySelector(".remover").addEventListener("click", () => { carrinho.splice(i, 1); salvarCarrinho(); });
      lista.appendChild(li);
      total += item.preco * item.quantidade;
    });
    if (totalElement) totalElement.textContent = `Total: R$${total.toFixed(2)}`;
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
      localStorage.setItem("carrinho", JSON.stringify(carrinho));
      window.location.href = "cadastro.html";
    });
  }
  renderCarrinho();
});

// Login
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const usuario = document.getElementById("usuario").value.trim();
      const senha = document.getElementById("senha").value.trim();
      const erro = document.getElementById("erro");
      const usuarioCorreto = "admin";
      const senhaCorreta = "1234";
      if (usuario === usuarioCorreto && senha === senhaCorreta) {
        localStorage.setItem("logado", "true");
        window.location.href = "painelpedidos.html";
      } else {
        erro.textContent = "Usuário ou senha inválidos!";
      }
    });
  }
});
