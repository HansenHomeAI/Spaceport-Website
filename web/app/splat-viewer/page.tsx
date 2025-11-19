'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ControlsPanel } from './components/ControlsPanel';
import { StatsPanel, type ViewerRuntimeStats } from './components/StatsPanel';
import {
  buildSummary,
  collectBundleFiles,
  type BundleStatsSummary,
  type SogsMetadata,
} from './utils/stats';
import { resolveBundleInput, type ResolvedBundle } from './utils/s3-url';
import './splat-viewer.css';

const SAMPLE_BUNDLES = [
  { label: 'S3 demo bundle', value: 's3://spaceport-ml-processing/public-viewer/sogs-test-1753999934/' },
  { label: 'Local fixture', value: 'local:/samples/sogs-test-1753999934/' },
];

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

const parseColor = (hex: string) => {
  if (!hex.startsWith('#') || (hex.length !== 7 && hex.length !== 4)) {
    return null;
  }
  const cleaned = hex.length === 4
    ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
    : hex;
  const r = parseInt(cleaned.slice(1, 3), 16) / 255;
  const g = parseInt(cleaned.slice(3, 5), 16) / 255;
  const b = parseInt(cleaned.slice(5, 7), 16) / 255;
  return [clamp(r), clamp(g), clamp(b)];
};

const getSampleValue = (raw: string) => {
  if (raw.startsWith('local:')) {
    const relative = raw.replace('local:', '');
    if (typeof window !== 'undefined') {
      return `${window.location.origin}${relative}`;
    }
    return relative;
  }
  return raw;
};

