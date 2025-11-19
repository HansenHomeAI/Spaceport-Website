<!-- a2e61dd3-57cf-4e17-a589-ebb1a1057122 14cfb869-23f1-4a76-a6e9-d19945172b5c -->
# PlayCanvas SOGS Splat Viewer Implementation

## Overview

Build a production-ready PlayCanvas-based viewer for SOGS compressed bundles stored in S3, with Google Maps-like navigation controls, performance stats display, and Playwright visual verification tests.

## Verified SOGS Bundle Structure

### S3 Path Structure

- **Primary**: `s3://spaceport-ml-processing/compressed/{jobId}/supersplat_bundle/`
- **Alternative**: `s3://spaceport-ml-pipeline/jobs/{jobId}/compressed/supersplat_bundle/`
- **Test Example**: `s3://spaceport-ml-processing/public-viewer/sogs-test-1753999934/`

### Bundle Contents (Required Files)

- `means_l.webp` - Low precision position data
- `means_u.webp` - High precision position data  
- `scales.webp` - Scale parameters
- `quats.webp` - Quaternion rotations
- `sh0.webp` - Base spherical harmonics (RGBA)
- `shN_centroids.webp` - Higher-order SH centroids
- `shN_labels.webp` - SH cluster labels
- `metadata.json` - Bundle metadata with mins/maxs and file references

## Architecture

### Frontend Component

- **Location**: `web/app/splat-viewer/page.tsx` (new route)
- **Library**: PlayCanvas SuperSplat viewer (`@playcanvas/supersplat`)
- **S3 Access**: Direct HTTPS URLs (convert s3:// to https://) or presigned URLs if needed
- **UI Framework**: React with Next.js App Router

### Key Features

1. **S3 URL Input**: Paste S3 URL (s3:// or https://) to load SOGS bundle
2. **PlayCanvas Integration**: Official `@playcanvas/supersplat` library
3. **Google Maps-like Controls**: 

   - Left-click drag: Rotate/orbit camera
   - Right-click drag: Pan
   - Scroll wheel: Zoom in/out
   - Touch: Pinch to zoom, drag to rotate/pan

4. **Stats Display Panel**: 

   - Total bundle size
   - Number of splats
   - Load time
   - FPS performance
   - Memory usage
   - Compression ratio (if available)

5. **UI Controls**: 

   - Reset camera button
   - Auto-fit to model
   - Background color picker
   - Quality/performance toggle

6. **Loading States**: Progress indicators, error handling
7. **Responsive Design**: Desktop and mobile support

### Testing

- **Playwright Tests**: `tests/playwright/splat-viewer.spec.ts`
- **Visual Verification**: Screenshot comparisons, interaction tests
- **MCP Integration**: Use existing Playwright MCP setup

## Implementation Steps

### Phase 1: Core Viewer Setup

1. Install PlayCanvas SuperSplat: `npm install @playcanvas/supersplat` in `web/`
2. Create `web/app/splat-viewer/page.tsx` with React component structure
3. Set up PlayCanvas canvas element with proper sizing
4. Initialize SuperSplat viewer with proper error handling
5. Implement S3 URL parsing and conversion (s3:// to https://)

### Phase 2: Google Maps-like Controls

1. Implement orbit controls (left-click drag rotates camera around model)
2. Implement pan controls (right-click drag moves camera)
3. Implement zoom controls (scroll wheel, pinch gesture)
4. Add camera reset button (returns to default view)
5. Add auto-fit function (frames model in view)
6. Handle touch gestures for mobile

### Phase 3: S3 Integration & Loading

1. Create URL input component with paste support
2. Validate S3 URL format (s3:// or https://)
3. Convert s3:// URLs to https:// for browser access
4. Load metadata.json first to verify bundle structure
5. Load WebP textures with progress tracking
6. Handle loading errors gracefully (missing files, network errors)

### Phase 4: Stats Display Panel

1. Create stats panel component
2. Track bundle size (from metadata or fetch headers)
3. Display splat count (from metadata.json)
4. Measure and display load time
5. Implement FPS counter using requestAnimationFrame
6. Display compression ratio if available in metadata
7. Style with project design system (25px border radius, typography)

### Phase 5: UI Polish

1. Add loading spinner during bundle load
2. Style controls with project design system
3. Add keyboard shortcuts (R for reset, F for fit)
4. Implement error messages with retry option
5. Add help tooltip explaining controls

### Phase 6: Playwright Tests

1. Create `tests/playwright/splat-viewer.spec.ts`
2. Test S3 URL input and loading
3. Test camera interactions (rotate, pan, zoom)
4. Test stats display accuracy
5. Visual regression tests with screenshots
6. Integration with Playwright MCP for automated verification
7. Test error handling (invalid URLs, missing files)

## Technical Details

### PlayCanvas SuperSplat Usage

```typescript
import { SuperSplatViewer } from '@playcanvas/supersplat';

const viewer = new SuperSplatViewer(canvasElement);
await viewer.loadFromUrl('https://bucket.s3.region.amazonaws.com/path/to/bundle/');
```

### S3 URL Conversion

```typescript
function convertS3ToHttps(s3Url: string): string {
  // s3://bucket/key -> https://bucket.s3.region.amazonaws.com/key
  const match = s3Url.match(/^s3:\/\/([^\/]+)\/(.+)$/);
  if (match) {
    const [, bucket, key] = match;
    return `https://${bucket}.s3.us-west-2.amazonaws.com/${key}`;
  }
  return s3Url; // Already HTTPS
}
```

### Stats Tracking

- Bundle size: `Content-Length` header or sum of individual files
- Splat count: `metadata.json.means.shape[0]`
- Load time: `performance.now()` difference
- FPS: Frame counter with `requestAnimationFrame`
- Memory: `performance.memory` (if available)

### Google Maps Control Mapping

- **Left-click drag**: Orbit camera (like rotating map)
- **Right-click drag**: Pan camera (like dragging map)
- **Scroll wheel**: Zoom (like map zoom)
- **Double-click**: Zoom in (like map double-click)
- **Touch pinch**: Zoom
- **Touch drag**: Rotate/pan

## Dependencies

- `@playcanvas/supersplat`: Official PlayCanvas library for SOGS rendering
- Existing: React, Next.js, TypeScript, Playwright

## File Structure

```
web/app/splat-viewer/
  ├── page.tsx              # Main viewer component
  ├── components/
  │   ├── SplatViewer.tsx   # PlayCanvas viewer wrapper
  │   ├── StatsPanel.tsx    # Performance stats display
  │   └── Controls.tsx      # Camera control buttons
  └── utils/
      ├── s3-url.ts          # S3 URL conversion utilities
      └── stats.ts           # Performance tracking utilities

tests/playwright/
  └── splat-viewer.spec.ts   # Visual verification tests
```

### To-dos

- [ ] Add @playcanvas/supersplat dependency to web/package.json
- [ ] Create web/app/splat-viewer/page.tsx with PlayCanvas SuperSplat viewer component
- [ ] Create web/app/splat-viewer/splat-viewer.css with 25px border radius styling
- [ ] Implement S3 URL handling and SOGS bundle detection/loading logic
- [ ] Add camera controls (orbit, zoom, reset) and settings panel UI
- [ ] Create scripts/test_splat_viewer_quality.mjs with visual quality verification tests