import os
import sys
import shutil
from google import genai

# 1. Configuração de Ambiente
api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    print("Erro: Variável GEMINI_API_KEY não encontrada no PowerShell.")
    sys.exit(1)

client = genai.Client(api_key=api_key)
model_id = 'gemini-2.5-flash'

# Instrução de Sistema para focar em Automação e KUKA
sys_config = {
    "system_instruction": "Você é um assistente de Engenharia de Software e Automação Industrial. Ajude com códigos KRL, Python e estruturação de arquivos."
}

def ask_gemini(prompt_text):
    try:
        response = client.models.generate_content(
            model=model_id,
            contents=prompt_text,
            config=sys_config
        )
        return response.text
    except Exception as e:
        return f"Erro na API: {e}"

def main():
    args = sys.argv[1:]
    if not args:
        print("Uso: gemini 'sua pergunta' [--file caminho/do/arquivo] [criar/deletar nome_arquivo]")
        return

    # --- FUNCIONALIDADE: LEITURA DE ARQUIVOS (.src, .dat, .txt, .py) ---
    full_prompt = " ".join(args)
    if "--file" in args:
        file_idx = args.index("--file") + 1
        file_path = args[file_idx]
        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                full_prompt = f"Contexto do arquivo {file_path}:\n{content}\n\nPergunta: {full_prompt}"
        else:
            print(f"Arquivo {file_path} não encontrado.")

    # --- FUNCIONALIDADE: CRIAR ARQUIVO ---
    if "criar" in args:
        fname = args[args.index("criar") + 1]
        conteudo = ask_gemini(f"Gere apenas o código/conteúdo para um arquivo chamado {fname} baseado em: {full_prompt}")
        with open(fname, 'w', encoding='utf-8') as f:
            f.write(conteudo.strip().replace('```', '')) # Limpa markdown se a IA enviar
        print(f"✅ Arquivo '{fname}' criado com sucesso.")
        return

    # --- FUNCIONALIDADE: DELETAR (COM CONFIRMAÇÃO) ---
    if "deletar" in args:
        fname = args[args.index("deletar") + 1]
        if os.path.exists(fname):
            confirma = input(f"⚠️ Tem certeza que deseja deletar '{fname}'? (s/n): ")
            if confirma.lower() == 's':
                os.remove(fname)
                print(f"🗑️ '{fname}' removido.")
            else:
                print("Operação cancelada.")
        else:
            print("Arquivo não existe.")
        return

    # Resposta padrão de chat
    print("\n--- Resposta do Gemini ---")
    print(ask_gemini(full_prompt))

if __name__ == "__main__":
    main()