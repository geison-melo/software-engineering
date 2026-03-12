import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'MyNotes',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: Colors.deepPurple,
          brightness: Brightness.light,
        ),
        useMaterial3: true,
      ),
      home: const HomeScreen(),
    );
  }
}

class Anotacao {
  final String titulo;
  final String dataModificacao;

  const Anotacao({
    required this.titulo,
    required this.dataModificacao,
  });
}

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  static const List<Anotacao> anotacoes = [
    Anotacao(titulo: 'Lista de Compras', dataModificacao: '10/03/2026'),
    Anotacao(titulo: 'Ideias para o Projeto', dataModificacao: '08/03/2026'),
    Anotacao(titulo: 'Anotações da Aula de Flutter', dataModificacao: '07/03/2026'),
    Anotacao(titulo: 'Planejamento da Semana', dataModificacao: '06/03/2026'),
  ];

  void _mostrarDialogoConfirmacao(BuildContext context, Anotacao anotacao) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Abrir Anotação'),
          content: Text('Deseja abrir "${anotacao.titulo}"?'),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('Cancelar'),
            ),
            FilledButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: const Text('Abrir'),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'MyNotes',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
        backgroundColor: Theme.of(context).colorScheme.primaryContainer,
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(12),
        itemCount: anotacoes.length,
        itemBuilder: (context, index) {
          final anotacao = anotacoes[index];
          return Card(
            elevation: 2,
            margin: const EdgeInsets.only(bottom: 10),
            child: ListTile(
              leading: Icon(
                Icons.description_outlined,
                color: Theme.of(context).colorScheme.primary,
                size: 32,
              ),
              title: Text(
                anotacao.titulo,
                style: const TextStyle(
                  fontWeight: FontWeight.w600,
                  fontSize: 16,
                ),
              ),
              subtitle: Text(
                'Modificado em ${anotacao.dataModificacao}',
                style: TextStyle(
                  color: Colors.grey[600],
                  fontSize: 13,
                ),
              ),
              trailing: const Icon(Icons.chevron_right),
              onTap: () => _mostrarDialogoConfirmacao(context, anotacao),
            ),
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {},
        child: const Icon(Icons.add),
      ),
    );
  }
}
