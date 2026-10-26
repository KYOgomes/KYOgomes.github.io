# Portfólio — lago de carpas em ASCII

Site estático (HTML + CSS + JS puro, sem build, sem dependências).
Carpas em ASCII nadam ao fundo; ao rolar, as seções aparecem uma a uma.

## Arquivos

| arquivo      | o que é                                                        |
|--------------|----------------------------------------------------------------|
| `config.js`  | **todo o seu conteúdo** — é o único arquivo que você precisa editar |
| `index.html` | esqueleto da página (título e descrição para o Google/LinkedIn) |
| `style.css`  | cores, fontes, layout (variáveis no topo)                      |
| `pond.js`    | o lago: carpas, ondas, ração                                   |
| `main.js`    | monta as seções a partir do `config.js`                        |

## Personalizar

1. Abra `config.js` e troque os textos, links, experiências e projetos.
   - `[texto](https://url)` vira link, `**texto**` vira negrito.
   - Para remover ou reordenar seções, edite a lista `sections`.
2. Em `index.html`, troque o `<title>` e a `description` (aparecem no Google e no preview de links).
3. Cores: variáveis `--bg`, `--fg`, `--accent`… no topo do `style.css`.
   Cores das carpas: `PALETTES` no topo do `pond.js`.
4. Lago: `pond.fishCount` (quantidade de carpas) e `pond.cellSize` (tamanho do "pixel") no `config.js`.

## Versões do lago

O estilo anterior das carpas (sem luz/sombra, sem raios nas nadadeiras e sem profundidade)
está guardado em `versions/pond-v1-classico.js` (só no computador, fora do git). Para voltar a ele, troque no `index.html`:

```html
<script src="pond.js"></script>
<!-- por -->
<script src="versions/pond-v1-classico.js"></script>
```

## Rodar localmente

```bash
python3 -m http.server 8000
# abra http://localhost:8000
```

## Interações

- mover o mouse perto de uma carpa → ela foge e a água se mexe
- clicar no lago → onda + ração; as carpas nadam até a comida
- botões − e + no canto superior direito → tiram ou soltam carpas (o número de baixo conta as rações comidas)
- ☼ / ☾ → tema claro/escuro (fica salvo)
- respeita "reduzir movimento" do sistema (mostra um quadro parado)

## Publicar

### GitHub Pages (recomendado para este site)

1. Crie um repositório (ex.: `seu-usuario.github.io` para ter a URL `https://seu-usuario.github.io`).
2. Envie os arquivos:
   ```bash
   git init && git add . && git commit -m "portfolio"
   git branch -M main
   git remote add origin https://github.com/seu-usuario/seu-usuario.github.io.git
   git push -u origin main
   ```
3. No GitHub: **Settings → Pages → Source: Deploy from a branch → `main` / `(root)`**.
4. Em ~1 minuto o site está no ar. Domínio próprio: Settings → Pages → Custom domain.

### Vercel (alternativa)

1. Em vercel.com, **Add New → Project** e importe o repositório.
2. Framework preset: **Other**. Sem comando de build. Deploy.
3. A cada `git push` ele publica de novo e gera um link de preview por branch.
