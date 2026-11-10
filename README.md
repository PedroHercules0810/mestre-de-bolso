<div align="center">
  <img src="./src/assets/icon.png" alt="Mestre de Bolso Logo" width="140" style="border-radius: 28px;" />

  # 🛡️ Mestre de Bolso
  **O companheiro definitivo e 100% offline para Mestres de D&D 5e / 5.5e (SRD 2024)**

  [![Download APK](https://img.shields.io/badge/📱_Baixar_APK-GitHub_Releases-FF1457?style=for-the-badge)](https://github.com/PedroHercules0810/mestre-de-bolso/releases)
  [![Última Release](https://img.shields.io/github/v/release/PedroHercules0810/mestre-de-bolso?style=for-the-badge&color=613C4C&label=Vers%C3%A3o)](https://github.com/PedroHercules0810/mestre-de-bolso/releases/latest)
  [![Licença CC-BY 4.0](https://img.shields.io/badge/SRD_5.2-CC--BY_4.0-35313B?style=for-the-badge)](https://github.com/PedroHercules0810/mestre-de-bolso/releases)
</div>

---

## 📥 Download do Aplicativo (Android)

Você pode baixar a versão mais recente do aplicativo compilado (`.apk`) diretamente na aba de **Releases** do repositório:

👉 **[Clique aqui para acessar as Releases e baixar o APK do Mestre de Bolso](https://github.com/PedroHercules0810/mestre-de-bolso/releases)**

1. Acesse a [página de Releases](https://github.com/PedroHercules0810/mestre-de-bolso/releases/latest).
2. Baixe o arquivo `.apk` disponível em **Assets**.
3. Abra o arquivo no seu dispositivo Android e confirme a instalação.
4. Na primeira vez que abrir o app, vá em **Menu (≡) → Sistema → Sincronização** e clique em **Atualizar Bestiário** e **Atualizar Itens** para salvar todo o banco de dados no seu aparelho para uso **100% offline**!

---

## ✨ Funcionalidades Principais

### 🐉 Monstros & Encontros
- **Bestiário Completo (SRD 2024 / 5e):** Consulte centenas de criaturas offline com fichas (`StatBlocks`) organizadas e separadas em **Traços**, **Ações Padrão**, **Ações Bônus**, **Reações**, **Ações Lendárias** (com custo de ações) e **Ações Míticas**, além de limites de recarga (`Recarga 5–6`, `X/Dia`), salvaguardas, perícias, sentidos e imunidades.
- **Gerador Automático de Encontros:** Calcula automaticamente o orçamento de XP com base na quantidade de jogadores, nível médio (1 a 20), dificuldade (*Baixa*, *Média*, *Alta*), estilo (*Equilibrado*, *Chefe e Lacaios* ou *Horda*), tipo de criatura e ambiente.
- **Saque Sugerido por Encontro:** Gera automaticamente moedas, gemas, objetos de arte e itens mágicos proporcionais ao Nível de Desafio (ND/CR) do encontro.

### 💎 Compêndio de Itens & Gerador de Loot
- **Compêndio de Itens Mágicos, Armas e Armaduras:** Filtre por categoria (*Armas*, *Armaduras*, *Poções*, *Anéis*, *Pergaminhos*, *Varinhas/Cajados*, *Itens Maravilhosos*) com busca bilíngue.
- **Gerador de Tesouros (Loot Generator):** Sorteie tesouros **Individuais** ou de **Covil/Chefe (Hoard)** divididos nos 4 Tiers de Desafio oficiais (ND 0–4, 5–10, 11–16 e 17+).

### 🛡️ Ferramentas do Mestre (DM)
- **Gerenciador de Campanhas:**
  - **📝 Anotações:** Crie, edite e pesquise notas de sessão, NPCs, locais e segredos para cada campanha.
  - **⚔️ Encontros Salvos:** Salve encontros gerados diretamente dentro de uma campanha (com nome personalizado ou numeração automática `Encounter #0`, `Encounter #1`...) e envie-os para o combate com um toque.
  - **📖 Regras Homebrew da Campanha:** Cadastre e organize as regras da casa (*House Rules*) por categoria dentro de cada campanha.
- **✨ Criador Homebrew (Monstros & Itens):**
  - **Criador de Monstros Homebrew:** Crie monstros personalizados com **cálculo automático e em tempo real de ND (CR)**, ND Defensivo, ND Ofensivo, XP e Bônus de Proficiência segundo a tabela oficial do *Guia do Mestre (DMG p. 274)*. Envie ou remova seus monstros diretamente para o **Bestiário**!
  - **Criador de Itens Homebrew:** Crie armas, armaduras e itens mágicos com **cálculo automático de Raridade, Preço Sugerido (PO) e Nível Recomendado** segundo as diretrizes do DMG, e envie-os diretamente para o **Compêndio de Itens** (participando inclusive dos sorteios de Loot!).
- **⚡ Rastreador de Combate (Iniciativa):** Controle rodadas, turnos, Pontos de Vida (dano/cura rápida), iniciativa editável com reordenação automática e mais de 15 condições de status (*Cego*, *Enfeitiçado*, *Concentração*, *Amedrontado*, *Paralisado*, *Envenenado*, etc.).
- **📚 Escudo do Mestre (DM Screen):** Referência rápida de regras, ações em combate, cobertura, iluminação, exaustão e dificuldades de testes (CD).

### 🌐 Motor Híbrido de Tradução (PT-BR / EN)
- **Camada 1 (Offline Instantânea):** Glossário oficial SRD + motor gramatical e parser mecânico que traduz automaticamente cabeçalhos de ataque, salvaguardas, tipos de dano e converte medidas em pés (`ft.`) para metros (`m`).
- **Camada 2 (Tradução Neural com Cache Offline no IndexedDB):** Traduz automaticamente textos narrativos complexos e descrições de itens mágicos em segundo plano, salvando o resultado permanentemente no `IndexedDB` do aparelho.
- **Camada 3 (Busca Bilíngue sem Acentos):** Pesquise monstros e itens tanto em Português quanto em Inglês (ex.: `"dragao"`, `"esqueleto"`, `"espada longa"`, `"pocao"`).

---

## 🗺️ Roadmap

Acompanhe o que já foi feito e o que vem por aí. Sugestões são bem-vindas nas [Issues](https://github.com/PedroHercules0810/mestre-de-bolso/issues)!

### ✅ Concluído
- [x] Bestiário offline com fichas completas (SRD 2024 / 5e)
- [x] Gerador automático de encontros (XP, dificuldade, estilo, ambiente)
- [x] Compêndio de itens + gerador de loot (Individual e Covil)
- [x] Gerenciador de campanhas (anotações, encontros salvos, regras homebrew)
- [x] Criador homebrew de monstros e itens com cálculo automático de ND/raridade
- [x] Rastreador de combate com iniciativa e condições
- [x] Escudo do Mestre (DM Screen)
- [x] Motor híbrido de tradução PT-BR / EN com cache offline
- [x] Build Android (APK nas Releases)

### 🚧 Em desenvolvimento
- [ ] Aba de magias
- [ ] Homebrew de magias

### 📌 Planejado
- [ ] Backup / exportação e importação de campanhas
- [ ] Gerador de NPCs (nomes, traços, motivações)
- [ ] Rolador de dados integrado
- [ ] Gerador de masmorras / locais
- [ ] Publicação na Google Play

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** [React 19](https://react.dev/) + [Vite 8](https://vitejs.dev/)
- **Estilização:** [Tailwind CSS v4](https://tailwindcss.com/) + [Lucide Icons](https://lucide.dev/)
- **Mobile Nativo:** [Capacitor 8 (Android)](https://capacitorjs.com/)
- **Persistência Offline:** `IndexedDB` (`QuickEncounterDB`) + `localStorage`
- **Dados:** [Open5e API](https://open5e.com/) (D&D 5.5e SRD 5.2 / 5e SRD)

---

## 💻 Como Executar o Projeto Localmente

### Pré-requisitos
- **Node.js** 20+ e **npm**
- **Android Studio** (para compilar/emular no Android)

### 1. Clonar e instalar dependências
```bash
git clone https://github.com/PedroHercules0810/mestre-de-bolso.git
cd mestre-de-bolso
npm install
```

### 2. Rodar no navegador (Desenvolvimento)
```bash
npm run dev
```

### 3. Executar a suíte de testes e linter
```bash
npm test
npm run lint
```

### 4. Compilar e sincronizar com o Android Studio
```bash
npm run build
npx cap sync android
npx cap open android
```

---

## 📜 Créditos e Licença

- **Desenvolvido por:** Pedro Hércules (`pedrosouzagrangeiro@gmail.com`)
- **Conteúdo de RPG:** Baseado no *System Reference Document 5.2 (SRD)* da Wizards of the Coast, licenciado sob [Creative Commons Attribution 4.0 International (CC-BY 4.0)](https://creativecommons.org/licenses/by/4.0/). Fornecido via [Open5e API](https://open5e.com/).
