// Plain-language content shared by the home page and the How it works page.
// Written for a reader who has never used a trading platform. No jargon without an explanation.

export const PLAIN_TERMS = [
  {
    title: 'A service, not a fund',
    body: 'Your money stays in your own broker account, in your name. We never hold it or move it. You fund the account and you withdraw from it.',
  },
  {
    title: 'A computer trades, not a person',
    body: 'Our GTC algorithm watches the price of gold all day and places trades by fixed rules. No tips, no guessing and no emotions.',
  },
  {
    title: 'You stay in control',
    body: 'Every trade shows up live in the MetaTrader app on your phone. Remove our access through the broker and trading stops.',
  },
];

export const STEPS = [
  {
    title: 'Tell us about yourself',
    body: 'A two-minute form: how much you can start with, and your broker if you already have one.',
  },
  {
    title: 'We recommend a plan',
    body: 'GTC Mini, Micro or Standard, chosen by your starting balance. We walk you through the numbers and share pricing. Free, with no obligation.',
  },
  {
    title: 'Open and fund a broker account',
    body: 'A MetaTrader 5 cent account that offers gold. We recommend Vantage, where GTC was tested. The account is in your name.',
  },
  {
    title: 'Give us trading access',
    body: 'Through the broker you allow us to place trades on the account. Withdrawals stay with you. We then set GTC up on your account.',
  },
  {
    title: 'GTC trades, you watch',
    body: 'The algorithm buys and sells gold around the clock. You see every trade and your balance live. We pause around major news and before weekends, and review results with you.',
  },
];

export const WHAT_YOU_NEED = [
  { title: 'A MetaTrader 5 cent account with gold', body: 'From Vantage or another MT5 broker. We can point you to the right account type.' },
  { title: 'Your starting balance', body: 'At least 1L (100,000 USC, about 1,000 USD) for GTC Mini, 3L for GTC Micro, or 10L for GTC Standard.' },
  { title: 'The MetaTrader 5 app', body: 'Free on phone and desktop. This is where you watch trades and your balance.' },
  { title: 'A few minutes to grant access', body: 'Done once, through your broker. It lets us trade on the account but not withdraw from it.' },
];

export const WHAT_WE_DO = [
  { title: 'Set up and run GTC on your account', body: 'We install and configure the algorithm for the plan you chose.' },
  { title: 'Watch it', body: 'We monitor the account and the market while GTC is trading.' },
  { title: 'Pause when it is dangerous', body: 'Around high-impact news events we pause trading, and we close trades before the weekend so you are not exposed to Monday opening gaps.' },
  { title: 'Review with you', body: 'We go through results with you and answer questions. Pricing and reports are shared during the evaluation.' },
];

export const HOW_IT_TRADES = {
  title: 'How GTC decides what to do',
  body: [
    'GTC is a mean-reversion strategy. When the gold price moves sharply away from where it has recently been trading, GTC takes a position expecting it to come back, and closes once it does. It trades both up and down moves.',
    'Because it waits for the return rather than giving up on a trade quickly, it can hold open trades through a dip. That is why the deepest open-trade dip is the most important number on this site, and why each plan has a minimum starting balance.',
    'The exact rules and settings are proprietary and are not published.',
  ],
};

export const GLOSSARY = [
  {
    term: 'Backtest',
    body: 'A rehearsal using past prices. We ran GTC over 2.7 years of real gold price history, January 2024 to September 2026, to see how it would have traded. It is not live trading and real results will differ.',
  },
  {
    term: 'Gold (XAUUSD)',
    body: 'The price of one ounce of gold in US dollars. GTC trades only this one market.',
  },
  {
    term: 'Cent account and USC',
    body: 'A broker account where balances are counted in US cents rather than dollars. 100 USC equals 1 USD, so 100,000 USC is 1,000 USD. Cent accounts let the strategy trade in small sizes.',
  },
  {
    term: '1L, 3L, 10L',
    body: 'Short for lakh. 1L is 100,000 USC, 3L is 300,000 USC and 10L is 1,000,000 USC. Each plan was tested starting from that balance.',
  },
  {
    term: 'Leverage (1:500)',
    body: 'Borrowing power from the broker. 1:500 means each 1 in your account can control 500 worth of gold. It magnifies both profits and losses.',
  },
  {
    term: 'Mean reversion',
    body: 'The idea that after a sharp move, a price tends to come back towards where it has recently been. GTC trades those returns rather than chasing trends.',
  },
  {
    term: 'Open-trade dip',
    body: 'A loss on trades that are still open. It is not final until the trades close, but it reduces what the account is worth at that moment. The technical name is floating or equity drawdown.',
  },
  {
    term: 'Trading access',
    body: 'Permission, given through your broker, for us to place trades on your account. Withdrawals are made through your own broker login, which stays with you. You can remove the access at any time.',
  },
];

