export const PLANS = [
  {
    name: 'Starter',
    slug: 'starter',
    quota: 660,
    tokens: 660, // Adding tokens field, same as quota
    price: {
      amount: 19.99,
      priceIds: {
        test: 'price_1Q4FAMIiqaIMbJTTD5EJ1lzO',
        production: '',
      },
    },
  },
  {
    name: 'Pro',
    slug: 'pro',
    quota: 3000,
    tokens: 3000, // Adding tokens field, same as quota
    price: {
      amount: 39.99,
      priceIds: {
        test: 'price_1Q4FD9IiqaIMbJTTZSiCYQt8',
        production: '',
      },
    },
  },
  {
    name: 'Premium',
    slug: 'premium',
    quota: 10000,
    tokens: 10000, // Adding tokens field, same as quota
    price: {
      amount: 99.99,
      priceIds: {
        test: 'price_1Q4FF3IiqaIMbJTTdvG6VSng',
        production: '',
      },
    },
  },
]