const ADMINS = ['0x5818FC3Cbafb3C25E33d40CF2DF4830C83199Ce1']

export const isAdmin = (address?: string) => (address ? ADMINS.includes(address) : false)