export default function SplatViewerPage() {
  const [bundleInput, setBundleInput] = useState(SAMPLE_BUNDLES[0].value);
  const [activeBundle, setActiveBundle] = useState<ResolvedBundle | null>(null);
  const [normalizedUrl, setNormalizedUrl] = useState<string>();
  const [metadata, setMetadata] = useState<SogsMetadata | null>(null);
  const [summary, setSummary] = useState<BundleStatsSummary | null>(null);
  const [runtimeStats, setRuntimeStats] = useState<ViewerRuntimeStats | null>(null);
  const [viewerReady, setViewerReady] = useState(false);
  const [loadingBundle, setLoadingBundle] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [qualityMode, setQualityMode] = useState<'quality' | 'performance'>('quality');
  const [backgroundColor, setBackgroundColor] = useState('#040a13');
  const [loadTimeMs, setLoadTimeMs] = useState<number | null>(null);
  const loadStartRef = useRef<number | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [viewerKey, setViewerKey] = useState(0);

  const handleSelectSample = useCallback((value: string) => {
    setBundleInput(getSampleValue(value));
  }, [viewerReady]);

  const sendViewerCommand = useCallback((action: string, value?: unknown) => {
    if (typeof window === 'undefined') {
      return;
    }
    const frame = iframeRef.current;
    if (!frame?.contentWindow) {
      return;
    }
    frame.contentWindow.postMessage(
      {
        type: 'spaceport-splat:command',
        payload: { action, value },
      },
      window.location.origin,
    );
  }, []);

  const handleLoadBundle = useCallback(() => {
    try {
      const resolved = resolveBundleInput(bundleInput);
      setActiveBundle(resolved);
      setNormalizedUrl(resolved.baseUrl);
      setErrorMessage(null);
      setMetadata(null);
      setSummary(null);
      setRuntimeStats(null);
      setViewerReady(false);
      setProgressPercent(0);
      setLoadTimeMs(null);
      loadStartRef.current = typeof performance !== 'undefined' ? performance.now() : Date.now();
      setViewerKey((prev) => prev + 1);
    } catch (error) {
      setErrorMessage((error as Error).message);
    }
  }, [bundleInput]);

  useEffect(() => {
    if (!activeBundle) {
      return;
    }
    let cancelled = false;
    const fetchMetadata = async () => {
      setLoadingBundle(true);
      try {
        const response = await fetch(activeBundle.metadataUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch metadata (${response.status})`);
        }
        const json = (await response.json()) as SogsMetadata;
        if (!cancelled) {
          setMetadata(json);
          setErrorMessage(null);
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage((error as Error).message);
        }
      } finally {
        if (!cancelled) {
          setLoadingBundle(false);
        }
      }
    };
    fetchMetadata();
    return () => {
      cancelled = true;
    };
  }, [activeBundle]);

  useEffect(() => {
    if (!activeBundle || !metadata) {
      return;
    }
    let cancelled = false;
    const resolveSizes = async () => {
      const files = new Set<string>(collectBundleFiles(metadata));
      files.add('meta.json');
      files.add('settings.json');
      let total = 0;
      await Promise.all(Array.from(files).map(async (fileName) => {
        const url = fileName === 'meta.json'
          ? activeBundle.metadataUrl
          : fileName === 'settings.json'
            ? activeBundle.settingsUrl
            : `${activeBundle.baseUrl}${fileName}`;
        try {
          const response = await fetch(url, { method: 'HEAD' });
          if (!response.ok) {
            return;
          }
          const length = response.headers.get('content-length');
          if (length) {
            total += Number(length);
          }
        } catch (error) {
          console.warn('Unable to inspect', url, error);
        }
      }));
      if (!cancelled) {
        setSummary(buildSummary(metadata, total));
      }
    };
    resolveSizes();
    return () => {
      cancelled = true;
    };
  }, [activeBundle, metadata]);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (typeof window === 'undefined') {
        return;
      }
      const allowedOrigins = new Set([window.location.origin]);
      if (window.location.hostname === 'localhost') {
        allowedOrigins.add(window.location.origin.replace('localhost', '127.0.0.1'));
      } else if (window.location.hostname === '127.0.0.1') {
        allowedOrigins.add(window.location.origin.replace('127.0.0.1', 'localhost'));
      }
      if (event.origin && !allowedOrigins.has(event.origin)) {
        return;
      }
      const data = event.data as { type?: string; detail?: Record<string, unknown> };
      if (!data?.type || !data.type.startsWith('spaceport-splat')) {
        return;
      }
      const detail = data.detail ?? {};
      if (process.env.NODE_ENV !== 'production') {
        console.log('spaceport-splat:event', data.type, detail);
      }
      switch (data.type) {
        case 'spaceport-splat:firstFrame': {
          setViewerReady(true);
          if (loadStartRef.current) {
            const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
            setLoadTimeMs(now - loadStartRef.current);
            loadStartRef.current = null;
          }
          break;
        }
        case 'spaceport-splat:runtime': {
          const progress = typeof detail.progress === 'number' ? detail.progress : 0;
          setProgressPercent(Math.round(clamp(progress) * 100));
          if (detail.ready && !viewerReady) {
            setViewerReady(true);
            if (loadStartRef.current) {
              const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
              setLoadTimeMs(now - loadStartRef.current);
              loadStartRef.current = null;
            }
          }
          setRuntimeStats((prev) => ({
            ...prev,
            fps: typeof detail.fps === 'number' ? detail.fps : prev?.fps,
            memory: typeof detail.memory === 'number' ? detail.memory : prev?.memory,
            progress,
            cameraMode: typeof detail.cameraMode === 'string' ? detail.cameraMode : prev?.cameraMode,
          }));
          break;
        }
        case 'spaceport-splat:camera-mode': {
          if (typeof detail.mode === 'string') {
            setRuntimeStats((prev) => ({ ...prev, cameraMode: detail.mode }));
          }
          break;
        }
        default:
          break;
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('message', handler);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('message', handler);
      }
    };
  }, []);

  const embedSrc = useMemo(() => {
    if (!activeBundle) {
      return '';
    }
    const params = new URLSearchParams({
      content: activeBundle.metadataUrl,
      settings: activeBundle.settingsUrl,
      noui: '1',
    });
    return `/splat-viewer/embed?${params.toString()}&v=${viewerKey}`;
  }, [activeBundle, viewerKey]);

  const handleQualityChange = (mode: 'quality' | 'performance') => {
    setQualityMode(mode);
    sendViewerCommand('setQuality', mode);
  };

  const handleBackgroundChange = (value: string) => {
    setBackgroundColor(value);
    const parsed = parseColor(value);
    if (parsed) {
      sendViewerCommand('setBackground', parsed);
    }
  };

  return (
    <main className="splat-viewer-page">
      <header>
        <p className="splat-eyebrow">PlayCanvas SuperSplat</p>
        <h1>High fidelity SOGS viewer</h1>
        <p>
          Load a PlayCanvas-compatible supersplat bundle from S3, stream the WebP payloads directly in the browser,
          and drive the official renderer with Google Maps style navigation controls.
        </p>
      </header>
      <div className="viewer-grid">
        <div className="panel-column">
          <ControlsPanel
            bundleInput={bundleInput}
            normalizedUrl={normalizedUrl}
            onBundleInputChange={setBundleInput}
            onSubmit={handleLoadBundle}
            sampleBundles={SAMPLE_BUNDLES}
            onSelectSample={handleSelectSample}
            loading={loadingBundle}
            viewerReady={viewerReady}
            progressPercent={progressPercent}
            errorMessage={errorMessage}
            onResetCamera={() => sendViewerCommand('resetCamera')}
            onFrameCamera={() => sendViewerCommand('frame')}
            qualityMode={qualityMode}
            onQualityChange={handleQualityChange}
            backgroundColor={backgroundColor}
            onBackgroundColorChange={handleBackgroundChange}
          />
          <StatsPanel
            stats={summary}
            loadTimeMs={loadTimeMs}
            runtime={runtimeStats}
            viewerReady={viewerReady}
          />
        </div>
        <div className="viewer-column">
          <section className="viewer-shell" aria-label="PlayCanvas viewer">
            {embedSrc ? (
              <iframe
                key={viewerKey}
                ref={iframeRef}
                src={embedSrc}
                title="Supersplat viewer"
                allow="xr-spatial-tracking"
              />
            ) : (
              <div className="viewer-callouts">Load a bundle to start rendering.</div>
            )}
            <div className="viewer-callouts">
              Scroll to zoom • Drag to orbit • Right drag to pan
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
