const ADMINS = ['0x4916eF3d45639d81777B07D865ffEf927f738F36']

export const isAdmin = (address?: string) => (address ? ADMINS.includes(address) : false)
