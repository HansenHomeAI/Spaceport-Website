'use client';

import type { BundleStatsSummary } from '../utils/stats';
import { formatBytes, formatNumber } from '../utils/stats';

export interface ViewerRuntimeStats {
  fps?: number;
  memory?: number | null;
  progress?: number;
  cameraMode?: string;
}

interface StatsPanelProps {
  stats: BundleStatsSummary | null;
  loadTimeMs?: number | null;
  runtime: ViewerRuntimeStats | null;
  viewerReady: boolean;
}

const formatLoadTime = (ms?: number | null) => {
  if (!ms) {
    return '—';
  }
  return `${(ms / 1000).toFixed(ms >= 2000 ? 1 : 2)}s`;
};

const formatRatio = (value?: number) => {
  if (!value) {
    return '—';
  }
  return `${value.toFixed(2)}x`;
};

export function StatsPanel({ stats, loadTimeMs, runtime, viewerReady }: StatsPanelProps) {
  const fps = runtime?.fps ? runtime.fps.toFixed(0) : '—';
  const memory = runtime?.memory ? formatBytes(runtime.memory) : '—';
  const progressPercent = runtime?.progress ? Math.round(runtime.progress * 100) : 0;

  return (
    <section className="splat-card splat-stats" aria-label="Bundle stats">
      <header className="splat-card-header">
        <div>
          <p className="splat-eyebrow">Bundle telemetry</p>
          <h2>Supersplat health</h2>
        </div>
        <div className={`status-chip ${viewerReady ? 'status-green' : 'status-amber'}`} data-testid="viewer-status">
          {viewerReady ? 'Rendering' : `Loading ${progressPercent}%`}
        </div>
      </header>

      <div className="stats-grid">
        <article className="stat-item" data-testid="stat-splats">
          <p className="stat-label">Total splats</p>
          <p className="stat-value">{stats ? formatNumber(stats.splatCount) : '—'}</p>
          <p className="stat-sub">Inferred from metadata</p>
        </article>
        <article className="stat-item" data-testid="stat-bundle-size">
          <p className="stat-label">Bundle size</p>
          <p className="stat-value">{stats ? formatBytes(stats.compressedBytes) : '—'}</p>
          <p className="stat-sub">{stats ? `${stats.fileCount} files` : 'awaiting metadata'}</p>
        </article>
        <article className="stat-item" data-testid="stat-raw-size">
          <p className="stat-label">Estimated raw data</p>
          <p className="stat-value">{stats ? formatBytes(stats.estimatedRawBytes) : '—'}</p>
          <p className="stat-sub">Positions, SH, quaternions</p>
        </article>
        <article className="stat-item" data-testid="stat-compression">
          <p className="stat-label">Compression ratio</p>
          <p className="stat-value">{stats ? formatRatio(stats.compressionRatio) : '—'}</p>
          <p className="stat-sub">Raw ÷ compressed</p>
        </article>
        <article className="stat-item" data-testid="stat-load-time">
          <p className="stat-label">First frame time</p>
          <p className="stat-value">{formatLoadTime(loadTimeMs)}</p>
          <p className="stat-sub">Time to first pixels</p>
        </article>
        <article className="stat-item" data-testid="stat-fps">
          <p className="stat-label">Runtime FPS</p>
          <p className="stat-value">{fps}</p>
          <p className="stat-sub">Camera mode: {runtime?.cameraMode || '—'}</p>
        </article>
        <article className="stat-item" data-testid="stat-memory">
          <p className="stat-label">Runtime memory</p>
          <p className="stat-value">{memory}</p>
          <p className="stat-sub">Used JS heap</p>
        </article>
      </div>
    </section>
  );
}
