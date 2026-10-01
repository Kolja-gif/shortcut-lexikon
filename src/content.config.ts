// Das Schema für die App-Dateien in src/data/apps/*.yaml.
// Jeder Fehler hier lässt `npm run build` mit einer verständlichen Meldung fehlschlagen.

import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { icons } from 'lucide';
import { pruefeTaste } from './lib/tasten';
import { iconSchluessel } from './lib/icon';

const taste = z.string().superRefine((wert, ctx) => {
  const fehler = pruefeTaste(wert);
  if (fehler) ctx.addIssue({ code: 'custom', message: fehler });
});

const kombination = z
  .array(taste, { error: 'Tasten bitte als Liste angeben, z. B. [cmd, T].' })
  .min(1, 'Mindestens eine Taste angeben.')
  .superRefine((tasten, ctx) => {
    if (new Set(tasten).size !== tasten.length) {
      ctx.addIssue({ code: 'custom', message: `Eine Taste kommt doppelt vor: [${tasten.join(', ')}].` });
    }
  });

const datum = z
  .union([z.date(), z.iso.date()], {
    error: 'geprueft muss ein Datum (JJJJ-MM-TT) oder null sein.',
  })
  .nullable();

const shortcut = z.object({
  id: z
    .string()
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Die id darf nur Kleinbuchstaben, Ziffern und Bindestriche enthalten (keine Umlaute).'),
  aktion: z.string().min(1, 'Die Aktion darf nicht leer sein.'),
  tasten: kombination,
  alternativ: z.array(kombination).optional(),
  kategorie: z.string().min(1, 'Bitte eine Kategorie angeben.'),
  wichtig: z.boolean().default(false),
  tags: z.array(z.coerce.string()).default([]),
  notiz: z.string().optional().transform((n) => (n?.trim() ? n.trim() : undefined)),
  geprueft: datum,
});

const app = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, 'Die App-id darf nur Kleinbuchstaben, Ziffern und Bindestriche enthalten.'),
  name: z.string().min(1),
  icon: z.string().refine((name) => iconSchluessel(name) in icons, {
    error: (issue) => `Unbekanntes Lucide-Icon „${issue.input}“. Namen nachschlagen auf https://lucide.dev/icons`,
  }),
  farbe: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Die Farbe bitte als Hex-Wert angeben, z. B. "#4285F4".'),
  reihenfolge: z.number().int(),
});

const apps = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/data/apps' }),
  schema: z
    .object({
      app,
      shortcuts: z.array(shortcut).min(1, 'Die App braucht mindestens einen Shortcut.'),
    })
    .superRefine(({ app, shortcuts }, ctx) => {
      const ids = new Map<string, number>();
      shortcuts.forEach((s, i) => {
        if (ids.has(s.id)) {
          ctx.addIssue({
            code: 'custom',
            path: ['shortcuts', i, 'id'],
            message: `Doppelte id „${s.id}“ (auch Eintrag Nr. ${ids.get(s.id)! + 1}).`,
          });
        }
        ids.set(s.id, i);
        if (!s.id.startsWith(`${app.id}-`)) {
          ctx.addIssue({
            code: 'custom',
            path: ['shortcuts', i, 'id'],
            message: `Die id „${s.id}“ muss mit „${app.id}-“ beginnen.`,
          });
        }
      });
    }),
});

export const collections = { apps };
