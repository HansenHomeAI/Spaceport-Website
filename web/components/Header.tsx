'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header(): JSX.Element {
  const [expanded, setExpanded] = useState(false);
  const pathname = usePathname();

  const close = () => setExpanded(false);

  return (
    <header className={`header${expanded ? ' expanded' : ''}`}>
      <div className="header-top">
        <div className="logo" onClick={close}>
          <Link href="/landing" aria-label="Spaceport AI Home">
            <img src="/assets/SpaceportIcons/SpaceportFullLogoWhite.svg" alt="Spaceport AI" className="logo-image" />
          </Link>
        </div>

        <div className="nav-links-desktop">
          <Link href="/pricing" className={pathname === '/pricing' ? 'active' : ''}>Pricing</Link>
          <Link href="/about" className={pathname === '/about' ? 'active' : ''}>About</Link>
          <Link href="/create" className={pathname === '/create' ? 'active' : ''}>Create</Link>
          <Link href="/signup" className={pathname === '/signup' ? 'active' : ''}>Signup</Link>
        </div>

        <div className={`toggle${expanded ? ' rotated' : ''}`} onClick={() => setExpanded(v => !v)}>
          <span />
          <span />
        </div>
      </div>

      <div className="nav-links" style={{ display: expanded ? 'flex' : 'none' }}>
        <Link href="/pricing" onClick={close}>Pricing</Link>
        <Link href="/about" onClick={close}>About</Link>
        <Link href="/create" onClick={close}>Create</Link>
        <Link href="/signup" onClick={close}>Signup</Link>
      </div>
    </header>
  );
}

