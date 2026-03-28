import 'package:flutter/material.dart';
import 'main_layout.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  bool _isLogin = true;

  void _navigate() {
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (context) => const MainLayout()),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Color(0xFF1E1048), Color(0xFF0F172A)],
          ),
        ),
        child: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 28),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // Logo
                  Container(
                    width: 80,
                    height: 80,
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFF7C3AED), Color(0xFF06B6D4)],
                      ),
                      borderRadius: BorderRadius.circular(20),
                      boxShadow: [
                        BoxShadow(color: const Color(0xFF7C3AED).withOpacity(0.3), blurRadius: 20),
                      ],
                    ),
                    child: const Icon(Icons.code_rounded, size: 40, color: Colors.white),
                  ),
                  const SizedBox(height: 16),
                  const Text('DevStage', style: TextStyle(fontSize: 28, fontWeight: FontWeight.w800, color: Color(0xFF06B6D4))),
                  const SizedBox(height: 40),

                  // Toggle Login/Cadastro
                  Container(
                    decoration: BoxDecoration(
                      color: const Color(0xFF1E293B),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Row(
                      children: [
                        Expanded(
                          child: GestureDetector(
                            onTap: () => setState(() => _isLogin = true),
                            child: AnimatedContainer(
                              duration: const Duration(milliseconds: 250),
                              padding: const EdgeInsets.symmetric(vertical: 14),
                              decoration: BoxDecoration(
                                gradient: _isLogin
                                    ? const LinearGradient(colors: [Color(0xFF7C3AED), Color(0xFF6D28D9)])
                                    : null,
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Text('Login', textAlign: TextAlign.center,
                                style: TextStyle(
                                  fontWeight: FontWeight.w600,
                                  color: _isLogin ? Colors.white : Colors.grey,
                                ),
                              ),
                            ),
                          ),
                        ),
                        Expanded(
                          child: GestureDetector(
                            onTap: () => setState(() => _isLogin = false),
                            child: AnimatedContainer(
                              duration: const Duration(milliseconds: 250),
                              padding: const EdgeInsets.symmetric(vertical: 14),
                              decoration: BoxDecoration(
                                gradient: !_isLogin
                                    ? const LinearGradient(colors: [Color(0xFF06B6D4), Color(0xFF0891B2)])
                                    : null,
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Text('Cadastro', textAlign: TextAlign.center,
                                style: TextStyle(
                                  fontWeight: FontWeight.w600,
                                  color: !_isLogin ? Colors.white : Colors.grey,
                                ),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 32),

                  // Form
                  AnimatedSwitcher(
                    duration: const Duration(milliseconds: 300),
                    child: _isLogin ? _buildLoginForm() : _buildRegisterForm(),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildLoginForm() {
    return Column(
      key: const ValueKey('login'),
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        _buildTextField('E-mail', Icons.email_outlined),
        const SizedBox(height: 16),
        _buildTextField('Senha', Icons.lock_outline, isPassword: true),
        const SizedBox(height: 28),
        _buildGradientButton('Entrar', const [Color(0xFF7C3AED), Color(0xFF6D28D9)]),
        const SizedBox(height: 16),
        TextButton(
          onPressed: () {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: const Text('Recuperação de senha simulada!'),
                backgroundColor: const Color(0xFF1E293B),
                behavior: SnackBarBehavior.floating,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
              ),
            );
          },
          child: const Text('Esqueci minha senha', style: TextStyle(color: Colors.grey)),
        ),
      ],
    );
  }

  Widget _buildRegisterForm() {
    return Column(
      key: const ValueKey('register'),
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        _buildTextField('Nome Completo', Icons.person_outline),
        const SizedBox(height: 16),
        _buildTextField('E-mail', Icons.email_outlined),
        const SizedBox(height: 16),
        _buildTextField('Senha', Icons.lock_outline, isPassword: true),
        const SizedBox(height: 28),
        _buildGradientButton('Cadastrar', const [Color(0xFF06B6D4), Color(0xFF0891B2)]),
      ],
    );
  }

  Widget _buildTextField(String label, IconData icon, {bool isPassword = false}) {
    return TextField(
      obscureText: isPassword,
      style: const TextStyle(color: Colors.white),
      decoration: InputDecoration(
        labelText: label,
        labelStyle: TextStyle(color: Colors.grey[500]),
        prefixIcon: Icon(icon, color: Colors.grey[600], size: 20),
        filled: true,
        fillColor: const Color(0xFF1E293B),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Color(0xFF7C3AED), width: 1.5),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 18),
      ),
    );
  }

  Widget _buildGradientButton(String text, List<Color> colors) {
    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(colors: colors),
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(color: colors[0].withOpacity(0.3), blurRadius: 12, offset: const Offset(0, 4)),
        ],
      ),
      child: ElevatedButton(
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.transparent,
          shadowColor: Colors.transparent,
          padding: const EdgeInsets.symmetric(vertical: 18),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        ),
        onPressed: _navigate,
        child: Text(text, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: Colors.white)),
      ),
    );
  }
}
