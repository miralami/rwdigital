import { describe, expect, it } from 'vitest';
import { canAccessRt } from './scope';
import {
  bolehMenandatangani,
  bolehMenolak,
  dimintaTtd,
  pihakTtdDariScope,
  sudahTtd,
  type StatusTtdSurat
} from './surat-ttd';

const surat = (ubah: Partial<StatusTtdSurat> = {}): StatusTtdSurat => ({
  status: 'diajukan',
  butuhTtdRt: false,
  butuhTtdRw: false,
  ttdRtPada: null,
  ttdRwPada: null,
  ...ubah
});

describe('pihakTtdDariScope()', () => {
  it('scope all mewakili RW dan scope RT mewakili RT', () => {
    expect(pihakTtdDariScope({ kind: 'all' })).toBe('rw');
    expect(pihakTtdDariScope({ kind: 'rt', rtId: 1 })).toBe('rt');
    expect(pihakTtdDariScope({ kind: 'none' })).toBeNull();
  });
});

describe('aturan tanda tangan surat', () => {
  it('RW tidak bisa TTD kalau RW tidak diminta', () => {
    const data = surat({ butuhTtdRt: true, butuhTtdRw: false });
    expect(dimintaTtd('rw', data)).toBe(false);
    expect(sudahTtd('rw', data)).toBe(false);
    expect(bolehMenandatangani('rw', data)).toBe(false);
    expect(bolehMenolak('rw', data)).toBe(false);
  });

  it('RT tidak bisa TTD kalau RT tidak diminta', () => {
    const data = surat({ butuhTtdRt: false, butuhTtdRw: true });
    expect(dimintaTtd('rt', data)).toBe(false);
    expect(bolehMenandatangani('rt', data)).toBe(false);
    expect(bolehMenolak('rt', data)).toBe(false);
  });

  it('pihak yang diminta boleh TTD selama belum menandatangani', () => {
    const data = surat({ butuhTtdRt: true, butuhTtdRw: true });
    expect(bolehMenandatangani('rt', data)).toBe(true);
    expect(bolehMenandatangani('rw', data)).toBe(true);
    expect(bolehMenolak('rt', data)).toBe(true);
    expect(bolehMenolak('rw', data)).toBe(true);
  });

  it('pihak yang sudah TTD tidak bisa TTD dua kali', () => {
    const data = surat({
      butuhTtdRt: true,
      butuhTtdRw: true,
      ttdRtPada: '2026-11-03T10:00:00.000Z'
    });
    expect(bolehMenandatangani('rt', data)).toBe(false);
    expect(bolehMenandatangani('rw', data)).toBe(true);
  });

  it('surat final tidak bisa ditandatangani atau ditolak lagi', () => {
    for (const status of ['terbit', 'ditolak']) {
      const data = surat({ status, butuhTtdRt: true, butuhTtdRw: true });
      expect(bolehMenandatangani('rt', data)).toBe(false);
      expect(bolehMenandatangani('rw', data)).toBe(false);
      expect(bolehMenolak('rt', data)).toBe(false);
      expect(bolehMenolak('rw', data)).toBe(false);
    }
  });

  it('akun tanpa pihak tidak pernah boleh TTD', () => {
    const data = surat({ butuhTtdRt: true, butuhTtdRw: true });
    expect(bolehMenandatangani(null, data)).toBe(false);
    expect(bolehMenolak(null, data)).toBe(false);
  });
});

describe('akses baca RW', () => {
  it('scope all (RW) boleh membaca surat dari RT mana pun', () => {
    expect(canAccessRt({ kind: 'all' }, 1)).toBe(true);
    expect(canAccessRt({ kind: 'all' }, 99)).toBe(true);
  });
});
