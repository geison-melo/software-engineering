import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../routes/app_routes.dart';

class ContentScreen extends StatefulWidget {
  final String moduleTitle;
  const ContentScreen({super.key, required this.moduleTitle});

  @override
  State<ContentScreen> createState() => _ContentScreenState();
}

class _ContentScreenState extends State<ContentScreen> {
  final PageController _pageController = PageController();
  int _currentPage = 0;

  List<Widget> get _pages {
    if (widget.moduleTitle == 'Dart Básico') {
      return _dartPages();
    } else {
      return _flutterPages();
    }
  }

  // ─── Módulo: Dart Básico ───
  List<Widget> _dartPages() {
    return [
      _buildTheoryCard(
        'Variáveis e Tipos',
        'Dart é uma linguagem fortemente tipada. As variáveis podem ser '
        'declaradas com tipos explícitos ou usando inferência com var.',
        'void main() {\n'
        '  String nome = \'DevStage\';\n'
        '  int nivel = 1;\n'
        '  double xp = 120.5;\n'
        '  bool ativo = true;\n'
        '  var linguagem = \'Dart\';\n'
        '\n'
        '  print(\'App: \$nome\');\n'
        '  print(\'Nível: \$nivel\');\n'
        '}',
        'String → armazena texto\n'
        'int → números inteiros\n'
        'double → números decimais\n'
        'bool → verdadeiro ou falso\n'
        'var → tipo inferido pelo compilador',
      ),
      _buildTheoryCard(
        'Funções',
        'Funções em Dart podem ter tipos de retorno, parâmetros opcionais '
        'e até serem escritas em uma única linha com arrow syntax.',
        'int somar(int a, int b) {\n'
        '  return a + b;\n'
        '}\n'
        '\n'
        '// Arrow syntax\n'
        'int multiplicar(int a, int b) => a * b;\n'
        '\n'
        '// Parâmetro opcional\n'
        'String saudacao(String nome,\n'
        '    {String titulo = \'Dev\'}) {\n'
        '  return \'Olá, \$titulo \$nome!\';\n'
        '}',
        '=> (arrow) → atalho para funções\n'
        'de uma única expressão\n\n'
        '{} (chaves) → parâmetros\n'
        'nomeados e opcionais\n\n'
        'Valor padrão definido com =',
      ),
      _buildTheoryCard(
        'Listas e Maps',
        'Coleções são fundamentais em Dart. Listas armazenam sequências '
        'ordenadas e Maps guardam pares chave-valor.',
        'void main() {\n'
        '  List<String> modulos = [\n'
        '    \'Dart Básico\',\n'
        '    \'Flutter UI\',\n'
        '    \'Firebase\',\n'
        '  ];\n'
        '\n'
        '  Map<String, int> xpModulo = {\n'
        '    \'Dart\': 50,\n'
        '    \'Flutter\': 80,\n'
        '    \'Firebase\': 120,\n'
        '  };\n'
        '\n'
        '  print(modulos[0]);\n'
        '  print(xpModulo[\'Dart\']);\n'
        '}',
        'List<T> → lista tipada\n'
        'Acesso por índice: lista[0]\n\n'
        'Map<K,V> → dicionário\n'
        'Acesso por chave: map[\'key\']\n\n'
        'Ambos suportam .add(), .remove()\n'
        'e iteração com for-in',
      ),
    ];
  }

