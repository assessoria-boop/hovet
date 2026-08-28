# Patinhas de Assis - Hospital Veterinário 24h (Landing Page)

Página única, estática (`index.html`), sem dependências externas de fonte ou biblioteca.

## Imagens que você precisa colocar nesta pasta (todas em .webp)

| Arquivo | O que é | Tamanho sugerido |
|---|---|---|
| `logo.webp` | Logo do cliente (usada no cabeçalho, no hero e como favicon) | 512x512, fundo quadrado |
| `clinica-1.webp` | Foto da clínica 1 (hero, intercala com fade) | 1600x900 (16:9) |
| `clinica-2.webp` | Foto da clínica 2 | 1600x900 (16:9) |
| `clinica-3.webp` | Foto da clínica 3 | 1600x900 (16:9) |
| `1.webp` a `5.webp` | Prints reais das avaliações do Google (carrossel) | largura 800px, altura livre |

Quer mais ou menos fotos no hero? Basta duplicar/remover as `div.hero-foto-slide` e a classe `.foto-N` no CSS.
Quer mais ou menos prints? Duplique/remova um `.carrossel-slide` e o `.carrossel-dot` correspondente.

As fotos do hero usam `background-size: cover`, ou seja, mantêm a proporção original da imagem (nunca esticam).
Envie no formato 16:9 para o enquadramento ficar exato no desktop.

## Pendências

- **Clarity**: no `<script>` do `<head>`, troque `COLE_AQUI_O_ID_DO_CLARITY` pelo ID do projeto no Microsoft Clarity.
- GTM já configurado: `GTM-P7LVPBTR`.
- WhatsApp já configurado: `+55 11 91771-7030` (somente nos links, o número não aparece na página).

## Como converter imagens para webp

Com o `cwebp` instalado:

```
cwebp -q 82 foto.jpg -o clinica-1.webp
```

Ou use https://squoosh.app (arraste a imagem, escolha WebP, qualidade 80).
