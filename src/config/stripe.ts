export const PLANS = [
  {
    name: 'Starter',
    slug: 'starter',
    quota: 660,
    price: {
      amount: 19,
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
    price: {
      amount: 39,
      priceIds: {
        test: 'price_1Q4FD9IiqaIMbJTTZSiCYQt8',
        production: '',
      },
    },
  },
  {
    name: 'Premium',
    slug: 'premium',
    quota: 10000, // Assuming a higher quota for the premium plan
    price: {
      amount: 99,
      priceIds: {
        test: 'price_1Q4FF3IiqaIMbJTTdvG6VSng',
        production: '',
      },
    },
  },
]