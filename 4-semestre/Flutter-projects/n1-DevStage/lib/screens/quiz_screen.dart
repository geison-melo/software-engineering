import 'package:flutter/material.dart';

class QuizScreen extends StatefulWidget {
  final String moduleTitle;
  const QuizScreen({super.key, required this.moduleTitle});

  @override
  State<QuizScreen> createState() => _QuizScreenState();
}

class _QuizScreenState extends State<QuizScreen> {
  int? _selectedIndex;
  bool _isAnswerChecked = false;

  final List<String> _options = [
    'A) Uma linguagem de marcação',
    'B) O SDK de UI do Google',
    'C) Um banco de dados',
    'D) Um sistema operacional',
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Quiz - ${widget.moduleTitle}'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text(
              'Questão 1 / 1',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  children: const [
                    Text(
                      'O que é Flutter?',
                      style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 32),
            ...List.generate(_options.length, (index) {
              bool isSelected = _selectedIndex == index;
              bool isCorrect = index == 1; // Option B is correct
              
              Color bgColor = const Color(0xFF1E293B);
              Color borderColor = Colors.grey[800]!;

              if (_isAnswerChecked) {
                if (index == _selectedIndex) {
                  bgColor = isCorrect ? Colors.green.withOpacity(0.2) : Colors.red.withOpacity(0.2);
                  borderColor = isCorrect ? Colors.green : Colors.red;
                } else if (isCorrect) {
                  bgColor = Colors.green.withOpacity(0.2);
                  borderColor = Colors.green;
                }
              } else if (isSelected) {
                borderColor = const Color(0xFF06B6D4);
              }

              return GestureDetector(
                onTap: _isAnswerChecked ? null : () {
                  setState(() {
                    _selectedIndex = index;
                  });
                },
                child: Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                  decoration: BoxDecoration(
                    color: bgColor,
                    border: Border.all(color: borderColor, width: 2),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    children: [
                      Icon(
                        isSelected ? Icons.radio_button_checked : Icons.radio_button_off,
                        color: borderColor,
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          _options[index],
                          style: TextStyle(fontSize: 16, color: _isAnswerChecked && isCorrect ? Colors.greenAccent : Colors.white),
                        ),
                      ),
                      if (_isAnswerChecked && isSelected)
                        Icon(isCorrect ? Icons.check_circle : Icons.cancel, color: borderColor),
                    ],
                  ),
                ),
              );
            }),
            const Spacer(),
            if (_isAnswerChecked && _selectedIndex != null)
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: _selectedIndex == 1 ? Colors.green.withOpacity(0.1) : Colors.red.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  _selectedIndex == 1 ? 'Correto! Você ganhou +50 XP.' : 'Incorreto. Revise o material.',
                  style: TextStyle(
                    color: _selectedIndex == 1 ? Colors.green : Colors.red,
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                  textAlign: TextAlign.center,
                ),
              ),
            const SizedBox(height: 16),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF7C3AED),
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
              ),
              onPressed: _selectedIndex == null ? null : () {
                if (!_isAnswerChecked) {
                  setState(() {
                    _isAnswerChecked = true;
                  });
                } else {
                  bool isCorrect = _selectedIndex == 1; // Option B
                  _showCompletionDialog(context, isCorrect);
                }
              },
              child: Text(
                _isAnswerChecked ? 'Finalizar' : 'Verificar Resposta',
                style: const TextStyle(fontSize: 16, color: Colors.white),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showCompletionDialog(BuildContext context, bool isCorrect) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) {
        return AlertDialog(
          backgroundColor: const Color(0xFF1E293B),
          title: Text(isCorrect ? 'Módulo Concluído!' : 'Fim do Quiz', textAlign: TextAlign.center, style: const TextStyle(color: Color(0xFF06B6D4))),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(isCorrect ? Icons.military_tech : Icons.cancel_outlined, size: 80, color: isCorrect ? Colors.orange : Colors.redAccent),
              const SizedBox(height: 16),
              Text(isCorrect ? '+50 XP' : '0 XP', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: isCorrect ? Colors.yellow : Colors.grey)),
            ],
          ),
          actions: [
            Center(
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF7C3AED)),
                onPressed: () {
                  Navigator.pop(context); // close dialog
                  Navigator.pop(context); // back to home layout (ContentScreen was pushReplaced)
                },
                child: const Text('Voltar para Início', style: TextStyle(color: Colors.white)),
              ),
            ),
          ],
        );
      },
    );
  }
}
