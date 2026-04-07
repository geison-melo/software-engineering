import 'package:flutter/material.dart';
import '../screens/splash_screen.dart';
import '../screens/login_screen.dart';
import '../screens/main_layout.dart';
import '../screens/content_screen.dart';
import '../screens/quiz_screen.dart';

class AppRoutes {
  static const String splash = '/';
  static const String login = '/login';
  static const String main = '/main';
  static const String content = '/content';
  static const String quiz = '/quiz';

  static Route<dynamic> generateRoute(RouteSettings settings) {
    switch (settings.name) {
      case splash:
        return MaterialPageRoute(builder: (_) => const SplashScreen());
      case login:
        return MaterialPageRoute(builder: (_) => const LoginScreen());
      case main:
        return MaterialPageRoute(builder: (_) => const MainLayout());
      case content:
        final moduleTitle = settings.arguments as String;
        return MaterialPageRoute(
          builder: (_) => ContentScreen(moduleTitle: moduleTitle),
        );
      case quiz:
        final moduleTitle = settings.arguments as String;
        return MaterialPageRoute(
          builder: (_) => QuizScreen(moduleTitle: moduleTitle),
        );
      default:
        return MaterialPageRoute(
          builder: (_) => Scaffold(
            body: Center(child: Text('Rota não definida: ${settings.name}')),
          ),
        );
    }
  }
}
