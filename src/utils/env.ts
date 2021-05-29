type StringEnv = Record<string, string>

const defaultENV = {
  JWT_SECRET: 'I09BbxowYvvUzNdARKtUHJboNKLrRvhzXePx',
  LOG_LEVEL: 'info',
  NODE_ENV: 'development',
  PORT: '4000',
  REDIS_PREFIX: 'guxi:',
}

const allEnv: StringEnv = {
  ...defaultENV,
  ...process.env,
}

const envProxy = new Proxy(allEnv, {
  get(env, key: string) {
    if (!env[key]) {
      throw new Error(`Missing ${key} ENV var`)
    }

    return env[key]
  },
})

// all env vars are guaranteed to be string
export const {
  DATABASE_URL,
  LOG_LEVEL,
  JWT_SECRET,
  NODE_ENV,
  PORT,
  REDIS_PREFIX,
  REDIS_URL,
} = envProxy
