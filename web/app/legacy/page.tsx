'use client';
import React, { useEffect, useState } from 'react';

export default function Legacy() {
  const [html, setHtml] = useState<string>('');
  useEffect(() => {
    fetch('/legacy.html')
      .then((r) => r.text())
      .then((t) => setHtml(t))
      .catch(() => setHtml('<div>Failed to load legacy site.</div>'));
  }, []);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
