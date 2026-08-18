<?php
// Caminho do arquivo onde os cadastros são salvos
$caminho = "C:/cadastros/clientes.csv";

echo "<h2>Clientes cadastrados</h2>";

if (file_exists($caminho)) {
    echo "<table border='1' cellpadding='5'>";
    echo "<tr><th>Nome</th><th>Email</th><th>Telefone</th></tr>";

    // Lê todas as linhas do arquivo
    $linhas = file($caminho);
    foreach ($linhas as $linha) {
        $dados = explode(",", trim($linha));
        echo "<tr>";
        foreach ($dados as $campo) {
            echo "<td>" . htmlspecialchars($campo) . "</td>";
        }
        echo "</tr>";
    }

    echo "</table>";
} else {
    echo "Nenhum cadastro encontrado.";
}
?>
