import type { auth } from '$lib/server/auth';
import type { Izin, ScopePeran, TipePeran } from '$lib/akses';

type Session = typeof auth.$Infer.Session.session;
type User    = typeof auth.$Infer.Session.user;

declare global {
  namespace App {
    interface Locals {
      user:    User    | null;
      session: Session | null;
      /** Slug peran efektif user (hasil normalisasi `user.role`). */
      peranAktif: string[];
      /** Gabungan izin seluruh peran, hasil normalisasi. */
      izin: Izin;
      /** Scope data terluas dari seluruh peran. */
      scopePeran: ScopePeran;
      /** Surface aplikasi: staf (dashboard) atau warga (portal). */
      tipePeran: TipePeran;
      /** RT tugas untuk peran ber-scope `rt`; null kalau belum ditugaskan. */
      petugasRtId: number | null;
    }
  }
}

export {};
