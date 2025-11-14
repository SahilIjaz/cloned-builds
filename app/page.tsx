import Hero from '@/components/Hero';
import BuildCard from '@/components/BuildCard';
import ForumSection from '@/components/ForumSection';

export default function Home() {
  return (
    <main className="flex flex-col items-center w-full min-h-screen bg-slate-950 gap-20">
      <Hero />

      {/* Popular Builds Section */}
      <section className="w-full flex flex-col items-center py-24 px-4 gap-16">
        <BuildCard
          title="RTX 4060"
          price="522.84$"
          status="GOOD"
          gpu="RTX 4060"
          imageUrl="/good-build.jpg"
          href="/builds/good"
          processorWidth="70%"
          graphicsWidth="30%"
          memoryWidth="80%"
          storageWidth="40%"
        />

        <BuildCard
          title="RTX 4070 SUPER"
          price="509.98$"
          status="BETTER"
          gpu="RTX 4070 SUPER"
          imageUrl="/better-build.jpg"
          href="/builds/better"
          processorWidth="90%"
          graphicsWidth="40%"
          memoryWidth="50%"
          storageWidth="70%"
        />

        <BuildCard
          title="RTX 4080 SUPER"
          price="757.14$"
          status="ULTIMATE"
          gpu="RTX 4080 SUPER"
          imageUrl="/ultimate-build.jpg"
          href="/builds/ultimate"
          processorWidth="95%"
          graphicsWidth="90%"
          memoryWidth="80%"
          storageWidth="85%"
        />
      </section>

      <ForumSection />
    </main>
  );
}
