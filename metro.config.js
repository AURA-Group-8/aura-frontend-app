const { getDefaultConfig } = require('expo/metro-config')

const config = getDefaultConfig(__dirname)

// Garantir que .web.* é preferido na plataforma web
config.resolver.sourceExts.push('web.js', 'web.jsx', 'web.ts', 'web.tsx')

module.exports = config
