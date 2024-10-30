import withPWA from 'next-pwa';

const nextConfig = {
  // your Next.js config options here
};

const configWithPWA = withPWA({
  dest: 'public',
  ...nextConfig
});

export default configWithPWA;
