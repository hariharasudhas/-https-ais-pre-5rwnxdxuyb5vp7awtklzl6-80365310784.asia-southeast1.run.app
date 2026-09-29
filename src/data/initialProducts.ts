import { Product, Category } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-fashion',
    name: 'Fashion',
    icon: 'Shirt',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80',
    itemCount: 24
  },
  {
    id: 'cat-beauty',
    name: 'Beauty',
    icon: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
    itemCount: 18
  },
  {
    id: 'cat-electronics',
    name: 'Electronics',
    icon: 'Smartphone',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    itemCount: 32
  },
  {
    id: 'cat-accessories',
    name: 'Accessories',
    icon: 'Watch',
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80',
    itemCount: 21
  },
  {
    id: 'cat-home',
    name: 'Home',
    icon: 'Home',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
    itemCount: 15
  },
  {
    id: 'cat-care',
    name: 'Personal Care',
    icon: 'Heart',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
    itemCount: 12
  },
  {
    id: 'cat-other',
    name: 'Other',
    icon: 'Grid',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    itemCount: 9
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'mrp-001',
    name: 'AcousticPro Studio Wireless Noise-Cancelling Headphones',
    category: 'Electronics',
    description: 'Immersive spatial audio with dynamic head tracking, active noise cancellation, transparency mode, and ultra-plush memory foam ear cushions. Up to 40 hours of playtime on a single charge.',
    originalPrice: 349,
    discountPrice: 279,
    discountPercent: 20,
    stock: 14,
    rating: 4.8,
    reviewsCount: 128,
    featured: true,
    popular: true,
    newArrival: false,
    createdAt: '2026-03-01T10:00:00Z',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'mrp-002',
    name: 'Milano Tailored Italian Wool Trench Coat',
    category: 'Fashion',
    description: 'Crafted from virgin Italian merino wool with a water-repellent finish. Features double-breasted horn buttons, belted waist, structured lapels, and satin cupro lining for exceptional draping.',
    originalPrice: 480,
    discountPrice: 384,
    discountPercent: 20,
    stock: 8,
    rating: 4.9,
    reviewsCount: 84,
    featured: true,
    popular: true,
    newArrival: false,
    createdAt: '2026-03-10T12:00:00Z',
    images: [
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'mrp-003',
    name: 'Luminary Chronograph 41mm Stainless Watch',
    category: 'Accessories',
    description: 'Handcrafted precision automatic movement with sapphire crystal glass, 50m water resistance, exhibition caseback, and interchangeable top-grain alligator embossed leather strap.',
    originalPrice: 599,
    discountPrice: 449,
    discountPercent: 25,
    stock: 12,
    rating: 5.0,
    reviewsCount: 62,
    featured: true,
    popular: false,
    newArrival: true,
    createdAt: '2026-03-24T08:00:00Z',
    images: [
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'mrp-004',
    name: 'Botanical Radiance Restorative Night Elixir',
    category: 'Beauty',
    description: 'Infused with cold-pressed rosehip seed oil, bakuchiol, and bioactive botanical squalane. Restores the epidermal barrier, enhances skin elasticity, and illuminates overnight.',
    originalPrice: 120,
    discountPrice: 89,
    discountPercent: 26,
    stock: 25,
    rating: 4.7,
    reviewsCount: 215,
    featured: false,
    popular: true,
    newArrival: true,
    createdAt: '2026-03-22T14:30:00Z',
    images: [
      'https://images.unsplash.com/photo-1608248597359-00994f29517c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'mrp-005',
    name: 'Nordic Minimalist Ceramic Table Lamp',
    category: 'Home',
    description: 'Sculptural organic silhouette in textured matte chalk ceramic paired with a natural linen drum shade. Warm dimmable LED ambiance suitable for bedroom, study, or living credenza.',
    originalPrice: 195,
    discountPrice: 149,
    discountPercent: 24,
    stock: 11,
    rating: 4.8,
    reviewsCount: 47,
    featured: true,
    popular: false,
    newArrival: true,
    createdAt: '2026-03-26T09:00:00Z',
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'mrp-006',
    name: 'UltraSonic Sonic Toothbrush with UV Sanitizer',
    category: 'Personal Care',
    description: '48,000 vibrations per minute with 5 customizable brushing modes, wireless inductive charging glass, auto-timer, and dual-bulb ultraviolet travel sanitizing case.',
    originalPrice: 140,
    discountPrice: 99,
    discountPercent: 29,
    stock: 30,
    rating: 4.6,
    reviewsCount: 93,
    featured: false,
    popular: true,
    newArrival: false,
    createdAt: '2026-03-05T11:00:00Z',
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1559599101-f09722fb4948?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'mrp-007',
    name: 'Smart OLED 4K 120Hz Ultra-Slim Gaming Monitor',
    category: 'Electronics',
    description: '0.03ms response time with true 10-bit color, 99% DCI-P3 gamut, AMD FreeSync Premium Pro, and ambient halo lighting. USB-C 90W power delivery hub built-in.',
    originalPrice: 899,
    discountPrice: 749,
    discountPercent: 17,
    stock: 6,
    rating: 4.9,
    reviewsCount: 42,
    featured: false,
    popular: true,
    newArrival: true,
    createdAt: '2026-03-27T16:00:00Z',
    images: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'mrp-008',
    name: 'Full-Grain Calfskin Everyday Minimalist Tote',
    category: 'Fashion',
    description: 'Unlined buttery soft Italian leather that softens beautifully with age. Roomy main compartment with laptop sleeve, gold-toned magnetic closure, and reinforced shoulder straps.',
    originalPrice: 320,
    discountPrice: 249,
    discountPercent: 22,
    stock: 15,
    rating: 4.8,
    reviewsCount: 76,
    featured: true,
    popular: true,
    newArrival: false,
    createdAt: '2026-03-12T13:00:00Z',
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80'
    ]
  }
];