  // ─── Módulo: Flutter UI ───
  List<Widget> _flutterPages() {
    return [
      _buildTheoryCard(
        'Widgets Básicos',
        'No Flutter, tudo é um Widget. A interface é construída '
        'combinando widgets em uma árvore hierárquica.',
        'import \'package:flutter/material.dart\';\n'
        '\n'
        'class MeuApp extends StatelessWidget {\n'
        '  @override\n'
        '  Widget build(BuildContext ctx) {\n'
        '    return MaterialApp(\n'
        '      home: Scaffold(\n'
        '        appBar: AppBar(\n'
        '          title: Text(\'DevStage\'),\n'
        '        ),\n'
        '        body: Center(\n'
        '          child: Text(\'Olá, Flutter!\'),\n'
        '        ),\n'
        '      ),\n'
        '    );\n'
        '  }\n'
        '}',
        'MaterialApp → raiz do app\n'
        'Scaffold → estrutura da tela\n'
        'AppBar → barra superior\n'
        'Center → centraliza o filho\n'
        'Text → exibe texto na tela',
        phonePreview: _buildPhonePreview(
          child: Column(
            children: [
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(8),
                color: const Color(0xFF7C3AED),
                child: const Text('DevStage', style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold)),
              ),
              const Expanded(
                child: Center(child: Text('Olá, Flutter!', style: TextStyle(color: Colors.white, fontSize: 10))),
              ),
            ],
          ),
        ),
      ),
      _buildTheoryCard(
        'Column e Row',
        'Column organiza widgets na vertical e Row na horizontal. '
        'São os layouts mais usados no Flutter.',
        'body: Column(\n'
        '  mainAxisAlignment:\n'
        '      MainAxisAlignment.center,\n'
        '  children: [\n'
        '    Icon(Icons.star,\n'
        '      color: Colors.amber, size: 48),\n'
        '    SizedBox(height: 16),\n'
        '    Text(\'Nível: Estagiário\',\n'
        '      style: TextStyle(\n'
        '        fontSize: 20,\n'
        '        fontWeight: FontWeight.bold,\n'
        '      ),\n'
        '    ),\n'
        '    Text(\'120 / 500 XP\'),\n'
        '  ],\n'
        ')',
        'Column → empilha na vertical\n'
        'Row → alinha na horizontal\n\n'
        'mainAxisAlignment →\n'
        'controla posição no eixo principal\n\n'
        'SizedBox → espaçamento entre\n'
        'widgets filhos',
        phonePreview: _buildPhonePreview(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: const [
              Icon(Icons.star, color: Colors.amber, size: 28),
              SizedBox(height: 6),
              Text('Nível: Estagiário', style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
              Text('120 / 500 XP', style: TextStyle(color: Colors.grey, fontSize: 8)),
            ],
          ),
        ),
      ),
      _buildTheoryCard(
        'ElevatedButton e GestureDetector',
        'Botões e detectores de gesto permitem que o usuário interaja '
        'com o app. O ElevatedButton já vem estilizado.',
        'ElevatedButton(\n'
        '  style: ElevatedButton.styleFrom(\n'
        '    backgroundColor: Colors.purple,\n'
        '    padding: EdgeInsets.symmetric(\n'
        '      horizontal: 32, vertical: 16),\n'
        '  ),\n'
        '  onPressed: () {\n'
        '    print(\'Botão pressionado!\');\n'
        '  },\n'
        '  child: Text(\'Iniciar Módulo\'),\n'
        ')\n'
        '\n'
        '// GestureDetector para qualquer\n'
        '// widget virar clicável\n'
        'GestureDetector(\n'
        '  onTap: () => print(\'Tap!\'),\n'
        '  child: Card(...),\n'
        ')',
        'ElevatedButton → botão elevado\n'
        'com sombra e estilo Material\n\n'
        'onPressed → callback do clique\n\n'
        'GestureDetector → transforma\n'
        'qualquer widget em clicável\n\n'
        'styleFrom → personaliza cores\n'
        'e espaçamento do botão',
        phonePreview: _buildPhonePreview(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                decoration: BoxDecoration(
                  color: const Color(0xFF7C3AED),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: const Text('Iniciar Módulo', style: TextStyle(color: Colors.white, fontSize: 9)),
              ),
            ],
          ),
        ),
      ),
    ];
  }

  @override
  Widget build(BuildContext context) {
    final pages = _pages;
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.moduleTitle),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () {
            if (_currentPage > 0) {
              _pageController.previousPage(
                duration: const Duration(milliseconds: 300),
                curve: Curves.easeInOut,
              );
            } else {
              Navigator.pop(context);
            }
          },
        ),
      ),
      body: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Text(
                '${_currentPage + 1} de ${pages.length}',
                style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
            ),
            Expanded(
              child: PageView(
                controller: _pageController,
                onPageChanged: (index) {
                  setState(() {
                    _currentPage = index;
                  });
                },
                children: pages,
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  LinearProgressIndicator(
                    value: (_currentPage + 1) / pages.length,
                    backgroundColor: Colors.grey[800],
                    color: const Color(0xFF06B6D4),
                  ),
                  const SizedBox(height: 24),
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF7C3AED),
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    ),
                    onPressed: () {
                      if (_currentPage < pages.length - 1) {
                        _pageController.nextPage(
                          duration: const Duration(milliseconds: 300),
                          curve: Curves.easeInOut,
                        );
                      } else {
                        Navigator.pushReplacementNamed(
                          context,
                          AppRoutes.quiz,
                          arguments: widget.moduleTitle,
                        );
                      }
                    },
                    child: Text(
                      _currentPage < pages.length - 1 ? 'Próximo' : 'Ir para o Quiz',
                      style: const TextStyle(fontSize: 16, color: Colors.white),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ─── Card de conteúdo teórico com código e explicação lado a lado ───
  Widget _buildTheoryCard(String title, String description, String code, String explanation, {Widget? phonePreview}) {
    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Título
          Text(title, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Color(0xFF06B6D4))),
          const SizedBox(height: 12),
          // Descrição
          Text(description, style: const TextStyle(fontSize: 15, height: 1.5, color: Colors.white70)),
          const SizedBox(height: 20),
          // Código + Explicação
          Container(
            decoration: BoxDecoration(
              color: const Color(0xFF0D1117),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: Colors.grey[800]!),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Header do bloco de código
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  decoration: BoxDecoration(
                    color: Colors.grey[900],
                    borderRadius: const BorderRadius.only(topLeft: Radius.circular(8), topRight: Radius.circular(8)),
                  ),
                  child: Row(
                    children: [
                      Container(width: 10, height: 10, decoration: const BoxDecoration(color: Colors.red, shape: BoxShape.circle)),
                      const SizedBox(width: 6),
                      Container(width: 10, height: 10, decoration: const BoxDecoration(color: Colors.yellow, shape: BoxShape.circle)),
                      const SizedBox(width: 6),
                      Container(width: 10, height: 10, decoration: const BoxDecoration(color: Colors.green, shape: BoxShape.circle)),
                      const SizedBox(width: 12),
                      Text('main.dart', style: TextStyle(color: Colors.grey[500], fontSize: 12)),
                    ],
                  ),
                ),
                // Código
                Padding(
                  padding: const EdgeInsets.all(12),
                  child: Text(
                    code,
                    style: GoogleFonts.jetBrainsMono(fontSize: 12, height: 1.6, color: const Color(0xFF06B6D4)),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Explicação + Preview (lado a lado se tiver preview)
          if (phonePreview != null)
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Explicação lado esquerdo
                Expanded(
                  flex: 3,
                  child: _buildExplanationBox(explanation),
                ),
                const SizedBox(width: 12),
                // Preview no celular lado direito
                Expanded(
                  flex: 2,
                  child: phonePreview,
                ),
              ],
            )
          else
            _buildExplanationBox(explanation),
          const SizedBox(height: 16),
        ],
      ),
    );
  }

  Widget _buildExplanationBox(String explanation) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: const Color(0xFF7C3AED).withOpacity(0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(Icons.lightbulb_outline, color: Colors.amber, size: 16),
              SizedBox(width: 6),
              Text('Explicação', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.amber)),
            ],
          ),
          const SizedBox(height: 8),
          Text(explanation, style: const TextStyle(fontSize: 13, height: 1.5, color: Colors.white70)),
        ],
      ),
    );
  }

  // ─── Preview em formato de celular ───
  Widget _buildPhonePreview({required Widget child}) {
    return Container(
      height: 180,
      decoration: BoxDecoration(
        color: const Color(0xFF0F172A),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey[700]!, width: 2),
      ),
      child: Column(
        children: [
          // Barra de status do celular
          Container(
            padding: const EdgeInsets.symmetric(vertical: 3),
            decoration: BoxDecoration(
              color: Colors.grey[900],
              borderRadius: const BorderRadius.only(topLeft: Radius.circular(10), topRight: Radius.circular(10)),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(width: 30, height: 3, decoration: BoxDecoration(color: Colors.grey[700], borderRadius: BorderRadius.circular(2))),
              ],
            ),
          ),
          // Conteúdo
          Expanded(child: child),
        ],
      ),
    );
  }
}