export const RISKS = [
  {
    title: 'These are test results, not live results',
    body: 'Every figure on this site comes from a backtest, a replay of past prices. Live trading will differ, and past results do not guarantee future ones. Forward testing on a live account is planned but not yet complete.',
  },
  {
    title: 'Open trades can go deep before they recover',
    body: 'GTC waits for gold to come back after a move against it. During a long one-way move the account can show large open losses, and if the move is big enough the account can be lost. The deepest open-trade dip in the test is shown for each plan. Size your capital for it, and never start below the minimum.',
  },
  {
    title: 'The test ran without our live safety pauses',
    body: 'In live trading we pause around high-impact news and close trades before the weekend. The backtest did not include these pauses, so live behaviour will differ from the test in both directions.',
  },
  {
    title: 'Losses are yours, and leverage cuts both ways',
    body: 'Your broker holds the money, but trading losses come out of your account. 1:500 leverage magnifies gains and losses alike. Only trade with money you can afford to lose.',
  },
];

export const FAQS = [
  {
    q: 'What exactly am I getting?',
    a: 'A managed trading service. We run our GTC gold algorithm on a broker account that is in your name. You do not install anything or place trades yourself.',
  },
  {
    q: 'Do you hold my money?',
    a: 'No. It stays in your own account at the broker. You fund it and you withdraw from it. We only receive permission to place trades.',
  },
  {
    q: 'Can I see what is happening?',
    a: 'Yes. Every trade and your account balance appear live in the free MetaTrader 5 app on your phone or computer.',
  },
  {
    q: 'Can I stop at any time?',
    a: 'Yes. Tell us, or remove our trading access through the broker, and no new trades are placed.',
  },
  {
    q: 'Are the numbers on this site from real trading?',
    a: 'No. They come from a backtest: GTC run over 2.7 years of real past gold prices, January 2024 to September 2026, on 100% real tick data. They show how the strategy would have traded, not live results.',
  },
  {
    q: 'How much do I need to start?',
    a: '1L (100,000 USC, about 1,000 USD) for GTC Mini, 3L for GTC Micro and 10L for GTC Standard. These are the balances each plan was tested at. Starting with less leaves a thinner buffer when open trades dip.',
  },
  {
    q: 'What does it cost?',
    a: 'Pricing is shared during your evaluation, once we know which plan fits you. The evaluation itself is free and carries no obligation.',
  },
  {
    q: 'Which broker do I need?',
    a: 'Any MetaTrader 5 broker that offers gold on a cent account. We recommend Vantage, where GTC was tested with 1:500 leverage, because the results here reflect its spreads and costs.',
  },
  {
    q: 'What do USC, 1L and 10L mean?',
    a: 'USC is US cents, the unit a cent account is counted in: 100 USC is 1 USD. 1L, 3L and 10L are short for lakh: 100,000, 300,000 and 1,000,000 USC.',
  },
  {
    q: 'Do I need to understand trading?',
    a: 'No. You need a broker account, the MetaTrader app to watch, and a short call with us. We explain every number on this site in plain terms.',
  },
  {
    q: 'What can go wrong?',
    a: 'The main risk is a long one-way move in gold while trades are open, which can produce large open losses and, if it goes far enough, lose the account. Results are also from a test, not live trading. The risks section explains each point.',
  },
];

/** The questions shown on the home page; the full list lives on the How it works page. */
export const HOME_FAQ_COUNT = 5;
