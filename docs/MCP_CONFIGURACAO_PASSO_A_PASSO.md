# 🎯 MCP Server - Configuração Passo a Passo

**IMPORTANTE:** Faça isso **UMA VEZ** para habilitar o Copilot a executar testes automaticamente.

---

## 📍 Localização do Arquivo

### Windows

O arquivo de configuração fica em:
```
%APPDATA%\Code\User\globalStorage\github.copilot-chat\mcpServers.json
```

**Caminho completo (exemplo):**
```
C:\Users\[SEU_USUARIO]\AppData\Roaming\Code\User\globalStorage\github.copilot-chat\mcpServers.json
```

### Como Chegar Lá?

#### Método 1: Pelo Explorador de Arquivos

1. Pressione `Win + R` (Executar)
2. Cole: `%APPDATA%\Code\User\globalStorage\github.copilot-chat`
3. Pressione Enter
4. Se a pasta **não existir**, crie-a manualmente

#### Método 2: Pelo Terminal

```powershell
# Criar a pasta (se não existir)
mkdir "$env:APPDATA\Code\User\globalStorage\github.copilot-chat" -Force

# Navegar até a pasta
cd "$env:APPDATA\Code\User\globalStorage\github.copilot-chat"

# Criar o arquivo
notepad mcpServers.json
```

---

## 📝 Conteúdo do Arquivo

Cole **exatamente** este conteúdo no arquivo `mcpServers.json`:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-playwright"
      ],
      "env": {
        "PLAYWRIGHT_CONFIG": "playwright.config.ts"
      }
    }
  }
}
```

**⚠️ IMPORTANTE:**
- Copie e cole EXATAMENTE como está acima
- Não altere nenhuma vírgula, aspas ou colchetes
- Salve o arquivo como `mcpServers.json` (não `.txt`)

---

## 🔄 Passo a Passo Visual

### 1️⃣ Abrir o Executar
![Win + R]
```
Pressione: Win + R
```

### 2️⃣ Colar o Caminho
```
Cole: %APPDATA%\Code\User\globalStorage\github.copilot-chat
Pressione: Enter
```

### 3️⃣ Se a Pasta Não Existir
```
Clique com botão direito no Explorador
Novo > Pasta
Nome: github.copilot-chat
```

### 4️⃣ Criar o Arquivo
```
Botão direito na pasta > Novo > Documento de Texto
Renomear para: mcpServers.json
Confirmar mudança de extensão
```

### 5️⃣ Editar o Arquivo
```
Botão direito em mcpServers.json > Abrir com > Notepad
Cole o conteúdo JSON acima
Salvar (Ctrl + S)
Fechar
```

### 6️⃣ Reiniciar VS Code
```
Feche TODAS as janelas do VS Code
Abra novamente
Aguarde 10 segundos
```

---

## ✅ Verificar se Funcionou

### Teste 1: Verificar MCP no Copilot

1. Abra o GitHub Copilot Chat
2. Digite:
   ```
   @workspace Você tem acesso ao Playwright MCP?
   ```
3. Se responder **"sim"** ou mencionar Playwright, funcionou! ✅

### Teste 2: Executar Teste via Copilot

Digite no Copilot Chat:
```
@workspace Execute os testes E2E de autenticação e me diga o resultado
```

Se o Copilot executar o teste e mostrar resultados, está funcionando! 🎉

---

## 🐛 Troubleshooting

### Problema 1: "Não encontrei o MCP Server"

**Solução:**
1. Verifique se o arquivo está no caminho correto
2. Verifique se o nome é exatamente `mcpServers.json`
3. Verifique se o JSON está correto (sem erros de sintaxe)
4. Reinicie o VS Code **completamente**

### Problema 2: "Erro de sintaxe no JSON"

**Solução:**
1. Apague o conteúdo do arquivo
2. Cole novamente o JSON **exatamente** como mostrado acima
3. Salve e reinicie o VS Code

### Problema 3: "O arquivo não salva"

**Solução:**
1. Execute o Notepad como **Administrador**
2. Abra o arquivo novamente
3. Cole o conteúdo
4. Salve

### Problema 4: "Copilot não responde sobre Playwright"

**Solução:**
1. Aguarde 30 segundos após reiniciar VS Code
2. Verifique se o Copilot Chat está ativo
3. Tente deslogar e logar novamente no Copilot
4. Verifique os logs: `Output > GitHub Copilot Chat`

---

## 📂 Estrutura de Pastas Esperada

Depois de configurar, a estrutura deve estar assim:

```
C:\Users\[SEU_USUARIO]\AppData\Roaming\
└── Code\
    └── User\
        └── globalStorage\
            └── github.copilot-chat\
                └── mcpServers.json  ← ESTE ARQUIVO
```

---

## 🔍 Verificar Logs do MCP

Se ainda não funcionar, verificar os logs:

### No VS Code:

1. `Ctrl + Shift + P`
2. Digite: `Developer: Show Logs`
3. Selecione: `GitHub Copilot Chat`
4. Procure por erros relacionados a "MCP" ou "Playwright"

---

## 🎯 O que o MCP Faz?

Quando configurado corretamente, o MCP permite que o Copilot:

- ✅ Execute testes Playwright automaticamente
- ✅ Navegue pelo browser de forma programática
- ✅ Capture screenshots e vídeos
- ✅ Leia resultados de testes
- ✅ Analise falhas com contexto visual
- ✅ Crie novos testes baseado em instruções

---

## 📋 Checklist Final

Marque cada item conforme completa:

```
[ ] Navegou até a pasta correta
[ ] Criou o arquivo mcpServers.json
[ ] Colou o conteúdo JSON exatamente como mostrado
[ ] Salvou o arquivo
[ ] Reiniciou o VS Code completamente
[ ] Aguardou 30 segundos
[ ] Testou com @workspace no Copilot Chat
[ ] Copilot reconheceu o Playwright MCP
```

Se todos os itens estão marcados, você está pronto! 🚀

---

## 🎓 Próximos Passos

Depois de configurar o MCP, vá para o arquivo:
```
COPILOT_PLAYWRIGHT_COMANDOS.md
```

Lá você encontrará todos os comandos que pode usar com o Copilot!

---

## 📞 Suporte Adicional

Se mesmo após seguir todos os passos não funcionar:

1. **Verificar versão do VS Code:**
   ```
   Help > About
   Deve ser >= 1.85
   ```

2. **Verificar versão do Copilot:**
   ```
   Extensions > GitHub Copilot
   Deve estar atualizado
   ```

3. **Reinstalar extensão do Copilot:**
   ```
   Desinstalar > Reiniciar VS Code > Reinstalar
   ```

4. **Limpar cache do VS Code:**
   ```powershell
   # Fechar VS Code
   Remove-Item -Recurse -Force "$env:APPDATA\Code\Cache"
   Remove-Item -Recurse -Force "$env:APPDATA\Code\CachedData"
   # Abrir VS Code novamente
   ```

---

## ✅ Status Final

Quando tudo estiver funcionando, você verá no Copilot Chat:

```
Você: "@workspace Execute os testes E2E"

Copilot: "Vou executar os testes E2E usando Playwright..."
[Executa os testes]
"✅ 18 testes passaram, 2 falharam. Veja os detalhes..."
```

**Se você vê isso, parabéns! Está tudo configurado! 🎉**

---

**Criado por:** GitHub Copilot  
**Data:** 15/10/2025  
**Versão:** 1.0  
**Última revisão:** 15/10/2025
