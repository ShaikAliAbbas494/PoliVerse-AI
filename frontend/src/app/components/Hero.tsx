export default function Hero() {
  return (
    <section className="relative min-h-[650px] overflow-hidden bg-[#f5f1e8] pt-[72px]">

      {/* Cinematic Indian constitutional background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/images/poliverse-hero.png')",
        }}
      />

      {/* Soft readability layer */}
      <div className="absolute inset-0 bg-white/5" />

      {/* Bottom fade into dashboard */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#f5f1e8] via-[#f5f1e8]/60 to-transparent" />

    </section>
  );
}