export const metadata = {
  title: 'Spaceport AI',
  icons: {
    icon: '/assets/SpaceportIcons/Favicon.png',
    shortcut: '/assets/SpaceportIcons/Favicon.png',
    apple: '/assets/SpaceportIcons/Favicon.png',
  },
};
import './globals.css';
import '../public/styles.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/assets/SpaceportIcons/Favicon.png" />
      </head>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
