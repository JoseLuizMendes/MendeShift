# /public/projects — Assets de preview dos cards

Coloque aqui os screenshots dos projetos. Um arquivo por projeto.

## Arquivos esperados

| Arquivo                   | Projeto         |
|---------------------------|-----------------|
| wedding-platform.webp     | Wedding Platform |
| barber-saas.webp          | Barber SaaS      |
| agendamento-api.webp      | Agendamento API  |
| belessence.webp           | Belessence       |

## Especificações recomendadas

- **Dimensões:** 1200 × 675 px (16:9)
- **Formato:** .webp (melhor compressão)
- **Conteúdo:** screenshot da interface principal do projeto, em desktop
- **O que NÃO precisa:** cor ou brilho — o CSS aplica grayscale + brightness(0.32) automaticamente

## Como tirar o screenshot

1. Abra o projeto no Chrome
2. DevTools → ⋮ → More tools → Sensors → resolução 1200×675
3. Ctrl+Shift+P → "Capture screenshot"
4. Salve como .webp (converta com Squoosh se necessário: squoosh.app)

## Como funciona

Quando o arquivo existe no path correto, os cards em `/projetos` e na home
exibem a imagem real com grayscale + overlay escuro — revelando a UI sem
quebrar a identidade visual monochrome do site.

Enquanto o arquivo não existe, o card usa o `accentGradient` como fallback
(comportamento atual).
