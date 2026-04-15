# Instruções de uso — Ghost Writer Manager (pt-BR)

Este guia descreve como usar o plugin para publicar e gerenciar posts do **Ghost CMS** a partir do **Obsidian**.

## O que o plugin faz

- Envia conteúdo das suas notas (na pasta de sincronização) para o Ghost, usando a **Admin API**.
- Permite controlar visibilidade, rascunho/publicação, agendamento, tags, destaque e outros campos via **YAML no frontmatter**.
- Oferece um **calendário editorial** na barra lateral com posts do mês.
- Suporta **paywall** com o marcador `--members-only--` no corpo da nota.

O fluxo principal é **Obsidian → Ghost**. Existem também fluxos para **importar** um post do Ghost como nota e para **vincular** uma nota existente a um post no Ghost.

---

## Instalação

1. Baixe `main.js`, `manifest.json` e `styles.css` da [página de releases](https://github.com/diegoeis/ghost-writer-manager-plugin/releases) (ou use uma cópia compilada a partir do código-fonte).
2. No seu vault, crie a pasta `.obsidian/plugins/ghost-writer-manager/` (se ainda não existir).
3. Coloque os três arquivos dentro dessa pasta.
4. Reinicie o Obsidian ou recarregue o app.
5. Em **Configurações → Plugins da comunidade**, ative **Ghost Writer Manager**.

---

## Configuração inicial

Abra **Configurações → Ghost Writer Manager** (nome pode variar conforme a tradução do Obsidian).

### URL do Ghost

Endereço do site, **sem barra no final**, por exemplo:

`https://seublog.ghost.io`

### Chave Admin API (Keychain)

1. No painel do Ghost: **Configurações → Integrações → Adicionar integração personalizada**.
2. Copie a **Admin API Key** (formato `id:segredo` — use apenas a **primeira** ocorrência de `:` para separar id e segredo quando o segredo contiver `:`).
3. No Obsidian, guarde a chave no **Cofre de credenciais** (Keychain), conforme o nome configurado no plugin (padrão do código: segredo chamado `ghost-api-key` — confira o campo **Admin API key secret name** nas configurações).
4. Use **Test connection** para validar URL e autenticação.

### Pasta de sincronização

Pasta do vault onde ficam as notas que serão enviadas ao Ghost (padrão comum: `Ghost Posts`). Apenas arquivos **Markdown** nessa pasta (e subpastas, conforme a lógica do plugin) entram no ciclo de sincronização.

### Intervalo de sincronização

Em produção, o plugin dispara uma sincronização **periódica** conforme o intervalo em minutos (padrão: **15**). Entre um ciclo e outro, você pode forçar o envio da nota aberta com o comando descrito abaixo.

### Prefixo YAML

Texto que prefixa todas as chaves Ghost no frontmatter. O padrão no código é **`ghost_`**. Se mudar para `g_`, por exemplo, use `g_published` em vez de `ghost_published`.

---

## Comandos (Paleta de comandos)

Os nomes abaixo são os **IDs em inglês** exibidos na paleta (**Ctrl/Cmd + P**). A interface do Obsidian pode mostrar traduções parciais.

| Comando no plugin | Uso resumido |
|-------------------|--------------|
| **Open editorial calendar** | Abre a view do calendário na lateral. |
| **Test Ghost connection** | Testa JWT e conexão com o Ghost. |
| **Create new Ghost post** | Cria uma nova nota na pasta de sync com template Ghost. |
| **Add Ghost properties to current note** | Insere propriedades Ghost faltantes no frontmatter da nota atual. |
| **Sync current note to Ghost** | Envia a nota atual ao Ghost (e pode mover a nota para a pasta de sync). |
| **Import post from Ghost** | Importa um post existente no Ghost como nota no vault. |
| **Link note to Ghost post** | Associa uma nota a um post já existente no Ghost. |
| **Debug: …** | Comandos de diagnóstico (console / avisos). |

Também há um ícone de **calendário** na barra de ferramentas (ribbon) para abrir o calendário editorial.

---

## Barra de status

Indicadores como **Ghost: Syncing…** e **Ghost: Synced** aparecem na barra de status durante e após a sincronização. Você pode desativar **notificações** popup de sync nas configurações, mantendo a barra de status.

---

## Frontmatter — propriedades Ghost

Todas as chaves abaixo usam o prefixo **`ghost_`**. Troque pelo seu prefixo se for diferente.

| Chave | Significado |
|-------|-------------|
| `ghost_post_access` | Visibilidade: `public`, `members` ou `paid`. |
| `ghost_published` | `true` = publicar (ou agendar se houver data); `false` = rascunho. |
| `ghost_published_at` | Data/hora ISO para agendamento ou data de publicação; vazio `""` para “agora” quando `published` é true. |
| `ghost_featured` | Post em destaque no Ghost. |
| `ghost_tags` | Lista de tags, ex.: `[obsidian, ghost]`. |
| `ghost_excerpt` | Resumo / meta descrição. |
| `ghost_feature_image` | URL da imagem de capa. |
| `ghost_no_sync` | `true` para **não** sincronizar esta nota. |
| `ghost_id` | Preenchido pelo plugin após criar/atualizar o post no Ghost. |
| `ghost_slug` | Slug personalizado da URL. |
| `ghost_url` | Link do editor Ghost (pode ser atualizado pelo plugin). |

### Rascunho

- `ghost_published: false` — o campo `ghost_published_at` é ignorado para publicação.

### Publicar agora

- `ghost_published: true`
- `ghost_published_at: ""`

### Agendar

- `ghost_published: true`
- `ghost_published_at: "2026-12-25T10:00:00.000Z"` (exemplo em UTC; ajuste ao fuso desejado)

### Retroativo (backdate)

Mesmo padrão de agendamento, com data no passado.

---

## Paywall (`--members-only--`)

Para posts `members` ou `paid`, coloque uma linha contendo **somente**:

```text
--members-only--
```

- Tudo **acima** dessa linha = prévia pública.
- Tudo **abaixo** = conteúdo restrito a membros/assinantes no Ghost.
- No editor do Obsidian, o plugin pode destacar essa linha visualmente.
- Use **apenas um** marcador por nota; duplicatas são tratadas pelo plugin.

---

## Calendário editorial

Na view do calendário você vê posts do **mês atual** vindos da API do Ghost. Os detalhes visuais (cores dos pontos, botão “Today”, etc.) seguem o README principal do projeto — em geral: publicado, agendado, e filtro por dia ao clicar.

---

## Boas práticas

1. Mantenha posts “oficiais” do Ghost dentro da **pasta de sincronização** para o intervalo periódico encontrá-los.
2. Não commite a **Admin API Key** no repositório do vault; use sempre o cofre do Obsidian.
3. Depois de importar ou vincular posts, revise o frontmatter e o corpo antes de um novo sync.
4. Se algo falhar, use **Test Ghost connection** e os comandos **Debug** olhando o **Console de desenvolvedor** (Ctrl/Cmd + Shift + I).

---

## Desenvolvimento (referência rápida)

Para quem compila o plugin: em `main.ts`, a constante **`DEV_MODE`** controla sync automático ao salvar (debounce). Deve ficar **`false`** em builds de produção / release.

Documentação técnica adicional: `docs/` e `AGENTS.md` na raiz do repositório.
