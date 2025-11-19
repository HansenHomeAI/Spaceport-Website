import { NextResponse } from 'next/server';
import { html as viewerHtml } from '@playcanvas/supersplat-viewer';

const CSS_PLACEHOLDER = './index.css';
const JS_PLACEHOLDER = "import { main } from './index.js';";
const ASSET_BASE = '/splat-viewer/embed';
const BRIDGE_CALL_ANCHOR = 'const viewer = await main(appElement.app, cameraElement.entity, settingsJson, config);';

const bridgeScript = `
        <script type="module">
            const resolveTargetOrigin = () => {
                try {
                    return window.parent?.location?.origin || window.origin;
                } catch (error) {
                    return window.origin;
                }
            };

            const emit = (type, detail = {}) => {
                if (window.parent && window.parent !== window) {
                    const targetOrigin = resolveTargetOrigin();
                    window.parent.postMessage({ type, detail }, targetOrigin || '*');
                }
            };

            const clamp01 = (value) => Math.max(0, Math.min(1, value));
            const defaultCamera = {
                position: [0, 0, 6],
                target: [0, 0, 0],
                fov: 60,
            };
            const defaultPostEffects = {
                sharpness: { enabled: false, amount: 0 },
                bloom: { enabled: false, intensity: 1, blurLevel: 2 },
                grading: { enabled: false, brightness: 0, contrast: 1, saturation: 1, tint: [1, 1, 1] },
                vignette: { enabled: false, intensity: 0.5, inner: 0.3, outer: 0.75, curvature: 1 },
                fringing: { enabled: false, intensity: 0.5 }
            };
            const defaultSettings = {
                version: 2,
                tonemapping: 'none',
                highPrecisionRendering: false,
                background: { color: [0, 0, 0] },
                postEffectSettings: defaultPostEffects,
                animTracks: [],
                cameras: [{ name: 'default', initial: defaultCamera }],
                annotations: [],
                startMode: 'orbit',
                hasStartPose: true
            };
            const asVec3 = (value, fallback) => (Array.isArray(value) && value.length === 3 ? value : fallback);
            const normalizeSettings = (incoming = {}) => {
                const legacyCamera = incoming.camera || incoming.cameras?.[0]?.initial || {};
                const backgroundColor = Array.isArray(incoming.background?.color) && incoming.background.color.length >= 3
                    ? incoming.background.color.slice(0, 3)
                    : defaultSettings.background.color;
                const camera = {
                    position: asVec3(legacyCamera.position, defaultCamera.position),
                    target: asVec3(legacyCamera.target, defaultCamera.target),
                    fov: Number.isFinite(legacyCamera.fov) ? legacyCamera.fov : defaultCamera.fov
                };
                const animTracks = Array.isArray(incoming.animTracks) ? incoming.animTracks : [];
                return {
                    ...defaultSettings,
                    background: { color: backgroundColor },
                    animTracks,
                    cameras: [{ name: incoming.cameras?.[0]?.name || 'default', initial: camera }],
                    annotations: Array.isArray(incoming.annotations) ? incoming.annotations : [],
                    startMode: incoming.startMode || (legacyCamera.startAnim === 'animTrack' ? 'animTrack' : 'orbit'),
                };
            };
            if (window.sse) {
                window.sse.settings = (window.sse.settings || Promise.resolve({}))
                    .catch(() => ({}))
                    .then(normalizeSettings);
            }

            window.__spaceportBridge = {
                init(viewer) {
                    const { events, state, app } = viewer.global;
                    console.log('[spaceport] bridge init');
                    emit('spaceport-splat:bridge-ready', { ready: state.readyToRender });

                    events.on('firstFrame', () => {
                        emit('spaceport-splat:firstFrame', { ready: true });
                    });

                    events.on('cameraMode:changed', (mode) => {
                        emit('spaceport-splat:camera-mode', { mode });
                    });

                    const sendRuntime = () => {
                        const fps = app?.stats?.frame?.fps ?? 0;
                        const memory = (performance?.memory?.usedJSHeapSize) ?? null;
                        emit('spaceport-splat:runtime', {
                            fps,
                            memory,
                            progress: state.progress,
                            ready: state.readyToRender,
                            cameraMode: state.cameraMode,
                        });
                    };

                    const runtimeInterval = setInterval(sendRuntime, 1000);

                    const setBackground = (rgb) => {
                        if (!rgb || rgb.length < 3) {
                            return;
                        }
                        const gd = app.graphicsDevice;
                        const gl = gd.gl;
                        const r = clamp01(rgb[0]);
                        const g = clamp01(rgb[1]);
                        const b = clamp01(rgb[2]);
                        if (gd.clearColor?.set) {
                            gd.clearColor.set(r, g, b, 1);
                        }
                        if (gl?.clearColor) {
                            gl.clearColor(r, g, b, 1);
                        }
                        app.renderNextFrame = true;
                    };

                    window.addEventListener('message', (event) => {
                        if (event.origin && event.origin !== window.origin) {
                            return;
                        }
                        const { data } = event;
                        if (!data || data.type !== 'spaceport-splat:command') {
                            return;
                        }
                        const payload = data.payload || {};
                        switch (payload.action) {
                            case 'resetCamera':
                                events.fire('inputEvent', 'reset');
                                break;
                            case 'frame':
                                events.fire('inputEvent', 'frame');
                                break;
                            case 'setQuality':
                                state.hqMode = payload.value !== 'performance';
                                break;
                            case 'setCameraMode':
                                if (payload.value) {
                                    state.cameraMode = payload.value;
                                }
                                break;
                            case 'setBackground':
                                setBackground(payload.value);
                                break;
                            default:
                                break;
                        }
                    });

                    window.addEventListener('unload', () => {
                        clearInterval(runtimeInterval);
                    });
                }
            };
        </script>`;

const buildHtml = () => {
  const assetsHref = `${ASSET_BASE}/assets.css`;
  const runtimeHref = `${ASSET_BASE}/runtime.js`;
  let output = viewerHtml.replace(CSS_PLACEHOLDER, assetsHref);
  output = output
    .replace(JS_PLACEHOLDER, `import { main } from '${runtimeHref}';`)
    .replace(/'\.\/index\.js'/g, `'${runtimeHref}'`);
  output = output.replace('</head>', `${bridgeScript}\n    </head>`);
  output = output.replace(
    BRIDGE_CALL_ANCHOR,
    `${BRIDGE_CALL_ANCHOR}\n                window.__spaceportBridge?.init?.(viewer);\n`,
  );
  return output;
};

const prebuiltHtml = buildHtml();

export const dynamic = 'force-static';

export function GET() {
  return new NextResponse(prebuiltHtml, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}
