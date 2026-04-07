import 'package:flutter/material.dart';
import '../routes/app_routes.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _fadeIn;
  late Animation<double> _scale;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: const Duration(milliseconds: 1200));
    _fadeIn = Tween<double>(begin: 0, end: 1).animate(CurvedAnimation(parent: _controller, curve: Curves.easeIn));
    _scale = Tween<double>(begin: 0.8, end: 1.0).animate(CurvedAnimation(parent: _controller, curve: Curves.easeOutBack));
    _controller.forward();

    Future.delayed(const Duration(seconds: 3), () {
      if (mounted) {
        Navigator.pushReplacementNamed(context, AppRoutes.login);
      }
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Container(
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [Color(0xFF0F172A), Color(0xFF1E1048), Color(0xFF0F172A)],
            ),
          ),
          child: Center(
            child: FadeTransition(
              opacity: _fadeIn,
              child: ScaleTransition(
                scale: _scale,
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      width: 130,
                      height: 130,
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [Color(0xFF7C3AED), Color(0xFF06B6D4)],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        borderRadius: BorderRadius.circular(28),
                        boxShadow: [
                          BoxShadow(color: const Color(0xFF7C3AED).withOpacity(0.4), blurRadius: 30, spreadRadius: 2),
                        ],
                      ),
                      child: const Icon(Icons.code_rounded, size: 64, color: Colors.white),
                    ),
                    const SizedBox(height: 32),
                    ShaderMask(
                      shaderCallback: (bounds) => const LinearGradient(
                        colors: [Color(0xFF7C3AED), Color(0xFF06B6D4)],
                      ).createShader(bounds),
                      child: const Text(
                        'DevStage',
                        style: TextStyle(fontSize: 40, fontWeight: FontWeight.w800, color: Colors.white, letterSpacing: 1.5),
                      ),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'Sua Jornada Flutter Começa Aqui',
                      style: TextStyle(fontSize: 14, color: Colors.grey, letterSpacing: 0.5),
                    ),
                    const SizedBox(height: 60),
                    SizedBox(
                      width: 32,
                      height: 32,
                      child: CircularProgressIndicator(
                        strokeWidth: 2.5,
                        color: const Color(0xFF7C3AED).withOpacity(0.7),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
