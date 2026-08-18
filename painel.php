<?php
$caminho = "clientes.csv";

// Função para carregar pedidos
function carregarPedidos($caminho) {
    if (file_exists($caminho) && filesize($caminho) > 0) {
        return array_map(function($linha) {
            return str_getcsv(trim($linha), ",", '"', "\\");
        }, file($caminho));
    }
    return [];
}

// Função para salvar pedidos
function salvarPedidos($caminho, $pedidos) {
    $arquivo = fopen($caminho, "w");
    foreach ($pedidos as $pedido) {
        fputcsv($arquivo, $pedido, ",", '"', "\\");
    }
    fclose($arquivo);
}

// Ações do administrador
if (isset($_GET['acao']) && isset($_GET['id'])) {
    $pedidos = carregarPedidos($caminho);
    $id = (int)$_GET['id'];

    if ($_GET['acao'] === 'excluir') {
        unset($pedidos[$id]);
    } elseif ($_GET['acao'] === 'entregue') {
        // Garante que a coluna de status exista
        if (!isset($pedidos[$id][5])) {
            $pedidos[$id][5] = "Entregue";
        } else {
            $pedidos[$id][5] = "Entregue";
        }
    }

    salvarPedidos($caminho, $pedidos);
    header("Location: painel.php");
    exit;
}

// Carregar pedidos e inverter ordem (fila: mais recentes primeiro)
$pedidos = array_reverse(carregarPedidos($caminho));
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>Painel da Loja</title>
<style>
body { font-family: Arial, sans-serif; background: #f4f4f9; margin: 20px; }
h2 { color: #333; text-align: center; }
table { width: 100%; border-collapse: collapse; margin-top: 20px; background: #fff; }
th, td { padding: 12px; border: 1px solid #ddd; text-align: left; }
th { background: #007BFF; color: #fff; }
tr:nth-child(even) { background: #f9f9f9; }
.container { max-width: 1000px; margin: auto; }
a { color: #007BFF; text-decoration: none; }
a:hover { text-decoration: underline; }
</style>
</head>
<body>
<div class="container">
<h2>Painel de Pedidos</h2>
<?php if ($pedidos): ?>
<table>
<tr><th>Nome</th><th>Email</th><th>Telefone</th><th>Endereço</th><th>Pedido</th><th>Status</th><th>Ações</th></tr>
<?php foreach ($pedidos as $id => $pedido): ?>
<tr>
<td><?= htmlspecialchars($pedido[0] ?? '') ?></td>
<td><?= htmlspecialchars($pedido[1] ?? '') ?></td>
<td><?= htmlspecialchars($pedido[2] ?? '') ?></td>
<td><?= htmlspecialchars($pedido[3] ?? '') ?></td>
<td><?= htmlspecialchars($pedido[4] ?? '') ?></td>
<td><?= isset($pedido[5]) ? htmlspecialchars($pedido[5]) : "Pendente" ?></td>
<td>
  <a href="painel.php?acao=entregue&id=<?= $id ?>">Marcar como entregue</a> |
  <a href="painel.php?acao=excluir&id=<?= $id ?>" onclick="return confirm('Excluir este pedido?')">Excluir</a>
</td>
</tr>
<?php endforeach; ?>
</table>
<?php else: ?>
<p>Nenhum pedido encontrado.</p>
<?php endif; ?>
</div>
</body>
</html>
