export const PLANS = [
  {
    name: 'Starter',
    slug: 'starter',
    quota: 860,
    tokens: 860, // Adding tokens field, same as quota
    price: {
      amount: 19.99,
      priceIds: {
        test: 'price_1Q4FAMIiqaIMbJTTD5EJ1lzO',
        production: 'prod_Qw7PD3xxFy80n3',
      },
    },
  },
  {
    name: 'Pro',
    slug: 'pro',
    quota: 2000,
    tokens: 2000, // Adding tokens field, same as quota
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
    quota: 8000,
    tokens: 8000, // Adding tokens field, same as quota
    price: {
      amount: 99.99,
      priceIds: {
        test: 'price_1Q4FF3IiqaIMbJTTdvG6VSng',
        production: '',
      },
    },
  },
]

//need to replace production price ids

export const ONE_TIME_PURCHASES = [
  {
    name: '120 Tokens',
    slug: '120-tokens',
    tokens: 120,
    price: {
      amount: 2.99,
      priceIds: {
        test: 'price_1QBqkTIiqaIMbJTTzZEWPp5c', 
        production: 'prod_R3yhDp39jIn3hx',
      },
    },
  },
  {
    name: '540 Tokens',
    slug: '540-tokens',
    tokens: 540,
    price: {
      amount: 12.99,
      priceIds: {
        test: 'price_1QBqnjIiqaIMbJTTqGzPtcTp', 
        production: 'prod_R3ylOE8PH6P1jd',
      },
    },
  },
  {
    name: '1100 Tokens',
    slug: '1100-tokens',
    tokens: 1100,
    price: {
      amount: 23.99,
      priceIds: {
        test: 'price_1QBqogIiqaIMbJTTChYNasDr', 
        production: 'prod_R3ymi6JIZiSRNb',
      },
    },
  },
]