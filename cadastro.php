<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Captura os dados do formulário
$nome = $_POST['nome'] ?? '';
$email = $_POST['email'] ?? '';
$telefone = $_POST['telefone'] ?? '';
$endereco = $_POST['endereco'] ?? '';
$pedido = $_POST['pedido'] ?? '';

// Só grava se todos os campos estiverem preenchidos
if ($nome && $email && $telefone && $endereco && $pedido) {
   $caminho = __DIR__ . "clientes.csv"; // caminho absoluto
    $arquivo = fopen($caminho, "a");
    if ($arquivo === false) {
        die("Erro: não consegui abrir o arquivo para escrita.");
    }

    // Grava todos os dados + status inicial "Pendente"
    fputcsv($arquivo, [$nome, $email, $telefone, $endereco, $pedido, "Pendente"], ",", '"', "\\");


    fclose($arquivo);
}

// Redireciona para o painel
header("Location: painel.php");
exit;
?>
