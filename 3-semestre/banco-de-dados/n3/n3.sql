-- 1- Liste o ID do pedido, a data do pedido e o nome do cliente que realizou cada compra.
SELECT 
    P.id_pedido, 
    P.data_pedido, 
    C.nome_cliente
FROM Pedidos P
INNER JOIN Clientes C ON P.id_cliente = C.id_cliente;

-- 2- Liste o nome do produto e o nome da categoria, mas apenas para produtos que custam mais de R$ 500,00.
SELECT 
    P.nome_produto, 
    C.nome_categoria
FROM Produtos P
INNER JOIN Categorias C ON P.id_categoria = C.id_categoria
WHERE P.preco > 500.00;

-- 3- Exiba o ID do pedido, o nome do cliente e o nome do funcionário (vendedor) responsável por cada venda.
SELECT 
    P.id_pedido, 
    C.nome_cliente, 
    F.nome_funcionario AS nome_vendedor
FROM Pedidos P
INNER JOIN Clientes C ON P.id_cliente = C.id_cliente
INNER JOIN Funcionarios F ON P.id_vendedor = F.id_funcionario;

-- 4- Liste todos os clientes cadastrados e, se houver, a data de seus pedidos. Clientes que nunca compraram devem aparecer na lista com a data "NULL".
SELECT 
    C.nome_cliente, 
    P.data_pedido
FROM Clientes C
LEFT JOIN Pedidos P ON C.id_cliente = P.id_cliente;

-- 5- Quantos pedidos cada vendedor realizou? Exiba o nome do vendedor e a quantidade (contagem) total de pedidos.
SELECT 
    F.nome_funcionario, 
    COUNT(P.id_pedido) AS total_pedidos
FROM Funcionarios F
INNER JOIN Pedidos P ON F.id_funcionario = P.id_vendedor
GROUP BY F.nome_funcionario;

-- 6- Liste os nomes das categorias que não possuem nenhum produto cadastrado.
SELECT 
    C.nome_categoria
FROM Categorias C
LEFT JOIN Produtos P ON C.id_categoria = P.id_categoria
WHERE P.id_produto IS NULL;

-- 7- Calcule o valor total de cada pedido (multiplicando quantidade por preço unitário na tabela ItensPedido). Exiba o ID do pedido e o valor total.
SELECT 
    id_pedido, 
    SUM(quantidade * preco_unitario) AS valor_total_pedido
FROM ItensPedido
GROUP BY id_pedido;

-- 8- Liste o nome de cada funcionário e o nome de seu respectivo gerente.
SELECT 
    F.nome_funcionario AS funcionario, 
    G.nome_funcionario AS gerente
FROM Funcionarios F
LEFT JOIN Funcionarios G ON F.id_gerente = G.id_funcionario;

-- 9- Liste o nome do cliente e os nomes dos produtos que ele comprou. Evite nomes de produtos duplicados para o mesmo cliente.
SELECT DISTINCT 
    C.nome_cliente, 
    PR.nome_produto
FROM Clientes C
INNER JOIN Pedidos P ON C.id_cliente = P.id_cliente
INNER JOIN ItensPedido I ON P.id_pedido = I.id_pedido
INNER JOIN Produtos PR ON I.id_produto = PR.id_produto
ORDER BY C.nome_cliente;

-- 10- Qual cliente gastou mais dinheiro no total (soma de todas as compras)? Exiba o nome do cliente e o valor total gasto.
SELECT 
    C.nome_cliente, 
    SUM(I.quantidade * I.preco_unitario) AS valor_total_gasto
FROM Clientes C
INNER JOIN Pedidos P ON C.id_cliente = P.id_cliente
INNER JOIN ItensPedido I ON P.id_pedido = I.id_pedido
GROUP BY C.nome_cliente
ORDER BY valor_total_gasto DESC
LIMIT 1;