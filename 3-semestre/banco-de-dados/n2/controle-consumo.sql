--Controle de Consumo para Restaurantes

-- Tabela de Cargos (Garçom, Caixa, Gerente, Cozinheiro)
CREATE TABLE Tbl_Cargo (
    CargoID INT PRIMARY KEY AUTO_INCREMENT,
    NomeCargo VARCHAR(50) NOT NULL UNIQUE
);

-- Tabela de Ambientes (Salão Principal, Varanda, Área Externa)
CREATE TABLE Tbl_Ambiente (
    AmbienteID INT PRIMARY KEY AUTO_INCREMENT,
    NomeAmbiente VARCHAR(100) NOT NULL UNIQUE
);

-- Tabela de Catálogo: Categorias (Pratos, Bebidas, etc.)
CREATE TABLE Tbl_Categoria (
    CategoriaID INT PRIMARY KEY AUTO_INCREMENT,
    NomeCategoria VARCHAR(50) NOT NULL UNIQUE,
    -- Define se a categoria é 'Prato' ou 'Bebida'
    Tipo VARCHAR(10) NOT NULL CHECK (Tipo IN ('Prato', 'Bebida'))
);

-- Tabela de Catálogo: Formas de Pagamento (Dinheiro, Cartão, Pix, etc.)
CREATE TABLE Tbl_Forma_Pagamento (
    FormaPagamentoID INT PRIMARY KEY AUTO_INCREMENT,
    NomeFormaPagamento VARCHAR(50) NOT NULL UNIQUE
);

-- Tabela de Entidade: Clientes
-- Permite reservas e futuro programa de fidelidade
CREATE TABLE Tbl_Cliente (
    ClienteID INT PRIMARY KEY AUTO_INCREMENT,
    NomeCliente VARCHAR(150) NOT NULL,
    Telefone VARCHAR(20) NOT NULL UNIQUE,
    Email VARCHAR(100) UNIQUE,
    DataCadastro DATE NOT NULL DEFAULT (CURRENT_DATE)
);

-- Tabela de Entidade: Funcionários
-- Depende de Tbl_Cargo
CREATE TABLE Tbl_Funcionario (
    FuncionarioID INT PRIMARY KEY AUTO_INCREMENT,
    CargoID INT NOT NULL,
    NomeFuncionario VARCHAR(150) NOT NULL,
    Matricula VARCHAR(20) NOT NULL UNIQUE,
    DataAdmissao DATE NOT NULL,
    Ativo BOOLEAN NOT NULL DEFAULT TRUE,
    
    FOREIGN KEY (CargoID) REFERENCES Tbl_Cargo(CargoID)
);

-- Tabela de Entidade: Mesas
-- Depende de Tbl_Ambiente
CREATE TABLE Tbl_Mesa (
    MesaID INT PRIMARY KEY AUTO_INCREMENT,
    AmbienteID INT NOT NULL,
    NumeroMesa INT NOT NULL,
    Capacidade INT NOT NULL CHECK (Capacidade > 0),
    StatusMesa VARCHAR(15) NOT NULL DEFAULT 'Livre' CHECK (StatusMesa IN ('Livre', 'Ocupada', 'Reservada')),
    
    -- Garante que o número da mesa seja único dentro de um ambiente
    UNIQUE(AmbienteID, NumeroMesa),
    FOREIGN KEY (AmbienteID) REFERENCES Tbl_Ambiente(AmbienteID)
);

-- Tabela de Entidade: Produtos (Itens do Cardápio)
-- Depende de Tbl_Categoria
CREATE TABLE Tbl_Produto (
    ProdutoID INT PRIMARY KEY AUTO_INCREMENT,
    CategoriaID INT NOT NULL,
    NomeProduto VARCHAR(100) NOT NULL,
    Descricao TEXT,
    PrecoUnitario DECIMAL(10, 2) NOT NULL CHECK (PrecoUnitario >= 0),
    QtdPorcoes INT NOT NULL DEFAULT 1,
    Disponivel BOOLEAN NOT NULL DEFAULT TRUE,
    
    FOREIGN KEY (CategoriaID) REFERENCES Tbl_Categoria(CategoriaID)
);

