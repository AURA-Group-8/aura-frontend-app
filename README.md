# 💇‍♀️ AURA - Gerenciamento de Agendamentos

Um aplicativo mobile completo para gerenciamento de agendamentos em clínicas de estética e beleza. O AURA oferece uma solução integrada para profissionais e clientes controlarem horários, serviços e pagamentos com facilidade.

## 📱 Sobre o Projeto

Este repositório contém o **frontend mobile** da aplicação **AURA**, desenvolvido com **React Native** e **Expo**. O aplicativo permite:

- 👨‍💼 **Profissionais**: Gerenciar agendamentos, serviços, clientes e finanças
- 👩‍💼 **Clientes**: Visualizar histórico de agendamentos, agendar serviços e cancelar com justificativa
- 💰 **Pagamentos**: Controlar status de pagamentos (Pendente/Pago)
- 📊 **Dashboard**: Insights de negócios para profissionais

---

## 🛠️ Tecnologias Utilizadas

### Frontend Mobile
- **React Native** (v0.81.5) - Framework para desenvolvimento mobile
- **Expo** (v54.0.33) - Plataforma para criar e deploy de apps React Native
- **expo-router** (v6.0.23) - Roteamento e navegação
- **Axios** - Cliente HTTP para consumo de APIs
- **AsyncStorage** - Armazenamento local de dados (tokens, preferências)

### Arquitetura
- **React Hooks** - Estado e efeitos (useState, useEffect, useRef, useCallback, useFocusEffect)
- **Context API** - Gerenciamento de estado global (quando necessário)
- **Autenticação** - Bearer Token via AsyncStorage

### Build & Deploy
- **Android** - Suporte nativo via Gradle
- **JavaScript** - Linguagem principal (JSX)

---

## 🚀 Como Usar Este Repositório

### Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (v16 ou superior) - [Download](https://nodejs.org/)
- **npm** ou **yarn** - Gerenciador de pacotes
- **Expo CLI** - `npm install -g expo-cli`
- **Android Studio** ou **Xcode** (para rodar em emulador/dispositivo)
- **Git** - Controle de versão

### 1. Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/aura-frontend-app.git
cd aura-frontend-app
```

### 2. Instalar Dependências

```bash
npm install
# ou
yarn install
```

### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
API_URL=http://seu-backend-api.com
EXPO_PUBLIC_API_URL=http://seu-backend-api.com
```

> **Nota**: O prefixo `EXPO_PUBLIC_` é necessário para variáveis acessíveis no frontend Expo.

### 4. Iniciar o Servidor de Desenvolvimento

```bash
npm start
# ou
yarn start
```

Isso abrirá o **Expo Dev Tools** no terminal. Você verá um QR code.

### 5. Rodar no Emulador ou Dispositivo

**Opção A: Emulador Android**
```bash
# Pressione 'a' no terminal
# Ou use:
npm run android
```

**Opção B: Emulador iOS (apenas macOS)**
```bash
# Pressione 'i' no terminal
# Ou use:
npm run ios
```

**Opção C: Dispositivo Físico**
- Abra o app **Expo Go** no seu telefone
- Escaneie o QR code exibido no terminal

### 6. Build para Produção

```bash
# Build Android APK
eas build --platform android

# Build iOS IPA (requer conta Expo)
eas build --platform ios
```

---

## 📂 Estrutura do Projeto

```
AURA/
├── app/
│   ├── Auth/                          # Telas de autenticação (login, signup, recuperação)
│   ├── Client/                        # Telas do cliente
│   │   ├── schedules.jsx             # Agendamentos do cliente
│   │   ├── history.jsx               # Histórico de agendamentos
│   │   ├── notifications.jsx         # Notificações
│   │   └── _Component/               # Componentes reutilizáveis
│   ├── Professional/                  # Telas do profissional
│   │   ├── schedules-home.jsx        # Dashboard de agendamentos
│   │   ├── services.jsx              # Gerenciar serviços
│   │   ├── finances.jsx              # Finanças
│   │   └── _Components/              # Componentes reutilizáveis
│   ├── assets/                        # Imagens, ícones, fontes
│   └── styles/                        # Estilos globais
├── android/                           # Código nativo Android
├── package.json                       # Dependências do projeto
├── app.json                          # Configuração do Expo
└── README.md
```

---

## 🔑 Principais Funcionalidades

### Para Profissionais
- ✅ Visualizar agendamentos pendentes e concluídos
- ✅ Criar novos agendamentos
- ✅ Marcar agendamentos como concluídos (FEITO)
- ✅ Gerenciar status de pagamento
- ✅ Registrar serviços prestados
- ✅ Acompanhar finanças (receitas, pagamentos)
- ✅ Dashboard com insights de negócios

### Para Clientes
- ✅ Agendar serviços
- ✅ Visualizar agendamentos pendentes
- ✅ Cancelar agendamentos com justificativa
- ✅ Ver histórico de serviços
- ✅ Receber notificações

---

## 🔗 API Backend

A aplicação consome uma API REST. Principais endpoints:

- `GET /api/agendamentos/card` - Listar agendamentos com paginação
- `POST /api/agendamentos` - Criar novo agendamento
- `PATCH /api/agendamentos/{id}` - Atualizar status/pagamento
- `GET /api/usuarios` - Obter dados do usuário
- `POST /api/auth/login` - Autenticação

> Consulte a documentação do backend para mais detalhes.

---

## 🐛 Debugging

### Habilitar Logs
```bash
npm run dev:logs
```

### Acessar Console do Expo
- No app: Agite o dispositivo (iOS) ou pressione menu (Android)
- Selecione "Show Developer Menu"

### Problema Comum: "Cannot find module"
```bash
# Limpar cache
npm start --clear
```

---

## 📚 Padrões de Código

- **Componentes**: Functional Components com Hooks
- **Estado**: useState para estado local, AsyncStorage para persistência
- **HTTP**: Axios com interceptores para Bearer Token
- **Navegação**: expo-router com stack navigation
- **Estilos**: StyleSheet nativo do React Native

---

## 💼 Equipe do Projeto

- [@Bruna Karen](https://github.com/brunaK19)
- [@Gustavo Basi](https://github.com/GustavoBasi)
- [@Luiz Felipe](https://github.com/LuizFelipeSptech)
- [@Murillo Lima](https://github.com/Murillo-lc)
- [@Pablo Rocha](https://github.com/AlbaDr52)
- [@Richard Almeida](https://github.com/richpdp)

---

## 📄 Licença

Este projeto está sob licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

