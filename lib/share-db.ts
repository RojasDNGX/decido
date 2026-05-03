import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789', 10);
import { AnalysisResult } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

declare global {
  var __DECIDO_DB__: Database.Database | undefined;
}

if (!global.__DECIDO_DB__) {
  global.__DECIDO_DB__ = new Database(path.join(DATA_DIR, 'shares.db'));
  global.__DECIDO_DB__.exec(`
    CREATE TABLE IF NOT EXISTS shares (
      id TEXT PRIMARY KEY,
      primaryAction TEXT NOT NULL,
      justification TEXT NOT NULL,
      priorities TEXT,
      createdAt INTEGER NOT NULL
    )
  `);
}

const db = global.__DECIDO_DB__;

interface ShareRow {
  id: string;
  primaryAction: string;
  justification: string;
  priorities: string | null;
  createdAt: number;
}

type PrioritiesStore =
  | { type: 'priorities'; data: AnalysisResult['priorities'] }
  | { type: 'tasks'; data: NonNullable<AnalysisResult['tasks']> };

export function saveShare(output: AnalysisResult): string {
  const id = nanoid();
  const prioritiesStore: PrioritiesStore | null = output.priorities?.length
    ? { type: 'priorities', data: output.priorities }
    : output.tasks?.length
    ? { type: 'tasks', data: output.tasks }
    : null;

  db.prepare(
    'INSERT INTO shares (id, primaryAction, justification, priorities, createdAt) VALUES (?, ?, ?, ?, ?)'
  ).run(
    id,
    output.primary_action || output.recommended_action || '',
    output.reason || '',
    prioritiesStore ? JSON.stringify(prioritiesStore) : null,
    Date.now()
  );

  return id;
}

export function getShare(id: string): { output: AnalysisResult } | undefined {
  const row = db.prepare('SELECT * FROM shares WHERE id = ?').get(id) as ShareRow | undefined;
  if (!row) return undefined;

  const parsed: PrioritiesStore | null = row.priorities ? JSON.parse(row.priorities) : null;

  const output: AnalysisResult = {
    primary_action: row.primaryAction,
    reason: row.justification,
    priorities: parsed?.type === 'priorities' ? parsed.data : [],
    ...(parsed?.type === 'tasks' ? { tasks: parsed.data } : {}),
  };

  return { output };
}