-- Tabela de Transação: Reservas
-- Depende de Tbl_Cliente, Tbl_Mesa e Tbl_Funcionario
CREATE TABLE Tbl_Reserva (
    ReservaID INT PRIMARY KEY AUTO_INCREMENT,
    ClienteID INT NOT NULL,
    MesaID INT NOT NULL,
    FuncionarioRegistrouID INT NOT NULL,
    DataReserva DATETIME NOT NULL,
    QtdPessoas INT NOT NULL,
    StatusReserva VARCHAR(15) NOT NULL DEFAULT 'Pendente' CHECK (StatusReserva IN ('Pendente', 'Confirmada', 'Cancelada', 'NoShow')),
    Observacao VARCHAR(255),
    
    FOREIGN KEY (ClienteID) REFERENCES Tbl_Cliente(ClienteID),
    FOREIGN KEY (MesaID) REFERENCES Tbl_Mesa(MesaID),
    FOREIGN KEY (FuncionarioRegistrouID) REFERENCES Tbl_Funcionario(FuncionarioID)
);

-- Tabela de Transação: Comanda (A conta da mesa)
-- Depende de Tbl_Mesa, Tbl_Funcionario e Tbl_Cliente
CREATE TABLE Tbl_Comanda (
    ComandaID INT PRIMARY KEY AUTO_INCREMENT,
    MesaID INT NOT NULL,
    FuncionarioAberturaID INT NOT NULL,
    -- Permite associar a comanda a um cliente (para fidelidade), mas não é obrigatório
    ClienteID INT NULL, 
    DataAbertura DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    DataFechamento DATETIME NULL,
    StatusComanda VARCHAR(15) NOT NULL DEFAULT 'Aberta' CHECK (StatusComanda IN ('Aberta', 'Fechada', 'Paga')),
    LimiteConsumo DECIMAL(10, 2) NULL,
    ValorTotal DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    
    FOREIGN KEY (MesaID) REFERENCES Tbl_Mesa(MesaID),
    FOREIGN KEY (FuncionarioAberturaID) REFERENCES Tbl_Funcionario(FuncionarioID),
    FOREIGN KEY (ClienteID) REFERENCES Tbl_Cliente(ClienteID)
);

-- Tabela Associativa: Itens da Comanda
-- Depende de Tbl_Comanda e Tbl_Produto
CREATE TABLE Tbl_Comanda_Item (
    ComandaID INT NOT NULL,
    ProdutoID INT NOT NULL,
    Quantidade INT NOT NULL CHECK (Quantidade > 0),
    -- Armazena o preço do produto no momento da inserção (Snapshot)
    PrecoUnitarioSnapshot DECIMAL(10, 2) NOT NULL,
    -- Permite observações como "sem cebola", "ponto da carne"
    Observacao VARCHAR(255) NULL,
    
    PRIMARY KEY (ComandaID, ProdutoID),
    FOREIGN KEY (ComandaID) REFERENCES Tbl_Comanda(ComandaID),
    FOREIGN KEY (ProdutoID) REFERENCES Tbl_Produto(ProdutoID)
);

-- Tabela de Transação: Pagamentos
-- Depende de Tbl_Comanda, Tbl_Forma_Pagamento e Tbl_Funcionario
CREATE TABLE Tbl_Pagamento (
    PagamentoID INT PRIMARY KEY AUTO_INCREMENT,
    ComandaID INT NOT NULL,
    FormaPagamentoID INT NOT NULL,
    -- Registra qual funcionário (Caixa) processou o pagamento
    FuncionarioCaixaID INT NOT NULL,
    ValorPagamento DECIMAL(10, 2) NOT NULL CHECK (ValorPagamento > 0),
    DataPagamento DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (ComandaID) REFERENCES Tbl_Comanda(ComandaID),
    FOREIGN KEY (FormaPagamentoID) REFERENCES Tbl_Forma_Pagamento(FormaPagamentoID),
    FOREIGN KEY (FuncionarioCaixaID) REFERENCES Tbl_Funcionario(FuncionarioID)
);