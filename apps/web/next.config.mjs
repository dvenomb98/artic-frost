import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/ui"],
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],

};

const withMDX = createMDX({
})
 
export default withMDX(nextConfig)

