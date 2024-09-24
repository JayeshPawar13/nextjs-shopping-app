import { title } from '@/components/primitives';
import { Metadata } from 'next';
export const metadata: Metadata = {
  title: {
    default: 'About',
    template: '',
  },
  description: 'View About',
  icons: {
    icon: '/favicon.ico',
  },
};
export default function AboutPage() {
  return (
    <div>
      <h1 className={title()}>About</h1>
    </div>
  );
}
