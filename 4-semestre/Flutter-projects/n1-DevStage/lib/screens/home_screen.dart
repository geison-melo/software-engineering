import 'package:flutter/material.dart';
import '../routes/app_routes.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () {
            Navigator.pushNamedAndRemoveUntil(
              context,
              AppRoutes.login,
              (route) => false,
            );
          },
        ),
        title: Row(
          children: [
            Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                gradient: const LinearGradient(colors: [Color(0xFF7C3AED), Color(0xFF06B6D4)]),
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(Icons.code_rounded, size: 18, color: Colors.white),
            ),
            const SizedBox(width: 12),
            const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Olá, Estagiário!', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
                Text('Continue sua jornada', style: TextStyle(fontSize: 11, color: Colors.grey)),
              ],
            ),
          ],
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // XP Card
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
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
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: const Color(0xFF7C3AED).withOpacity(0.2),
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(color: const Color(0xFF7C3AED).withOpacity(0.5)),
                            ),
                            child: const Row(
                              children: [
                                Icon(Icons.workspace_premium, size: 14, color: Color(0xFF7C3AED)),
                                SizedBox(width: 4),
                                Text('Estagiário', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Color(0xFF7C3AED))),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const Text('120 / 500 XP', style: TextStyle(fontWeight: FontWeight.w700, color: Color(0xFF06B6D4), fontSize: 15)),
                    ],
                  ),
                  const SizedBox(height: 16),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(6),
                    child: LinearProgressIndicator(
                      value: 120 / 500,
                      backgroundColor: Colors.grey[800]!.withOpacity(0.5),
                      color: const Color(0xFF7C3AED),
                      minHeight: 10,
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text('380 XP para Júnior', style: TextStyle(fontSize: 11, color: Colors.grey)),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Streak
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              decoration: BoxDecoration(
                color: Colors.orange.withOpacity(0.08),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.orange.withOpacity(0.3)),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.local_fire_department, color: Colors.orange, size: 22),
                  const SizedBox(width: 8),
                  const Text('3 dias seguidos!', style: TextStyle(fontWeight: FontWeight.w600, color: Colors.orange)),
                ],
              ),
            ),
            const SizedBox(height: 28),

            // Section title
            const Row(
              children: [
                Icon(Icons.auto_stories, color: Color(0xFF06B6D4), size: 20),
                SizedBox(width: 8),
                Text('Módulos de Estudo', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700)),
              ],
            ),
            const SizedBox(height: 16),

            _buildModuleCard(context, title: 'Dart Básico', subtitle: 'Variáveis, funções e coleções', icon: Icons.code, progress: 0.8, isLocked: false),
            _buildModuleCard(context, title: 'Flutter UI', subtitle: 'Widgets, layouts e interações', icon: Icons.layers, progress: 0.4, isLocked: false),
            _buildModuleCard(context, title: 'Firebase', subtitle: 'Auth, Firestore e Cloud', icon: Icons.cloud, progress: 0.0, isLocked: true),
          ],
        ),
      ),
    );
  }

  Widget _buildModuleCard(BuildContext context, {
    required String title,
    required String subtitle,
    required IconData icon,
    required double progress,
    required bool isLocked,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: isLocked ? Colors.grey[800]! : const Color(0xFF7C3AED).withOpacity(0.2)),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(14),
          onTap: isLocked ? null : () {
            Navigator.pushNamed(context, AppRoutes.content, arguments: title);
          },
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: isLocked ? Colors.grey[850] : const Color(0xFF06B6D4).withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: isLocked ? Colors.grey[800]! : const Color(0xFF06B6D4).withOpacity(0.3)),
                  ),
                  child: Icon(icon, color: isLocked ? Colors.grey[700] : const Color(0xFF06B6D4), size: 24),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(title, style: TextStyle(fontWeight: FontWeight.w600, fontSize: 16, color: isLocked ? Colors.grey : Colors.white)),
                      const SizedBox(height: 2),
                      Text(subtitle, style: TextStyle(fontSize: 12, color: isLocked ? Colors.grey[700] : Colors.grey)),
                      if (!isLocked) ...[
                        const SizedBox(height: 10),
                        Row(
                          children: [
                            Expanded(
                              child: ClipRRect(
                                borderRadius: BorderRadius.circular(4),
                                child: LinearProgressIndicator(
                                  value: progress,
                                  backgroundColor: Colors.grey[800],
                                  color: const Color(0xFF06B6D4),
                                  minHeight: 6,
                                ),
                              ),
                            ),
                            const SizedBox(width: 10),
                            Text('${(progress * 100).toInt()}%', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Color(0xFF06B6D4))),
                          ],
                        ),
                      ] else
                        const Padding(
                          padding: EdgeInsets.only(top: 4),
                          child: Row(
                            children: [
                              Icon(Icons.lock_rounded, size: 14, color: Colors.redAccent),
                              SizedBox(width: 4),
                              Text('Bloqueado', style: TextStyle(fontSize: 12, color: Colors.redAccent)),
                            ],
                          ),
                        ),
                    ],
                  ),
                ),
                if (!isLocked)
                  const Icon(Icons.chevron_right_rounded, color: Colors.grey),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
