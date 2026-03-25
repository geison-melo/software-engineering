import 'package:flutter/material.dart';
import 'login_screen.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Perfil'),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            const CircleAvatar(
              radius: 50,
              backgroundColor: Color(0xFF7C3AED),
              child: Icon(Icons.person, size: 60, color: Colors.white),
            ),
            const SizedBox(height: 16),
            const Text('Dev Estagiário', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
            const Text('estagiario@devstage.com', style: TextStyle(color: Colors.grey)),
            const SizedBox(height: 24),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                _buildStatColumn('Nível Atual', 'Estagiário'),
                Container(height: 40, width: 1, color: Colors.grey[700]),
                _buildStatColumn('XP Total', '120 XP'),
              ],
            ),
            const SizedBox(height: 32),
            const Align(
              alignment: Alignment.centerLeft,
              child: Text('Minhas Insígnias', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            ),
            const SizedBox(height: 16),
            GridView.count(
              crossAxisCount: 4,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              mainAxisSpacing: 16,
              crossAxisSpacing: 16,
              children: [
                _buildBadge(Icons.code, isUnlocked: true),
                _buildBadge(Icons.check_circle, isUnlocked: true),
                _buildBadge(Icons.lock, isUnlocked: false),
                _buildBadge(Icons.lock, isUnlocked: false),
                _buildBadge(Icons.lock, isUnlocked: false),
                _buildBadge(Icons.lock, isUnlocked: false),
              ],
            ),
            const SizedBox(height: 32),
            const Align(
              alignment: Alignment.centerLeft,
              child: Text('Histórico', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            ),
            const SizedBox(height: 8),
            ListTile(
              leading: const Icon(Icons.history, color: Color(0xFF06B6D4)),
              title: const Text('Módulo Dart Básico concluído'),
              trailing: const Icon(Icons.check, color: Colors.green),
              tileColor: const Color(0xFF1E293B),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            ),
            const SizedBox(height: 32),
            SizedBox(
              width: double.infinity,
              child: TextButton(
                style: TextButton.styleFrom(
                  backgroundColor: Colors.redAccent.withOpacity(0.1),
                  padding: const EdgeInsets.symmetric(vertical: 16),
                ),
                onPressed: () {
                  Navigator.pushAndRemoveUntil(
                    context,
                    MaterialPageRoute(builder: (context) => const LoginScreen()),
                    (route) => false,
                  );
                },
                child: const Text('Sair', style: TextStyle(color: Colors.redAccent, fontSize: 16)),
              ),
            ),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }

  Widget _buildStatColumn(String label, String value) {
    return Column(
      children: [
        Text(label, style: const TextStyle(color: Colors.grey, fontSize: 14)),
        const SizedBox(height: 4),
        Text(value, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: Color(0xFF06B6D4))),
      ],
    );
  }

  Widget _buildBadge(IconData icon, {required bool isUnlocked}) {
    return Container(
      decoration: BoxDecoration(
        color: isUnlocked ? const Color(0xFF1E293B) : Colors.grey[900],
        border: Border.all(color: isUnlocked ? const Color(0xFF7C3AED) : Colors.grey[800]!),
        shape: BoxShape.circle,
      ),
      child: Center(
        child: Icon(icon, color: isUnlocked ? const Color(0xFF7C3AED) : Colors.grey[700]),
      ),
    );
  }
}
