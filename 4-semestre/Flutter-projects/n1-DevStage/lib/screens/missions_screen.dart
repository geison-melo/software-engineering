import 'package:flutter/material.dart';

class MissionsScreen extends StatelessWidget {
  const MissionsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 3,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Missões'),
          bottom: const TabBar(
            isScrollable: true,
            tabs: [
              Tab(text: 'Em andamento'),
              Tab(text: 'Disponíveis'),
              Tab(text: 'Concluídas'),
            ],
            indicatorColor: Color(0xFF7C3AED),
          ),
        ),
        body: TabBarView(
          children: [
            _buildMissionsList(context, [
              _MissionMock(title: 'Mestre do Dart', xp: 50, progress: 0.5, actionText: 'Continuar'),
              _MissionMock(title: 'Primeira Tela', xp: 80, progress: 0.2, actionText: 'Continuar'),
            ]),
            _buildMissionsList(context, [
              _MissionMock(title: 'Firebase Auth', xp: 120, progress: 0.0, actionText: 'Iniciar'),
            ]),
            _buildMissionsList(context, [
              _MissionMock(title: 'Hello World', xp: 20, progress: 1.0, actionText: 'Revisar'),
            ]),
          ],
        ),
      ),
    );
  }

  Widget _buildMissionsList(BuildContext context, List<_MissionMock> missions) {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: missions.length,
      itemBuilder: (context, index) {
        final mission = missions[index];
        return Card(
          margin: const EdgeInsets.only(bottom: 12),
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(Icons.military_tech, color: Color(0xFF06B6D4), size: 32),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(mission.title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                          Text('${(mission.progress * 100).toInt()}% • ${mission.xp} XP', style: const TextStyle(color: Colors.grey)),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                LinearProgressIndicator(
                  value: mission.progress,
                  backgroundColor: Colors.grey[800],
                  color: const Color(0xFF7C3AED),
                  minHeight: 6,
                ),
                const SizedBox(height: 16),
                Align(
                  alignment: Alignment.centerRight,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF1E293B),
                      side: const BorderSide(color: Color(0xFF7C3AED)),
                    ),
                    onPressed: () {},
                    child: Text(mission.actionText, style: const TextStyle(color: Colors.white)),
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
  final int xp;
  final double progress;
  final String actionText;

  _MissionMock({required this.title, required this.xp, required this.progress, required this.actionText});
}
