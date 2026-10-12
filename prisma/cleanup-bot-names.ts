import { PrismaClient } from '@prisma/client';
import { spamNameLinkRe } from '../lib/validators';

/**
 * Cleanup for bot/signup-spam account names.
 *
 * Promo bots register with names that are actually ad copy, e.g.
 *   "🔥50.000 TL ozel bonus! Carki simdi cevir ve kazan! https://bit.ly/4oYBhMv 🔥 Go"
 * which then shows up in the admin dashboard as the user's name.
 *
 * The default strategy replaces such names with a random human-looking name
 * (e.g. "Zeynep Kaya"). Pass --from-email to instead derive a name from the
 * user's email local-part (e.g. "john.doe123@gmail.com" -> "John Doe 123").
 *
 *   tsx prisma/cleanup-bot-names.ts            # apply fixes (random names)
 *   tsx prisma/cleanup-bot-names.ts --from-email
 *   tsx prisma/cleanup-bot-names.ts --dry-run  # preview only, no writes
 */

const DRY_RUN = process.argv.includes('--dry-run');
const FROM_EMAIL = process.argv.includes('--from-email');

/** Names that are mostly symbols/emoji rather than letters. */
const SYMBOL_HEAVY_RE = /[^\p{L}\p{N}\s\-_.'@]/u;

/** Promotional keywords common to scam/spam signup copy (TR/EN/FR). */
const PROMO_KEYWORDS_RE =
  /\b(bonus|kazan|kazand[ıi]r?|[çc]evir|[çc]evirme|ödül|promosyon|promotion|davet|üyelik|ücretsiz|free gift|claim|reward|prize|offer|wahtsapp|whatsapp|telegram)\b/i;

/** Detect a promo/bot name even when it carries no link. */
export function isSpamName(name: string): boolean {
  const n = name.trim();
  if (!n) return false;

  // Anything with a URL / shortener is spam.
  if (spamNameLinkRe.test(n)) return true;

  // A "name" that is mostly symbols or emoji is almost certainly spam.
  const cleanLen = n.replace(SYMBOL_HEAVY_RE, '').length;
  if (cleanLen > 0 && cleanLen / n.length < 0.5) return true;

  // A long sentence that reads like an ad pitch.
  if (PROMO_KEYWORDS_RE.test(n) && n.length > 40) return true;

  return false;
}

/** Derive a display name from the local part of an email address. */
export function nameFromEmail(email: string): string {
  const local = (email.split('@')[0] || email).trim();
  const words = local
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) return local.slice(0, 100) || 'User';

  const title = words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  return title.slice(0, 100);
}

// Common first/last names (TR + international) used to fabricate
// believable human names for spam accounts.
const FIRST_NAMES = [
  'Ahmet', 'Mehmet', 'Mustafa', 'Murat', 'Hasan', 'Hüseyin', 'İbrahim', 'Ramazan', 'Osman', 'Ömer',
  'Kemal', 'Burak', 'Emre', 'Can', 'Deniz', 'Eren', 'Kerem', 'Emir', 'Yusuf', 'Berk',
  'Arda', 'Mert', 'Oğuz', 'Serkan', 'Tolga', 'Volkan', 'Cem', 'Barış', 'Umut', 'Zafer',
  'Ayşe', 'Fatma', 'Zeynep', 'Elif', 'Merve', 'Esra', 'Selin', 'Gizem', 'Buse', 'Melis',
  'Derya', 'Beyza', 'Cansu', 'Ece', 'İrem', 'Tuba', 'Yasemin', 'Gamze', 'Hande', 'Pelin',
  'James', 'John', 'Michael', 'David', 'Daniel', 'Sarah', 'Emma', 'Olivia', 'Sophia', 'Liam',
  'Noah', 'Ethan', 'Alexander', 'Benjamin', 'Mia', 'Ava', 'Isabella', 'Charlotte', 'Amelia', 'Harper',
];

const LAST_NAMES = [
  'Yılmaz', 'Kaya', 'Demir', 'Çelik', 'Şahin', 'Yıldız', 'Yıldırım', 'Öztürk', 'Aydın', 'Özdemir',
  'Arslan', 'Doğan', 'Kılıç', 'Aslan', 'Çetin', 'Kara', 'Koç', 'Kurt', 'Özkan', 'Şimşek',
  'Aksoy', 'Aktaş', 'Altın', 'Arıkan', 'Aydoğan', 'Bozkurt', 'Ceylan', 'Çakır', 'Çoban', 'Duran',
  'Erdoğan', 'Güler', 'Güneş', 'Kaplan', 'Karaca', 'Keskin', 'Korkmaz', 'Pektaş', 'Sarı', 'Tekin',
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
];

/** Generate a random human-looking name, e.g. "Zeynep Kaya". */
export function randomName(): string {
  const first = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const last = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  return `${first} ${last}`;
}

async function main() {
  const prisma = new PrismaClient();
  try {
    // Paginate with cursor so the query stays under the 5MB Accelerate limit.
    const BATCH = 500;
    let cursor: string | undefined;
    let totalWithName = 0;
    const flagged: { id: string; email: string; name: string }[] = [];

    while (true) {
      const users = await prisma.user.findMany({
        select: { id: true, email: true, name: true },
        where: { name: { not: null } },
        orderBy: { id: 'asc' },
        take: BATCH,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      });
      if (users.length === 0) break;

      totalWithName += users.length;
      for (const u of users) {
        if (u.name && isSpamName(u.name)) {
          flagged.push({ id: u.id, email: u.email, name: u.name });
        }
      }

      cursor = users[users.length - 1].id;
      if (users.length < BATCH) break;
    }

    console.log(`Total users with a name: ${totalWithName} — spam-named: ${flagged.length}`);
    if (flagged.length === 0) {
      console.log('Nothing to fix.');
      return;
    }

    const strategy = FROM_EMAIL ? 'email-derived' : 'random';
    console.log(`Name strategy: ${strategy}`);

    for (const u of flagged) {
      const newName = FROM_EMAIL ? nameFromEmail(u.email) : randomName();
      console.log(`- ${u.email}: "${u.name}" -> "${newName}"`);
    }

    if (DRY_RUN) {
      console.log(`[dry-run] Would fix ${flagged.length} user(s). Run without --dry-run to apply.`);
      return;
    }

    // Apply in concurrent batches to keep large cleanups fast without
    // hammering the Accelerate proxy with thousands of sequential calls.
    const CONCURRENCY = 50;
    let fixed = 0;
    for (let i = 0; i < flagged.length; i += CONCURRENCY) {
      const chunk = flagged.slice(i, i + CONCURRENCY);
      await Promise.all(
        chunk.map((u) =>
          prisma.user.update({
            where: { id: u.id },
            data: { name: FROM_EMAIL ? nameFromEmail(u.email) : randomName() },
          })
        )
      );
      fixed += chunk.length;
      if (fixed % 5000 === 0 || fixed === flagged.length) {
        console.log(`Progress: ${fixed}/${flagged.length}`);
      }
    }

    console.log(`Fixed ${fixed} user(s).`);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });