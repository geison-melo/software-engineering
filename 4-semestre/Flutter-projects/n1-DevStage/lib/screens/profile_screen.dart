import 'package:flutter/material.dart';
import '../routes/app_routes.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Row(
          children: [
            Icon(Icons.person_rounded, color: Color(0xFF06B6D4), size: 22),
            SizedBox(width: 10),
            Text('Perfil', style: TextStyle(fontWeight: FontWeight.w700)),
          ],
        ),
        centerTitle: false,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            // Avatar + Info
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF1E1048), Color(0xFF1E293B)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFF7C3AED).withOpacity(0.3)),
              ),
              child: Column(
                children: [
                  Container(
                    padding: const EdgeInsets.all(3),
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      gradient: const LinearGradient(colors: [Color(0xFF7C3AED), Color(0xFF06B6D4)]),
                    ),
                    child: const CircleAvatar(
                      radius: 44,
                      backgroundColor: Color(0xFF1E293B),
                      child: Icon(Icons.person_rounded, size: 50, color: Colors.white70),
                    ),
                  ),
                  const SizedBox(height: 16),
                  const Text('Dev Estagiário', style: TextStyle(fontSize: 22, fontWeight: FontWeight.w700)),
                  const SizedBox(height: 4),
                  Text('estagiario@devstage.com', style: TextStyle(color: Colors.grey[500], fontSize: 13)),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Stats
            Row(
              children: [
                _buildStatCard('Nível', 'Estagiário', Icons.workspace_premium, const Color(0xFF7C3AED)),
                const SizedBox(width: 12),
                _buildStatCard('XP Total', '120', Icons.bolt, Colors.amber),
                const SizedBox(width: 12),
                _buildStatCard('Streak', '3 dias', Icons.local_fire_department, Colors.orange),
              ],
            ),
            const SizedBox(height: 28),

            // Insígnias
            _buildSectionTitle('Minhas Insígnias'),
            const SizedBox(height: 14),
            GridView.count(
              crossAxisCount: 4,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              mainAxisSpacing: 14,
              crossAxisSpacing: 14,
              children: [
                _buildBadge(Icons.code, 'Dart', isUnlocked: true),
                _buildBadge(Icons.check_circle_outline, 'Hello World', isUnlocked: true),
                _buildBadge(Icons.layers, 'Flutter UI', isUnlocked: false),
                _buildBadge(Icons.cloud, 'Firebase', isUnlocked: false),
                _buildBadge(Icons.sync_alt, 'State', isUnlocked: false),
                _buildBadge(Icons.api, 'APIs', isUnlocked: false),
              ],
            ),
            const SizedBox(height: 28),

            // Histórico
            _buildSectionTitle('Histórico de Módulos'),
            const SizedBox(height: 14),
            _buildHistoryItem('Dart Básico', 'Concluído', true),
            const SizedBox(height: 8),
            _buildHistoryItem('Flutter UI', 'Em andamento', false),
            const SizedBox(height: 32),

            // Logout
            SizedBox(
              width: double.infinity,
              child: Container(
                decoration: BoxDecoration(
                  color: Colors.redAccent.withOpacity(0.08),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.redAccent.withOpacity(0.2)),
                ),
                child: TextButton.icon(
                  onPressed: () {
                    Navigator.pushNamedAndRemoveUntil(
                      context,
                      AppRoutes.login,
                      (route) => false,
                    );
                  },
                  icon: const Icon(Icons.logout_rounded, color: Colors.redAccent, size: 18),
                  label: const Text('Sair da Conta', style: TextStyle(color: Colors.redAccent, fontWeight: FontWeight.w600)),
                  style: TextButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 16)),
                ),
              ),
            ),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Align(
      alignment: Alignment.centerLeft,
      child: Text(title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w700)),
    );
  }

  Widget _buildStatCard(String label, String value, IconData icon, Color color) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: color.withOpacity(0.08),
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: color.withOpacity(0.2)),
        ),
        child: Column(
          children: [
            Icon(icon, color: color, size: 22),
            const SizedBox(height: 8),
            Text(value, style: TextStyle(fontWeight: FontWeight.w700, fontSize: 15, color: color)),
            const SizedBox(height: 2),
            Text(label, style: TextStyle(fontSize: 10, color: Colors.grey[500])),
          ],
        ),
      ),
    );
  }

  Widget _buildBadge(IconData icon, String label, {required bool isUnlocked}) {
    return Column(
      children: [
        Expanded(
          child: Container(
            decoration: BoxDecoration(
              color: isUnlocked ? const Color(0xFF7C3AED).withOpacity(0.1) : Colors.grey[900],
              border: Border.all(color: isUnlocked ? const Color(0xFF7C3AED).withOpacity(0.5) : Colors.grey[800]!),
              shape: BoxShape.circle,
            ),
            child: Center(
              child: Icon(
                isUnlocked ? icon : Icons.lock_rounded,
                color: isUnlocked ? const Color(0xFF7C3AED) : Colors.grey[700],
                size: 22,
              ),
            ),
          ),
        ),
        const SizedBox(height: 4),
        Text(label, style: TextStyle(fontSize: 9, color: isUnlocked ? Colors.white70 : Colors.grey[700]), overflow: TextOverflow.ellipsis),
      ],
    );
  }

  Widget _buildHistoryItem(String title, String status, bool done) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: done ? Colors.green.withOpacity(0.2) : const Color(0xFF06B6D4).withOpacity(0.15)),
      ),
      child: Row(
        children: [
          Icon(done ? Icons.check_circle_rounded : Icons.access_time_rounded, color: done ? Colors.green : const Color(0xFF06B6D4), size: 20),
          const SizedBox(width: 12),
          Expanded(child: Text(title, style: const TextStyle(fontWeight: FontWeight.w500))),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: (done ? Colors.green : const Color(0xFF06B6D4)).withOpacity(0.1),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Text(status, style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: done ? Colors.green : const Color(0xFF06B6D4))),
          ),
        ],
      ),
    );
  }
}
