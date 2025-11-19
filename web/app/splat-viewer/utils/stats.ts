export interface SogsField {
  shape?: number[];
  dtype?: string;
  files?: string[];
  encoding?: string;
}

export interface SogsMetadata {
  means?: SogsField;
  scales?: SogsField;
  quats?: SogsField;
  sh0?: SogsField;
  shN?: SogsField;
  [field: string]: SogsField | undefined;
}

export interface BundleStatsSummary {
  splatCount: number;
  compressedBytes: number;
  estimatedRawBytes: number;
  compressionRatio: number;
  fileCount: number;
}

const BYTE_SIZES: Record<string, number> = {
  float32: 4,
  float: 4,
  uint8: 1,
  int8: 1,
  uint16: 2,
  int16: 2,
  float16: 2,
};

const flattenProduct = (shape?: number[]) =>
  (shape && shape.length ? shape.reduce((acc, value) => acc * value, 1) : 0);

const estimateFieldBytes = (field?: SogsField) => {
  if (!field?.dtype) {
    return 0;
  }
  const perValue = BYTE_SIZES[field.dtype] ?? 4;
  return flattenProduct(field.shape) * perValue;
};

export const estimateRawBytes = (metadata: SogsMetadata | null) => {
  if (!metadata) {
    return 0;
  }
  return Object.values(metadata).reduce((total, field) => total + estimateFieldBytes(field), 0);
};

export const collectBundleFiles = (metadata: SogsMetadata | null) => {
  if (!metadata) {
    return [];
  }
  const files = new Set<string>();
  Object.values(metadata).forEach((field) => {
    field?.files?.forEach((file) => files.add(file));
  });
  return Array.from(files);
};

export const formatBytes = (bytes?: number) => {
  if (!bytes || Number.isNaN(bytes)) {
    return '—';
  }
  if (bytes < 1024) {
    return `${bytes.toFixed(0)} B`;
  }
  const units = ['KB', 'MB', 'GB'];
  let value = bytes / 1024;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value.toFixed(value >= 10 ? 1 : 2)} ${units[unitIndex]}`;
};

export const formatNumber = (value?: number) => {
  if (value === undefined || Number.isNaN(value)) {
    return '—';
  }
  return value.toLocaleString();
};

export const buildSummary = (
  metadata: SogsMetadata | null,
  compressedBytes: number,
): BundleStatsSummary | null => {
  if (!metadata?.means?.shape?.length) {
    return null;
  }
  const splatCount = metadata.means.shape[0];
  const estimatedRawBytes = estimateRawBytes(metadata);
  const compressionRatio = estimatedRawBytes && compressedBytes
    ? estimatedRawBytes / compressedBytes
    : 0;
  return {
    splatCount,
    compressedBytes,
    estimatedRawBytes,
    compressionRatio,
    fileCount: collectBundleFiles(metadata).length,
  };
};
