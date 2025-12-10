export interface SyllabusItem {
  title: string;
  duration: string;
  content?: string; // HTML/Markdown string for reading
  videoUrl?: string; // Placeholder for video
  quiz?: {
    question: string;
    options: string[];
    correctAnswer: number; // Index of correct option
  };
}

export interface Course {
  id: number;
  title: string;
  description: string;
  level: 'Débutant' | 'Intermédiaire' | 'Avancé';
  duration: string;
  modules: number;
  category: string;
  image: string;
  syllabus?: SyllabusItem[];
}

export interface MarketCoin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_24h: number;
}

export interface Article {
  id: number;
  title: string;
  excerpt: string;
  content: string[];
  readTime: string;
  date: string;
  image: string;
  category: string;
  author: string;
  authorImage: string;
}

export interface Deal {
  id: number;
  name: string;
  description: string;
  discount: string;
  category: 'Exchange' | 'Wallet' | 'Tax' | 'Trading Tool' | 'Security';
  link: string;
  logo: string;
  exclusive: boolean;
  code?: string;
}

export const COURSES_DATA: Course[] = [
  {
    id: 1,
    title: 'Les fondamentaux de la Blockchain',
    description: 'Comprenez comment fonctionne la technologie blockchain, des blocs aux nœuds, en passant par le minage et le consensus.',
    level: 'Débutant',
    duration: '35m',
    modules: 5,
    category: 'Blockchain',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop',
    syllabus: [
      { 
        title: "Qu'est-ce que la Blockchain ?", 
        duration: "5m",
        content: "La blockchain est une technologie de stockage et de transmission d'informations, transparente, sécurisée, et fonctionnant sans organe central de contrôle. Par extension, une blockchain constitue une base de données qui contient l'historique de tous les échanges effectués entre ses utilisateurs depuis sa création.",
        quiz: {
          question: "Quelle est la caractéristique principale d'une blockchain publique ?",
          options: ["Elle est contrôlée par une banque", "Elle est centralisée", "Elle est décentralisée et transparente", "Elle est secrète"],
          correctAnswer: 2
        }
      },
      { 
        title: "Comment fonctionnent les transactions ?", 
        duration: "8m",
        content: "Une transaction est un transfert de valeur entre des portefeuilles Bitcoin qui est inclus dans la chaîne de blocs. Les portefeuilles Bitcoin conservent une information secrète appelée clé privée ou graine, qui est utilisée pour signer des transactions, fournissant une preuve mathématique qu'elles proviennent du propriétaire du portefeuille.",
        quiz: {
          question: "Qu'est-ce qui est utilisé pour signer une transaction ?",
          options: ["L'adresse email", "La clé privée", "Le mot de passe du site", "L'adresse IP"],
          correctAnswer: 1
        }
      },
      { 
        title: "Preuve de Travail vs Preuve d'Enjeu", 
        duration: "10m",
        content: "La Preuve de Travail (PoW) nécessite une puissance de calcul pour sécuriser le réseau (ex: Bitcoin). La Preuve d'Enjeu (PoS) demande aux validateurs de bloquer une quantité de crypto-monnaie (ex: Ethereum).",
        quiz: {
          question: "Lequel de ces mécanismes utilise le plus d'énergie électrique ?",
          options: ["Preuve d'Enjeu (PoS)", "Preuve de Travail (PoW)", "Preuve d'Histoire", "Preuve d'Autorité"],
          correctAnswer: 1
        }
      },
      { 
        title: "La sécurité et la cryptographie", 
        duration: "7m",
        content: "La cryptographie asymétrique est utilisée pour générer des paires de clés (publique et privée). Le hachage (SHA-256 pour Bitcoin) assure l'intégrité des blocs.",
        quiz: {
          question: "Quel algorithme de hachage est utilisé par Bitcoin ?",
          options: ["MD5", "SHA-256", "Keccak-256", "Argon2"],
          correctAnswer: 1
        }
      },
      { 
        title: "Quiz de fin de module", 
        duration: "5m",
        content: "Félicitations pour être arrivé jusqu'ici. Ce dernier module récapitule l'ensemble des concepts vus précédemment.",
        quiz: {
          question: "Qu'est-ce qu'un 'Nœud' dans la blockchain ?",
          options: ["Un ordinateur connecté au réseau qui valide et relaie les transactions", "Un bug informatique", "Le créateur du Bitcoin", "Une unité de mesure"],
          correctAnswer: 0
        }
      }
    ]
  },
  {
    id: 2,
    title: 'Guide complet du trading Spot',
    description: 'Maîtrisez les ordres de marché, les ordres limites et la gestion des risques pour trader efficacement sur les marchés crypto.',
    level: 'Intermédiaire',
    duration: '90m',
    modules: 5,
    category: 'Trading',
    image: 'https://images.unsplash.com/photo-1611974765270-ca1258634369?q=80&w=2664&auto=format&fit=crop',
    syllabus: [
      { title: "Introduction aux marchés Spot", duration: "10m", quiz: { question: "Le marché Spot implique-t-il un effet de levier ?", options: ["Oui, toujours", "Non, c'est l'échange immédiat d'actifs", "Seulement le week-end", "Je ne sais pas"], correctAnswer: 1 } },
      { title: "Lire un carnet d'ordres", duration: "15m", quiz: { question: "Que représente le 'bid' ?", options: ["L'offre de vente", "La demande d'achat", "Le volume", "Le prix moyen"], correctAnswer: 1 } },
      { title: "Types d'ordres : Market, Limit, Stop", duration: "20m", quiz: { question: "Quel ordre s'exécute immédiatement au meilleur prix ?", options: ["Limit", "Stop-Loss", "Market", "Trailing Stop"], correctAnswer: 2 } },
      { title: "Gestion du risque et psychologie", duration: "25m", quiz: { question: "Quelle est une règle d'or du trading ?", options: ["Miser tout sur un seul coin", "Ne jamais investir plus que ce qu'on peut perdre", "Suivre les influenceurs aveuglément", "Acheter quand c'est haut"], correctAnswer: 1 } },
      { title: "Stratégies de base", duration: "20m", quiz: { question: "Qu'est-ce que le DCA ?", options: ["Dollar Cost Averaging", "Direct Cash Access", "Digital Currency Assets", "Daily Crypto Analysis"], correctAnswer: 0 } }
    ]
  },
  {
    id: 3,
    title: 'Introduction à la Finance Décentralisée (DeFi)',
    description: 'Découvrez comment la DeFi remplace les banques traditionnelles grâce aux DEX, au lending et au yield farming.',
    level: 'Intermédiaire',
    duration: '60m',
    modules: 5,
    category: 'DeFi',
    image: 'https://images.unsplash.com/photo-1620321023374-d1a6861a31e7?q=80&w=2832&auto=format&fit=crop',
    syllabus: [
      { title: "CeFi vs DeFi", duration: "8m" },
      { title: "Utiliser un portefeuille Web3 (Metamask)", duration: "12m" },
      { title: "Les échanges décentralisés (Uniswap)", duration: "15m" },
      { title: "Prêts et emprunts (Aave)", duration: "15m" },
      { title: "Risques de la DeFi", duration: "10m" }
    ]
  },
  {
    id: 4,
    title: 'Sécuriser votre portefeuille crypto',
    description: 'Apprenez les meilleures pratiques pour protéger vos actifs numériques contre les hacks et les arnaques.',
    level: 'Débutant',
    duration: '20m',
    modules: 4,
    category: 'Sécurité',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=2670&auto=format&fit=crop',
    syllabus: [
        { title: "Cold Wallet vs Hot Wallet", duration: "5m" },
        { title: "Sécuriser sa Seed Phrase", duration: "5m" },
        { title: "Reconnaître les tentatives de Phishing", duration: "5m" },
        { title: "Configuration 2FA et Yubikey", duration: "5m" }
    ]
  },
  {
    id: 5,
    title: 'Comprendre les NFT et le Métavers',
    description: 'Plongez dans le monde des jetons non fongibles et découvrez comment ils redéfinissent la propriété numérique.',
    level: 'Débutant',
    duration: '45m',
    modules: 4,
    category: 'NFT',
    image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2574&auto=format&fit=crop',
    syllabus: [
        { title: "Qu'est-ce un NFT ?", duration: "8m" },
        { title: "Cas d'usage : Art, Gaming, Utilité", duration: "12m" },
        { title: "Comment acheter sur OpenSea", duration: "15m" },
        { title: "Le futur du Métavers", duration: "10m" }
    ]
  },
  {
    id: 6,
    title: 'Analyse Technique : Chandeliers Japonais',
    description: 'Apprenez à lire les graphiques de prix et à identifier les tendances futures grâce aux chandeliers japonais.',
    level: 'Avancé',
    duration: '120m',
    modules: 5,
    category: 'Trading',
    image: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?q=80&w=2670&auto=format&fit=crop',
    syllabus: [
        { title: "Histoire des chandeliers japonais", duration: "10m" },
        { title: "Patterns de retournement haussier", duration: "30m" },
        { title: "Patterns de retournement baissier", duration: "30m" },
        { title: "Patterns de continuation", duration: "30m" },
        { title: "Combiner avec d'autres indicateurs", duration: "20m" }
    ]
  }
];

