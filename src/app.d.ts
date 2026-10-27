import type { auth } from '$lib/server/auth';

type Session = typeof auth.$Infer.Session.session;
type User    = typeof auth.$Infer.Session.user;

declare global {
  namespace App {
    interface Locals {
      user:    User    | null;
      session: Session | null;
      /** RT tugas untuk akun `pengurus_rt`; null kalau belum ditugaskan. */
      petugasRtId: number | null;
    }
  }
}

export {};
