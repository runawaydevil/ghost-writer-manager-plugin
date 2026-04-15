---
ghost_post_access: public
ghost_published: true
ghost_published_at: ""
ghost_featured: true
ghost_tags: [destaque, ghost, obsidian, workflow]
ghost_excerpt: "Post em destaque no Ghost, com tags e resumo definidos no YAML."
ghost_feature_image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200"
ghost_slug: "meu-slug-personalizado"
ghost_no_sync: false
---

# Post em destaque com slug customizado

O campo `ghost_feature_image` deve apontar para uma **URL** acessível pelo Ghost (não use caminho local do vault sem hospedar a imagem).

O `ghost_slug` define a URL amigável; remova a linha se quiser que o Ghost gere o slug automaticamente a partir do título.

Após a primeira sincronização bem-sucedida, o plugin pode preencher `ghost_id` e `ghost_url` no frontmatter — não apague manualmente se quiser manter o vínculo com o mesmo post.
