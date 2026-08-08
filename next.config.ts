/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    // Strips out all console.log calls in production builds
    removeConsole: process.env.NODE_ENV === 'production' 
      ? { exclude: ['error'] } // Keeps console.error, removes console.log/info/debug
      : false,
  },
};

export default nextConfig;