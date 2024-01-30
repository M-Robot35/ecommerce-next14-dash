/** @type {import('next').NextConfig} */
const ContentSecurityPolicy = require('./csp')
const redirects = require('./redirects')

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost', process.env.NEXT_PUBLIC_SERVER_URL]
      .filter(Boolean)
      .map(url => url.replace(/https?:\/\//, '')),
  },
  redirects,
  async headers() {
    const headers = []

  // Impede que os mecanismos de busca indexem o site se ele não estiver ao vivo
  // Isso é útil para ambientes de preparação antes de irem ao vivo
  // Para permitir que os robôs rastreiem o site, use a variável de ambiente NEXT_PUBLIC_IS_LIVE
  // Você também pode querer usar essa variável para renderizar condicionalmente quaisquer scripts de rastreamento
    if (!process.env.NEXT_PUBLIC_IS_LIVE) {
      headers.push({
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex',
          },
        ],
        source: '/:path*',
      })
    }

    // Define o cabeçalho Content-Security-Policy como uma medida de segurança para prevenir ataques XSS
    // Funciona ao listar explicitamente fontes confiáveis de conteúdo para o seu site
    // Isso bloqueará todos os scripts e estilos inline, exceto aqueles que são permitidos  
    headers.push({
      source: '/(.*)',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: ContentSecurityPolicy,
        },
      ],
    })

    return headers
  },
}

module.exports = nextConfig
