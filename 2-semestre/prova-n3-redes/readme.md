# PROVA N3 - REDES

Este projeto configura um ambiente com **4 serviços via Docker Compose** para atender aos requisitos da Avaliação N3 da disciplina de Redes.

## Alunos: Geison Carlos Melo e Leonardo Anders


## Serviços configurados

- **NGINX** – Servidor de proxy reverso, redireciona `/prova` para o WordPress
- **MySQL 5.7** – Banco de dados utilizado pelo WordPress
- **WordPress** – Aplicação principal da prova, acessível via NGINX
- **phpMyAdmin** – Interface web para administrar o banco de dados

## Estrutura do projeto

```
prova-n3-redes/
├── docker-compose.yml
├── nginx/
│   └── default.conf
├── wp-config-extra.php
└── README.md
```

## Como executar

1. Clone o repositório:

   ```bash
   git clone https://github.com/seu-usuario/prova-n3-redes.git
   cd prova-n3-redes
   ```

2. Suba os containers:

   ```bash
   docker compose up -d
   ```

3. Acesse no navegador:

   - WordPress: [http://localhost/prova](http://localhost/prova)
   - phpMyAdmin: [http://localhost:8080](http://localhost:8080)

> O WordPress **não está disponível em http://localhost/** diretamente. O acesso correto é via `/prova`, conforme exigido na prova.

## Configurações importantes

- O NGINX redireciona `/prova/` para o serviço `wordpress`.
- O WordPress foi configurado para funcionar em `/prova` via `wp-config-extra.php`.
- O MySQL usa o usuário `wpuser` com o banco `wordpress`.

## Requisitos atendidos

- [x] docker-compose funcional com 4 serviços
- [x] WordPress acessível via `/prova`
- [x] phpMyAdmin funcionando em `localhost:8080`
- [x] Acesso bloqueado em `localhost/`
- [x] Banco de dados funcionando e conectado

---