export const MOCK_MARKET_DATA: MarketCoin[] = [
  { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png', current_price: 64231.45, market_cap: 1264890000000, market_cap_rank: 1, total_volume: 35000000000, price_change_percentage_24h: 2.4 },
  { id: 'ethereum', symbol: 'eth', name: 'Ethereum', image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png', current_price: 3452.12, market_cap: 415230000000, market_cap_rank: 2, total_volume: 15000000000, price_change_percentage_24h: -1.2 },
  { id: 'tether', symbol: 'usdt', name: 'Tether', image: 'https://assets.coingecko.com/coins/images/325/large/Tether.png', current_price: 1.00, market_cap: 103400000000, market_cap_rank: 3, total_volume: 45000000000, price_change_percentage_24h: 0.05 },
  { id: 'binancecoin', symbol: 'bnb', name: 'BNB', image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png', current_price: 590.50, market_cap: 87000000000, market_cap_rank: 4, total_volume: 1200000000, price_change_percentage_24h: 0.5 },
  { id: 'solana', symbol: 'sol', name: 'Solana', image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png', current_price: 145.20, market_cap: 65000000000, market_cap_rank: 5, total_volume: 2500000000, price_change_percentage_24h: 5.7 },
  { id: 'ripple', symbol: 'xrp', name: 'XRP', image: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png', current_price: 0.62, market_cap: 34000000000, market_cap_rank: 6, total_volume: 1200000000, price_change_percentage_24h: 1.1 },
  { id: 'usdc', symbol: 'usdc', name: 'USDC', image: 'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png', current_price: 1.00, market_cap: 32000000000, market_cap_rank: 7, total_volume: 3000000000, price_change_percentage_24h: 0.0 },
  { id: 'cardano', symbol: 'ada', name: 'Cardano', image: 'https://assets.coingecko.com/images/975/large/cardano.png', current_price: 0.45, market_cap: 16000000000, market_cap_rank: 9, total_volume: 400000000, price_change_percentage_24h: -0.8 },
  { id: 'avalanche-2', symbol: 'avax', name: 'Avalanche', image: 'https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png', current_price: 35.60, market_cap: 13000000000, market_cap_rank: 10, total_volume: 350000000, price_change_percentage_24h: 3.2 },
  { id: 'dogecoin', symbol: 'doge', name: 'Dogecoin', image: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png', current_price: 0.16, market_cap: 23000000000, market_cap_rank: 8, total_volume: 1500000000, price_change_percentage_24h: 4.5 },
];

export const ARTICLES_DATA: Article[] = [
  {
    id: 1,
    title: "Why Stablecoins Are Nigeria's Favorite Crypto (and What They Really Are)",
    excerpt: "Stablecoins have become a lifeline for many Nigerians facing currency devaluation. Learn how they work and why adoption is skyrocketing across the continent.",
    content: [
      "Le halving du Bitcoin est un événement programmé dans le code source du Bitcoin qui divise par deux la récompense accordée aux mineurs pour la validation d'un bloc. Cet événement se produit environ tous les quatre ans.",
      "Pourquoi est-ce important ? Le halving contrôle l'inflation du Bitcoin en réduisant l'offre de nouveaux coins entrant sur le marché. C'est ce mécanisme qui rend le Bitcoin déflationniste par nature.",
      "Historiquement, chaque halving a été suivi d'une période de volatilité accrue et, souvent, d'un marché haussier (bull run) significatif."
    ],
    readTime: "4 min",
    date: "Monday, Nov 17, 2025",
    image: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=2555&auto=format&fit=crop",
    category: "Stablecoins",
    author: "Jean Dupont",
    authorImage: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: 2,
    title: "10 Things Every African Should Know Before Stepping Into Web3",
    excerpt: "The Web3 landscape is full of opportunities but also risks. Here is your essential guide to navigating the decentralized web safely.",
    content: [
      "La mise à jour Dencun d'Ethereum marque une étape cruciale dans la feuille de route de scalabilité de la blockchain. Au cœur de cette mise à jour se trouve le EIP-4844.",
      "Cette innovation introduit un nouveau type de transaction qui permet aux Rollups (Layer 2) de stocker des données sur la chaîne principale de manière beaucoup plus économique."
    ],
    readTime: "5 min",
    date: "Saturday, Sep 20, 2025",
    image: "https://images.unsplash.com/photo-1622630998477-20aa696c6c5c?q=80&w=2664&auto=format&fit=crop",
    category: "Education",
    author: "Sophie Martin",
    authorImage: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    id: 3,
    title: "Coinlect Quarterly Chain Mindshare Report – Q3 2025",
    excerpt: "A deep dive into on-chain data revealing the fastest growing ecosystems in Francophone Africa.",
    content: [
      "Le Liquid Restaking est la dernière tendance chaude de la DeFi. Il permet aux utilisateurs de 'restaker' leurs ETH pour sécuriser d'autres services.",
      "Si la promesse de rendements plus élevés est séduisante, elle s'accompagne de risques complexes."
    ],
    readTime: "4 min",
    date: "Monday, Aug 25, 2025",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop",
    category: "Trending",
    author: "Marc Levy",
    authorImage: "https://randomuser.me/api/portraits/men/64.jpg"
  },
  {
    id: 4,
    title: "These Builders Share $1M Prize Pool at Base's Batches",
    excerpt: "Innovation is booming on Base. Meet the winners of the latest hackathon building the future of finance.",
    content: ["Content placeholder..."],
    readTime: "5 min",
    date: "Wednesday, Aug 13, 2025",
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=2670&auto=format&fit=crop",
    category: "Article",
    author: "Sarah Connor",
    authorImage: "https://randomuser.me/api/portraits/women/12.jpg"
  },
  {
    id: 5,
    title: "Spend Crypto Like Cash: Here Are 2 Best Crypto Cards",
    excerpt: "Spending your digital assets in the real world has never been easier. We review the top cards available now.",
    content: ["Content placeholder..."],
    readTime: "4 min",
    date: "Wednesday, Jul 30, 2025",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=2670&auto=format&fit=crop",
    category: "Trending",
    author: "John Doe",
    authorImage: "https://randomuser.me/api/portraits/men/45.jpg"
  }
];

export const DEALS_DATA: Deal[] = [
  {
    id: 1,
    name: "Binance",
    description: "The world's largest crypto exchange. Access over 350 cryptocurrencies with low fees.",
    discount: "100 USDT Welcome Bonus",
    category: "Exchange",
    link: "#",
    logo: "https://res.cloudinary.com/drsd8adkq/image/upload/v1765268653/binance_wice95.png",
    exclusive: true
  },
  {
    id: 2,
    name: "OKX",
    description: "One of the most trusted crypto exchanges. Trade spots and derivatives with world-class security.",
    discount: "Mystery Box up to $10,000",
    category: "Exchange",
    link: "#",
    logo: "https://res.cloudinary.com/drsd8adkq/image/upload/v1765268654/okx_tofb2z.png",
    exclusive: true
  },
  {
    id: 3,
    name: "KuCoin",
    description: "The People's Exchange. Find the next crypto gem before everyone else.",
    discount: "20% OFF Trading Fees",
    category: "Exchange",
    link: "#",
    logo: "https://res.cloudinary.com/drsd8adkq/image/upload/v1765268654/kucoin_sbnxez.png",
    exclusive: false
  },
  {
    id: 4,
    name: "Bybit",
    description: "Professional crypto derivatives exchange. High liquidity and advanced matching engine.",
    discount: "$30,000 Deposit Blastoff",
    category: "Exchange",
    link: "#",
    logo: "https://res.cloudinary.com/drsd8adkq/image/upload/v1765268654/byit_lc7stv.png",
    exclusive: true
  },
  {
    id: 5,
    name: "MEXC",
    description: "High performance trading engine. Access new listings faster than anywhere else.",
    discount: "1,000 USDT Bonus",
    category: "Exchange",
    link: "#",
    logo: "https://res.cloudinary.com/drsd8adkq/image/upload/v1765268654/mexc_w3lupl.png",
    exclusive: true
  },
  {
    id: 6,
    name: "Weex",
    description: "Secure and easy-to-use crypto trading platform for everyone.",
    discount: "Welcome Rewards",
    category: "Exchange",
    link: "#",
    logo: "https://res.cloudinary.com/drsd8adkq/image/upload/v1765268654/weex_weulov.png",
    exclusive: false
  },
  /* 
  {
    id: 7,
    name: "BingX",
    description: "Social trading exchange. Copy the best traders and grow your portfolio.",
    discount: "Copy Trading Subsidy",
    category: "Exchange",
    link: "#",
    logo: "https://res.cloudinary.com/drsd8adkq/image/upload/v1765191319/BingX_Logo.png",
    exclusive: false
  },
  {
    id: 8,
    name: "Gate.io",
    description: "Your gateway to crypto. Trade over 1,400 cryptocurrencies safely and quickly.",
    discount: "10% Fee Discount",
    category: "Exchange",
    link: "#",
    logo: "https://res.cloudinary.com/drsd8adkq/image/upload/v1765191319/Gateio_Logo.png",
    exclusive: false
  },
  {
    id: 11,
    name: "Ledger",
    description: "Secure your crypto assets with the industry standard hardware wallet. Keep your private keys offline.",
    discount: "Free Shipping on Nano X",
    category: "Wallet",
    link: "#",
    logo: "https://assets.coingecko.com/coins/images/13446/small/ledger_stax.jpeg",
    exclusive: false
  },
   {
    id: 12,
    name: "NordVPN",
    description: "Protect your privacy while trading. Essential for accessing geo-restricted dApps and securing public Wi-Fi.",
    discount: "68% OFF + 3 Months Free",
    category: "Security",
    link: "#",
    logo: "https://s1.nordcdn.com/nordvpn/media/1.669.0/images/global/logos/square/nordvpn-logo-square.svg",
    exclusive: true
  },
  {
    id: 13,
    name: "Trezor",
    description: "The original hardware wallet. Open-source security for your digital independence.",
    discount: "10% OFF Model T",
    category: "Wallet",
    link: "#",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Trezor_Logo_Square.png",
    exclusive: false
  }
  */
];
