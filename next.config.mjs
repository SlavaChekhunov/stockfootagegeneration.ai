/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      domains: ['localhost'],
    },
    experimental: {
      serverComponentsExternalPackages: ['@prisma/client', 'bcrypt'],
    },
    webpack: (config) => {
      config.module.rules.push({
        test: /\.(mp4|webm|ogg)$/,
        use: {
          loader: 'file-loader',
          options: {
            publicPath: '/_next/static/videos/',
            outputPath: 'static/videos/',
            name: '[name].[hash].[ext]',
          },
        },
      });
      return config;
    },
  };
  
  export default nextConfig;