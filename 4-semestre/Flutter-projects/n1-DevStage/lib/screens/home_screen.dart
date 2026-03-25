import 'package:flutter/material.dart';
import 'content_screen.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Olá, Estagiário!'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Nível e XP Card
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: const [
                        Text('Nível: Estagiário', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
                        Text('120 / 500 XP', style: TextStyle(color: Color(0xFF06B6D4))),
                      ],
                    ),
                    const SizedBox(height: 12),
                    LinearProgressIndicator(
                      value: 120 / 500,
                      backgroundColor: Colors.grey[800],
                      color: const Color(0xFF7C3AED),
                      minHeight: 8,
                      borderRadius: BorderRadius.circular(4),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            
            // Streak Chip
            Chip(
              avatar: const Icon(Icons.local_fire_department, color: Colors.orange, size: 20),
              label: const Text('Streak: 3 dias', style: TextStyle(fontWeight: FontWeight.bold)),
              backgroundColor: const Color(0xFF1E293B),
              side: const BorderSide(color: Colors.orange, width: 1),
            ),
            const SizedBox(height: 24),
            
            const Text('Módulos de Estudo', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            
            // Modules List
            _buildModuleCard(
              context,
              title: 'Dart Básico',
              icon: Icons.code,
              progress: 0.8,
              isLocked: false,
            ),
            _buildModuleCard(
              context,
              title: 'Flutter UI',
              icon: Icons.layers,
              progress: 0.4,
              isLocked: false,
            ),
            _buildModuleCard(
              context,
              title: 'Firebase Integr...',
              icon: Icons.cloud,
              progress: 0.0,
              isLocked: true,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildModuleCard(BuildContext context, {required String title, required IconData icon, required double progress, required bool isLocked}) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: ListTile(
        leading: Icon(icon, color: isLocked ? Colors.grey : const Color(0xFF06B6D4), size: 32),
        title: Text(title, style: TextStyle(color: isLocked ? Colors.grey : Colors.white)),
        subtitle: isLocked 
          ? const Text('Bloqueado', style: TextStyle(color: Colors.redAccent))
          : Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: LinearProgressIndicator(
                        value: progress,
                        backgroundColor: Colors.grey[800],
                        color: const Color(0xFF06B6D4), // Cyan for progress
                      ),
                    ),
                    const SizedBox(width: 8),
                    Text('${(progress * 100).toInt()}%', style: const TextStyle(fontSize: 12)),
                  ],
                ),
              ],
            ),
        trailing: isLocked ? const Icon(Icons.lock, color: Colors.grey) : const Icon(Icons.chevron_right),
        onTap: isLocked ? null : () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => ContentScreen(moduleTitle: title)),
          );
        },
      ),
    );
  }
}
