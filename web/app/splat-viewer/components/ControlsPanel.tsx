'use client';

interface SampleBundle {
  label: string;
  value: string;
}

interface ControlsPanelProps {
  bundleInput: string;
  normalizedUrl?: string;
  onBundleInputChange: (value: string) => void;
  onSubmit: () => void;
  sampleBundles: SampleBundle[];
  onSelectSample: (value: string) => void;
  loading: boolean;
  viewerReady: boolean;
  progressPercent: number;
  errorMessage?: string | null;
  onResetCamera: () => void;
  onFrameCamera: () => void;
  qualityMode: 'quality' | 'performance';
  onQualityChange: (mode: 'quality' | 'performance') => void;
  backgroundColor: string;
  onBackgroundColorChange: (value: string) => void;
}

export function ControlsPanel({
  bundleInput,
  normalizedUrl,
  onBundleInputChange,
  onSubmit,
  sampleBundles,
  onSelectSample,
  loading,
  viewerReady,
  progressPercent,
  errorMessage,
  onResetCamera,
  onFrameCamera,
  qualityMode,
  onQualityChange,
  backgroundColor,
  onBackgroundColorChange,
}: ControlsPanelProps) {
  return (
    <section className="splat-card" aria-label="Bundle controls">
      <div className="splat-card-header">
        <div>
          <p className="splat-eyebrow">1. Load data</p>
          <h2>Connect a SOGS bundle</h2>
        </div>
        <div className={`status-chip ${viewerReady ? 'status-green' : 'status-amber'}`}>
          {viewerReady ? 'Ready' : loading ? 'Resolving bundle' : 'Waiting'}
        </div>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
        className="bundle-form"
      >
        <label htmlFor="bundleInput">S3 or HTTPS bundle URL</label>
        <div className="input-row">
          <input
            id="bundleInput"
            data-testid="bundle-input"
            value={bundleInput}
            onChange={(event) => onBundleInputChange(event.target.value)}
            placeholder="s3://bucket/path/to/supersplat"
          />
          <button type="submit" className="primary" data-testid="load-bundle">
            {loading ? 'Loading…' : 'Load bundle'}
          </button>
        </div>
        {normalizedUrl && (
          <p className="resolved-url" data-testid="normalized-url">
            Resolved: <span>{normalizedUrl}</span>
          </p>
        )}
        {errorMessage && <p className="error-text">{errorMessage}</p>}
      </form>

      <div className="sample-row">
        {sampleBundles.map((bundle) => (
          <button
            type="button"
            key={bundle.value}
            className="ghost"
            onClick={() => onSelectSample(bundle.value)}
            data-testid="sample-button"
          >
            Use {bundle.label}
          </button>
        ))}
      </div>

      <div className="progress-row" aria-live="polite">
        <div className="progress-bar">
          <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
        </div>
        <span>{progressPercent}% streamed</span>
      </div>

      <div className="splat-card-header controls-header">
        <div>
          <p className="splat-eyebrow">2. Navigation</p>
          <h2>Control the camera</h2>
        </div>
      </div>

      <div className="control-buttons">
        <button type="button" onClick={onResetCamera} disabled={!viewerReady}>
          Reset camera
        </button>
        <button type="button" onClick={onFrameCamera} disabled={!viewerReady}>
          Auto-fit
        </button>
        <label className="color-picker" htmlFor="background-color">
          Background
          <input
            id="background-color"
            type="color"
            value={backgroundColor}
            onChange={(event) => onBackgroundColorChange(event.target.value)}
            disabled={!viewerReady}
          />
        </label>
      </div>

      <div className="quality-row">
        <p className="quality-label">Quality preset</p>
        <div className="quality-toggle" role="group" aria-label="Quality preset">
          <button
            type="button"
            className={qualityMode === 'quality' ? 'active' : ''}
            onClick={() => onQualityChange('quality')}
            disabled={!viewerReady}
          >
            High fidelity
          </button>
          <button
            type="button"
            className={qualityMode === 'performance' ? 'active' : ''}
            onClick={() => onQualityChange('performance')}
            disabled={!viewerReady}
          >
            Performance
          </button>
        </div>
      </div>

      <div className="controls-note">
        <p className="splat-eyebrow">Google Maps style controls</p>
        <ul>
          <li>Left drag to orbit the splat</li>
          <li>Right drag (or two-finger drag) to pan</li>
          <li>Scroll or pinch to zoom</li>
        </ul>
      </div>
    </section>
  );
}
