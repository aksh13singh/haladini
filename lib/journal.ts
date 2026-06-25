export interface JournalPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string; // ISO
  readTime: string;
  gradient: string;
  content: { heading?: string; body: string }[];
}

export const journalPosts: JournalPost[] = [
  {
    slug: "the-art-of-hand-block-printing",
    title: "The art of hand block printing",
    excerpt:
      "A centuries-old craft, practised patiently by hand in the workshops of Jaipur. Here's how a single motif becomes a story you can hold.",
    category: "The Craft",
    date: "2026-06-12T10:00:00.000Z",
    readTime: "4 min read",
    gradient: "linear-gradient(140deg,#FC8EAC 0%,#F76C9C 55%,#7A2E45 100%)",
    content: [
      {
        body: "Long before a Haladini bedsheet reaches your home, it begins as a block of teak wood and an artisan's steady hand. Hand block printing is one of India's oldest textile traditions — and in Rajasthan, it is still very much alive.",
      },
      {
        heading: "Carving the block",
        body: "Each design starts with a master carver, who chisels intricate floral and geometric motifs into seasoned teak. A single repeat can take days to carve, and a full design may need several blocks — one for each colour.",
      },
      {
        heading: "Mixing the colours",
        body: "Dyes are mixed by eye and memory, often from natural sources. The deep indigos, soft blush pinks and earthy madders you see in our pieces are the result of generations of know-how.",
      },
      {
        heading: "Block by block",
        body: "The printer dips the block, lines it up against the last impression, and presses down with the heel of the hand. Stamp after stamp, the motif marches across metres of cloth. Tiny irregularities are not flaws — they're the signature of the handmade.",
      },
      {
        body: "Finally, the fabric is washed and sun-dried before it's cut and finished. What you receive is not just a textile, but the work of many hands and a tradition worth keeping alive.",
      },
    ],
  },
  {
    slug: "styling-block-print-at-home",
    title: "How to style block-print at home",
    excerpt:
      "Block-print is endlessly mixable. A few simple ideas for layering prints, colours and textures without overthinking it.",
    category: "Styling",
    date: "2026-05-30T10:00:00.000Z",
    readTime: "3 min read",
    gradient: "linear-gradient(140deg,#FFE9F0 0%,#FC8EAC 60%,#9A4760 100%)",
    content: [
      {
        body: "The beauty of block-print is how relaxed it feels. There are no strict rules — but a few gentle principles make mixing prints feel intentional rather than busy.",
      },
      {
        heading: "Anchor with one hero print",
        body: "Start with a statement piece — a bold floral bedsheet or a bright cushion — and let everything else play a supporting role.",
      },
      {
        heading: "Mix scale, not chaos",
        body: "Pair a large, sprawling motif with a small, tight one in the same colour family. The contrast in scale keeps things interesting while the shared palette keeps them calm.",
      },
      {
        heading: "Leave room to breathe",
        body: "A few solid, natural-toned textiles between your prints give the eye somewhere to rest. White, cream and soft blush are your friends.",
      },
    ],
  },
  {
    slug: "caring-for-handcrafted-textiles",
    title: "Caring for your handcrafted textiles",
    excerpt:
      "Natural dyes and cottons love a little gentleness. Follow these simple steps and your Haladini pieces will only get softer with time.",
    category: "Care",
    date: "2026-04-20T10:00:00.000Z",
    readTime: "2 min read",
    gradient: "linear-gradient(140deg,#9A4760 0%,#7A2E45 100%)",
    content: [
      {
        heading: "Wash gently, separately",
        body: "For the first few washes, wash your block-print pieces separately in cold water. Natural dyes may release a little colour at first — this is normal and settles quickly.",
      },
      {
        heading: "Skip the harsh stuff",
        body: "Use a mild detergent and avoid bleach or strong stain removers, which can dull the natural colours over time.",
      },
      {
        heading: "Dry in the shade",
        body: "Line-dry in shade rather than direct sun to keep the colours rich. A warm iron on the reverse brings back a crisp finish.",
      },
      {
        body: "Treated kindly, handcrafted cotton softens beautifully with every wash — becoming more yours with time.",
      },
    ],
  },
];

export function getPostBySlug(slug: string): JournalPost | undefined {
  return journalPosts.find((p) => p.slug === slug);
}
