import 'package:flutter/material.dart';

class _QuizQuestion {
  final String question;
  final List<String> options;
  final int correctIndex;

  _QuizQuestion({required this.question, required this.options, required this.correctIndex});
}

class QuizScreen extends StatefulWidget {
  final String moduleTitle;
  const QuizScreen({super.key, required this.moduleTitle});

  @override
  State<QuizScreen> createState() => _QuizScreenState();
}

class _QuizScreenState extends State<QuizScreen> with TickerProviderStateMixin {
  int _currentQuestion = 0;
  int? _selectedIndex;
  bool _isTransitioning = false;
  int _totalXP = 0;

  // Overlay feedback
  bool _showOverlay = false;
  bool? _lastAnswerCorrect;
  late AnimationController _overlayController;
  late Animation<double> _overlayFade;
  late Animation<double> _overlayScale;

  @override
  void initState() {
    super.initState();
    _overlayController = AnimationController(vsync: this, duration: const Duration(milliseconds: 400));
    _overlayFade = Tween<double>(begin: 0, end: 1).animate(CurvedAnimation(parent: _overlayController, curve: Curves.easeOut));
    _overlayScale = Tween<double>(begin: 0.5, end: 1.0).animate(CurvedAnimation(parent: _overlayController, curve: Curves.elasticOut));
  }

  @override
  void dispose() {
    _overlayController.dispose();
    super.dispose();
  }

  List<_QuizQuestion> get _questions {
    if (widget.moduleTitle == 'Dart Básico') {
      return [
        _QuizQuestion(
          question: 'Qual palavra-chave permite que o Dart infira o tipo da variável automaticamente?',
          options: ['A) String', 'B) const', 'C) var', 'D) dynamic'],
          correctIndex: 2,
        ),
        _QuizQuestion(
          question: 'Qual é a sintaxe correta para uma função arrow em Dart?',
          options: [
            'A) int soma(a, b) -> a + b;',
            'B) int soma(int a, int b) => a + b;',
            'C) soma(a, b) = a + b;',
            'D) def soma(a, b): return a + b',
          ],
          correctIndex: 1,
        ),
        _QuizQuestion(
          question: 'Como acessar o valor da chave "nome" em um Map<String, String>?',
          options: ['A) map.nome', 'B) map.get("nome")', 'C) map["nome"]', 'D) map->nome'],
          correctIndex: 2,
        ),
      ];
    } else {
      return [
        _QuizQuestion(
          question: 'No Flutter, qual widget fornece a estrutura básica de uma tela com AppBar e body?',
          options: ['A) MaterialApp', 'B) Container', 'C) Scaffold', 'D) Center'],
          correctIndex: 2,
        ),
        _QuizQuestion(
          question: 'Qual widget organiza seus filhos na vertical?',
          options: ['A) Row', 'B) Stack', 'C) Wrap', 'D) Column'],
          correctIndex: 3,
        ),
        _QuizQuestion(
          question: 'Qual propriedade do ElevatedButton define a ação ao ser pressionado?',
          options: ['A) onTap', 'B) onClick', 'C) onPressed', 'D) onAction'],
          correctIndex: 2,
        ),
      ];
    }
  }

