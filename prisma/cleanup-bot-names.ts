import { PrismaClient } from '@prisma/client';
import { spamNameLinkRe } from '../lib/validators';

/**
 * One-off + repeatable cleanup for bot/signup-spam account names.
 *
 * Promo bots register with names that are actually ad copy, e.g.
 *   "🔥50.000 TL ozel bonus! Carki simdi cevir ve kazan! https://bit.ly/4oYBhMv 🔥 Go"
 * which then shows up in the admin dashboard as the user's name.
 *
 * This script rewrites such names from the user's email address
 * (e.g. "john.doe123@gmail.com" -> "John Doe 123").
 *
 *   tsx prisma/cleanup-bot-names.ts            # apply fixes
 *   tsx prisma/cleanup-bot-names.ts --dry-run  # preview only, no writes
 */

const DRY_RUN = process.argv.includes('--dry-run');

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

    for (const u of flagged) {
      const newName = nameFromEmail(u.email);
      console.log(`- ${u.email}: "${u.name}" -> "${newName}"`);
    }

    if (DRY_RUN) {
      console.log(`[dry-run] Would fix ${flagged.length} user(s). Run without --dry-run to apply.`);
      return;
    }

    // Apply in concurrent batches to keep the 48k+ updates fast without
    // hammering the Accelerate proxy with thousands of sequential calls.
    const CONCURRENCY = 25;
    let fixed = 0;
    for (let i = 0; i < flagged.length; i += CONCURRENCY) {
      const chunk = flagged.slice(i, i + CONCURRENCY);
      await Promise.all(
        chunk.map((u) => prisma.user.update({ where: { id: u.id }, data: { name: nameFromEmail(u.email) } }))
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