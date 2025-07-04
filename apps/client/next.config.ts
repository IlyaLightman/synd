/** @type {import('next').NextConfig} */
const nextConfig = {
	/* config options here */
	async rewrites() {
		return [
			{
				source: '/api/:path*',
				destination: 'http://localhost:3001/api/:path*' // proxy to backend
			}
		]
	}
}

export default nextConfig