  void _checkAndAdvance() {
    if (_selectedIndex == null || _isTransitioning) return;

    final questions = _questions;
    final q = questions[_currentQuestion];
    bool isCorrect = _selectedIndex == q.correctIndex;

    setState(() {
      _isTransitioning = true;
      _lastAnswerCorrect = isCorrect;
      _showOverlay = true;
      if (isCorrect) _totalXP += 10;
    });

    _overlayController.forward(from: 0);

    Future.delayed(const Duration(milliseconds: 1600), () {
      if (!mounted) return;
      _overlayController.reverse().then((_) {
        if (!mounted) return;
        if (_currentQuestion < questions.length - 1) {
          setState(() {
            _currentQuestion++;
            _selectedIndex = null;
            _showOverlay = false;
            _isTransitioning = false;
          });
        } else {
          setState(() {
            _showOverlay = false;
            _isTransitioning = false;
          });
          _showCompletionDialog(context);
        }
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    final questions = _questions;
    final q = questions[_currentQuestion];
    double progress = (_currentQuestion + 1) / questions.length;

    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.home_rounded),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text('Quiz - ${widget.moduleTitle}', style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 16)),
      ),
      body: Stack(
        children: [
          // Conteúdo do Quiz
          Padding(
            padding: const EdgeInsets.all(20.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Título da questão
                Text(
                  'Questão ${_currentQuestion + 1}',
                  style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w800, color: Color(0xFF06B6D4)),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 12),

                // Progress bar + counter
                Row(
                  children: [
                    Expanded(
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(6),
                        child: LinearProgressIndicator(
                          value: progress,
                          backgroundColor: Colors.grey[800],
                          color: const Color(0xFF7C3AED),
                          minHeight: 8,
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: const Color(0xFF7C3AED).withOpacity(0.15),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        '${_currentQuestion + 1}/${questions.length}',
                        style: const TextStyle(fontWeight: FontWeight.w600, color: Color(0xFF7C3AED), fontSize: 13),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 24),

                // Question card
                Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xFF1E1048), Color(0xFF1E293B)],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: const Color(0xFF7C3AED).withOpacity(0.25)),
                  ),
                  child: Text(
                    q.question,
                    style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w600, height: 1.4),
                    textAlign: TextAlign.center,
                  ),
                ),
                const SizedBox(height: 24),

                // Options
                ...List.generate(q.options.length, (index) {
                  bool isSelected = _selectedIndex == index;
                  String letter = String.fromCharCode(65 + index);

                  Color bgColor = const Color(0xFF1E293B);
                  Color borderColor = Colors.grey[800]!;
                  Color letterBg = Colors.grey[800]!;
                  Color letterColor = Colors.grey;

                  if (isSelected) {
                    borderColor = const Color(0xFF06B6D4);
                    letterBg = const Color(0xFF06B6D4);
                    letterColor = Colors.white;
                  }

                  return GestureDetector(
                    onTap: _isTransitioning ? null : () => setState(() => _selectedIndex = index),
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 200),
                      margin: const EdgeInsets.only(bottom: 10),
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
                      decoration: BoxDecoration(
                        color: bgColor,
                        border: Border.all(color: borderColor, width: 1.5),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Row(
                        children: [
                          AnimatedContainer(
                            duration: const Duration(milliseconds: 200),
                            width: 32,
                            height: 32,
                            decoration: BoxDecoration(
                              color: letterBg,
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Center(child: Text(letter, style: TextStyle(fontWeight: FontWeight.w700, color: letterColor))),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Text(
                              q.options[index].substring(3),
                              style: const TextStyle(fontSize: 14, color: Colors.white),
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                }),

                const Spacer(),

                // Button
                Container(
                  decoration: BoxDecoration(
                    gradient: (_selectedIndex != null && !_isTransitioning)
                        ? const LinearGradient(colors: [Color(0xFF7C3AED), Color(0xFF6D28D9)])
                        : null,
                    color: (_selectedIndex == null || _isTransitioning) ? Colors.grey[800] : null,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.transparent,
                      shadowColor: Colors.transparent,
                      padding: const EdgeInsets.symmetric(vertical: 18),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    onPressed: (_selectedIndex == null || _isTransitioning) ? null : _checkAndAdvance,
                    child: Text(
                      'Confirmar',
                      style: TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w600,
                        color: (_selectedIndex != null && !_isTransitioning) ? Colors.white : Colors.grey,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),

          // Overlay de feedback (acerto/erro)
          if (_showOverlay)
            FadeTransition(
              opacity: _overlayFade,
              child: Container(
                color: Colors.black.withOpacity(0.7),
                child: Center(
                  child: ScaleTransition(
                    scale: _overlayScale,
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Container(
                          width: 120,
                          height: 120,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: (_lastAnswerCorrect! ? Colors.green : Colors.red).withOpacity(0.15),
                            border: Border.all(
                              color: _lastAnswerCorrect! ? Colors.green : Colors.red,
                              width: 3,
                            ),
                          ),
                          child: Icon(
                            _lastAnswerCorrect! ? Icons.check_rounded : Icons.close_rounded,
                            size: 64,
                            color: _lastAnswerCorrect! ? Colors.green : Colors.red,
                          ),
                        ),
                        const SizedBox(height: 24),
                        Text(
                          _lastAnswerCorrect! ? 'Correto!' : 'Incorreto',
                          style: TextStyle(
                            fontSize: 28,
                            fontWeight: FontWeight.w800,
                            color: _lastAnswerCorrect! ? Colors.green : Colors.red,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          _lastAnswerCorrect!
                              ? '+10 XP'
                              : 'Resposta: ${String.fromCharCode(65 + _questions[_currentQuestion].correctIndex)}',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                            color: (_lastAnswerCorrect! ? Colors.green : Colors.red).withOpacity(0.8),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }

  void _showCompletionDialog(BuildContext context) {
    bool allCorrect = _totalXP == _questions.length * 10;
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) {
        return AlertDialog(
          backgroundColor: const Color(0xFF1E293B),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const SizedBox(height: 8),
              Container(
                width: 80,
                height: 80,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: LinearGradient(
                    colors: allCorrect ? [Colors.amber, Colors.orange] : [const Color(0xFF7C3AED), const Color(0xFF06B6D4)],
                  ),
                ),
                child: Icon(
                  allCorrect ? Icons.military_tech_rounded : Icons.emoji_events_rounded,
                  size: 44,
                  color: Colors.white,
                ),
              ),
              const SizedBox(height: 20),
              Text(
                allCorrect ? 'Perfeito!' : 'Quiz Concluído!',
                style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w700),
              ),
              const SizedBox(height: 8),
              Text(
                'Você acertou ${_totalXP ~/ 10} de ${_questions.length} questões',
                style: TextStyle(color: Colors.grey[400], fontSize: 13),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                decoration: BoxDecoration(
                  color: Colors.amber.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: Colors.amber.withOpacity(0.3)),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.bolt, color: Colors.amber, size: 20),
                    const SizedBox(width: 6),
                    Text('+$_totalXP XP', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w700, color: Colors.amber)),
                  ],
                ),
              ),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                child: Container(
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(colors: [Color(0xFF7C3AED), Color(0xFF6D28D9)]),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.transparent,
                      shadowColor: Colors.transparent,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    onPressed: () {
                      Navigator.pop(context);
                      Navigator.pop(context);
                    },
                    child: const Text('Voltar para Início', style: TextStyle(fontWeight: FontWeight.w600, color: Colors.white)),
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
