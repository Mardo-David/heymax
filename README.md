# HeyMax.fit

Ambiente de front-end para o sistema preditivo de academias HeyMax. Desenvolvido em React + Vite + Tailwind + GSAP.

## Configuração Local

1. Instale as dependências:
```sh
npm install
```

2. Rode o servidor de desenvolvimento:
```sh
npm run dev
```

## Estrutura do Projeto

O site possui estrutura em Landing Page (Single Page Application) e componentes premium utilizando:
* **Tailwind CSS** para estilização.
* **GSAP** para animações cinemáticas.
* **Radix** (shadcn/ui) para componentes de interface dinâmicos.
* Ícones vetoriais pela **Lucide React**.

## Build e Emplantação

Para compilar a versão de produção:
```sh
npm run build
```

As modificações para a master/main desencadeiam automaticamente a action de deploy para a VPS.
