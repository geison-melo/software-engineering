import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'routes/app_routes.dart';

void main() {
  runApp(const DevStageApp());
}

class DevStageApp extends StatelessWidget {
  const DevStageApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'DevStage',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF0F172A), // Dark slate
        primaryColor: const Color(0xFF7C3AED), // Vibrant purple
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFF7C3AED),
          secondary: Color(0xFF06B6D4), // Cyan
          surface: Color(0xFF1E293B), // Lighter slate for cards
        ),
        textTheme: GoogleFonts.interTextTheme(
          Theme.of(context).textTheme.apply(
            bodyColor: Colors.white,
            displayColor: Colors.white,
          ),
        ),
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFF0F172A),
          elevation: 0,
        ),
        bottomNavigationBarTheme: const BottomNavigationBarThemeData(
          backgroundColor: Color(0xFF1E293B),
          selectedItemColor: Color(0xFF06B6D4),
          unselectedItemColor: Colors.grey,
        ),
        cardTheme: CardThemeData(
          color: const Color(0xFF1E293B),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          elevation: 4,
        ),
      ),
      initialRoute: AppRoutes.splash,
      onGenerateRoute: AppRoutes.generateRoute,
    );
  }
}
