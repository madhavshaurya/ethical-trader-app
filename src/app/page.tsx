import Hero from '@/components/home/Hero';
import Terminal from '@/components/home/Terminal';
import Education from '@/components/home/Education';
import IctSmc from '@/components/home/IctSmc';
import Pricing from '@/components/home/Pricing';

export default function Home() {
  return (
    <main>
      <Hero />
      <Education />
      <Terminal />
      <IctSmc />
      <Pricing />
    </main>
  );
}
