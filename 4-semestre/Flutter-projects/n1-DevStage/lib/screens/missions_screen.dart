import 'package:flutter/material.dart';

class MissionsScreen extends StatelessWidget {
  const MissionsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 3,
      child: Scaffold(
        appBar: AppBar(
          title: const Row(
            children: [
              Icon(Icons.assignment_rounded, color: Color(0xFF06B6D4), size: 22),
              SizedBox(width: 10),
              Text('Missões', style: TextStyle(fontWeight: FontWeight.w700)),
            ],
          ),
          bottom: TabBar(
            dividerColor: Colors.transparent,
            indicatorSize: TabBarIndicatorSize.tab,
            indicator: BoxDecoration(
              borderRadius: BorderRadius.circular(10),
              color: const Color(0xFF7C3AED).withOpacity(0.15),
            ),
            labelColor: const Color(0xFF7C3AED),
            unselectedLabelColor: Colors.grey,
            labelStyle: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13),
            tabs: const [
              Tab(text: 'Em andamento'),
              Tab(text: 'Disponíveis'),
              Tab(text: 'Concluídas'),
            ],
          ),
        ),
        body: TabBarView(
          children: [
            _buildMissionsList([
              _MissionMock(title: 'Mestre do Dart', desc: 'Complete todos os exercícios de Dart', xp: 50, progress: 0.5, actionText: 'Continuar', icon: Icons.code),
              _MissionMock(title: 'Primeira Tela', desc: 'Construa seu primeiro layout Flutter', xp: 80, progress: 0.2, actionText: 'Continuar', icon: Icons.layers),
            ]),
            _buildMissionsList([
              _MissionMock(title: 'Firebase Auth', desc: 'Implemente autenticação com Firebase', xp: 120, progress: 0.0, actionText: 'Iniciar', icon: Icons.cloud),
              _MissionMock(title: 'State Master', desc: 'Domine o gerenciamento de estado', xp: 100, progress: 0.0, actionText: 'Iniciar', icon: Icons.sync_alt),
            ]),
            _buildMissionsList([
              _MissionMock(title: 'Hello World', desc: 'Rode seu primeiro app Flutter', xp: 20, progress: 1.0, actionText: 'Revisar', icon: Icons.check_circle_outline),
            ]),
          ],
        ),
      ),
    );
  }

  Widget _buildMissionsList(List<_MissionMock> missions) {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: missions.length,
      itemBuilder: (context, index) {
        final m = missions[index];
        bool isDone = m.progress >= 1.0;
        return Container(
          margin: const EdgeInsets.only(bottom: 14),
          decoration: BoxDecoration(
            color: const Color(0xFF1E293B),
            borderRadius: BorderRadius.circular(14),
            border: Border.all(
              color: isDone ? Colors.green.withOpacity(0.3) : const Color(0xFF7C3AED).withOpacity(0.15),
            ),
          ),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      width: 44,
                      height: 44,
                      decoration: BoxDecoration(
                        color: isDone
                            ? Colors.green.withOpacity(0.1)
                            : const Color(0xFF06B6D4).withOpacity(0.1),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Icon(m.icon, color: isDone ? Colors.green : const Color(0xFF06B6D4), size: 22),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(m.title, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
                          const SizedBox(height: 2),
                          Text(m.desc, style: TextStyle(fontSize: 12, color: Colors.grey[500])),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.amber.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(Icons.bolt, color: Colors.amber, size: 14),
                          Text('${m.xp} XP', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Colors.amber)),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(4),
                        child: LinearProgressIndicator(
                          value: m.progress,
                          backgroundColor: Colors.grey[800],
                          color: isDone ? Colors.green : const Color(0xFF7C3AED),
                          minHeight: 6,
                        ),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Text('${(m.progress * 100).toInt()}%', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: isDone ? Colors.green : Colors.grey)),
                  ],
                ),
                const SizedBox(height: 14),
                Align(
                  alignment: Alignment.centerRight,
                  child: Container(
                    decoration: BoxDecoration(
                      gradient: isDone
                          ? null
                          : const LinearGradient(colors: [Color(0xFF7C3AED), Color(0xFF6D28D9)]),
                      color: isDone ? Colors.green.withOpacity(0.1) : null,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.transparent,
                        shadowColor: Colors.transparent,
                        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                      onPressed: () {},
                      child: Text(m.actionText, style: TextStyle(color: isDone ? Colors.green : Colors.white, fontWeight: FontWeight.w600, fontSize: 13)),
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}

class _MissionMock {
  final String title;
  final String desc;
  final int xp;
  final double progress;
  final String actionText;
  final IconData icon;

  _MissionMock({required this.title, required this.desc, required this.xp, required this.progress, required this.actionText, required this.icon});
}
