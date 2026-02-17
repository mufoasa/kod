import Image from "next/image"

export function AboutSection() {
  return (
    <section className="relative overflow-hidden py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Text */}
          <div>
            <div className="mb-6 flex items-center gap-4">
              <span className="h-px w-8 bg-primary" />
              <span className="text-xs uppercase tracking-[0.3em] text-primary">
                Our Story
              </span>
            </div>
            <h2 className="mb-8 font-serif text-4xl font-bold leading-tight text-foreground md:text-5xl">
              <span className="text-balance">
                A Passion for{" "}
                <span className="text-primary">Perfection</span>
              </span>
            </h2>
            <div className="space-y-6 text-base leading-relaxed text-muted-foreground">
              <p>
                Kod Steak Bar was born from a singular vision: to bring the art of
                premium steak dining to the heart of Tetovo. Every cut is
                hand-selected, every dish crafted with precision that borders on
                obsession.
              </p>
              <p>
                Our dry-aging program transforms the finest USDA Prime and Japanese
                Wagyu into extraordinary culinary experiences. Combined with a
                world-class wine cellar and master mixologists, every evening at Kod
                becomes an unforgettable occasion.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-8">
              <div>
                <p className="font-serif text-3xl font-bold text-primary">45+</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Day Dry-Aged
                </p>
              </div>
              <div>
                <p className="font-serif text-3xl font-bold text-primary">A5</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Wagyu Grade
                </p>
              </div>
              <div>
                <p className="font-serif text-3xl font-bold text-primary">200+</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Wine Labels
                </p>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src="/images/about-interior.jpg"
              alt="Kod Steak Bar luxury interior"
              fill
              className="object-cover"
              quality={85}
            />
            <div className="absolute inset-0 border border-primary/10" />
          </div>
        </div>
      </div>
    </section>
  )
}
