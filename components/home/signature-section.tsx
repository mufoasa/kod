import Image from "next/image"

const signatures = [
  {
    name: "Dry-Aged Ribeye",
    description:
      "45-day dry-aged USDA Prime ribeye, bone-in, served with roasted garlic butter and seasonal vegetables.",
    image: "/images/signature-ribeye.jpg",
  },
  {
    name: "A5 Japanese Wagyu",
    description:
      "Miyazaki Prefecture A5 Wagyu, BMS 11+, delicately seared and served with wasabi and Maldon sea salt.",
    image: "/images/signature-wagyu.jpg",
  },
  {
    name: "Smoked Old Fashioned",
    description:
      "Premium bourbon, hickory smoke, demerara sugar, aromatic bitters, finished with a caramelized orange peel.",
    image: "/images/signature-cocktail.jpg",
  },
]

export function SignatureSection() {
  return (
    <section className="py-32 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-20 text-center">
          <div className="mb-6 flex items-center justify-center gap-4">
            <span className="h-px w-8 bg-primary" />
            <span className="text-xs uppercase tracking-[0.3em] text-primary">
              Signature
            </span>
            <span className="h-px w-8 bg-primary" />
          </div>
          <h2 className="font-serif text-4xl font-bold text-foreground md:text-5xl">
            <span className="text-balance">Our Finest Creations</span>
          </h2>
        </div>

        <div className="space-y-24">
          {signatures.map((item, i) => (
            <div
              key={item.name}
              className={`grid items-center gap-12 lg:grid-cols-2 ${
                i % 2 === 1 ? "lg:direction-rtl" : ""
              }`}
            >
              <div className={`${i % 2 === 1 ? "lg:order-2" : ""}`}>
                <div className="relative aspect-[3/2] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    quality={85}
                  />
                </div>
              </div>
              <div className={`${i % 2 === 1 ? "lg:order-1" : ""}`}>
                <span className="text-xs uppercase tracking-[0.3em] text-primary">
                  {"0" + (i + 1)}
                </span>
                <h3 className="mt-4 font-serif text-3xl font-bold text-foreground md:text-4xl">
                  {item.name}
                </h3>
                <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
