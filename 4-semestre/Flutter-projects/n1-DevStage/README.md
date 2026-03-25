# DevStage

Aplicativo gamificado para ensino de **Flutter, Dart e Firebase**, onde o usuário progride na carreira como um estagiário de desenvolvimento mobile.

> Projeto acadêmico da disciplina de Desenvolvimento de Dispositivos Móveis — 4 Semestre.

## Sobre o Projeto

O DevStage transforma o aprendizado de desenvolvimento mobile em uma jornada de carreira gamificada. O usuário começa como **Estagiário** e avança pelos níveis **Júnior, Pleno e Sênior** conforme conclui módulos, quizzes e missões.

### Mecânicas de Gamificação
- **XP (Experiência):** Acumulado ao completar leituras, quizzes e desafios práticos.
- **Níveis de Carreira:** Progressão baseada no XP acumulado.
- **Insígnias:** Conquistas desbloqueadas ao dominar tecnologias específicas.
- **Streak Diário:** Bônus por dias consecutivos de uso.
- **Missões:** Objetivos com recompensas em XP.

## Tecnologias

- [Flutter](https://flutter.dev/) — SDK de UI multiplataforma
- [Dart](https://dart.dev/) — Linguagem de programação
- [Google Fonts](https://pub.dev/packages/google_fonts) — Tipografia (Inter / JetBrains Mono)

## Telas

| Tela | Descrição |
|------|-----------|
| Splash Screen | Tela de carregamento inicial com logo |
| Login / Cadastro | Autenticação com tabs para login e registro |
| Início (Dashboard) | Resumo de XP, nível, streak e módulos disponíveis |
| Módulo / Conteúdo | Leitura sequencial do conteúdo teórico |
| Quiz | Perguntas de múltipla escolha com feedback visual |
| Missões | Lista de missões por status (andamento/disponíveis/concluídas) |
| Perfil | Dados do usuário, insígnias e histórico |

## Como Executar

```bash
# Clone o repositório
git clone https://github.com/geison-melo/software-engineering.git

# Acesse a pasta do projeto
cd software-engineering/4-semestre/Flutter-projects/n1-DevStage

# Instale as dependências
flutter pub get

# Execute no Chrome
flutter run -d chrome

# Ou gere o APK
flutter build apk
```

## Integrantes

- Gabriel Massaia
- Geison Melo
- João Meister
- Leonardo Anders
- Thiago Maes
