import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { getArtisans, getCategories } from "@/lib/mock-db";

export default function HomePage() {
  const featuredArtisans = getArtisans().slice(0, 3);
  const categories = getCategories().slice(0, 4);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pt-xl md:pt-32 pb-xl px-margin-mobile md:px-margin-desktop bg-background-sand">
        <div className="max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-2 gap-xl items-center relative z-10">
          <div className="space-y-lg">
            <div className="inline-flex items-center gap-xs px-md py-xs bg-secondary-container rounded-full text-on-secondary-container">
              <span className="material-symbols-outlined material-symbols-filled text-[18px]">verified</span>
              <span className="font-label-caps text-label-caps">TRUSTED ACROSS GHANA</span>
            </div>
            <h1 className="font-display-mobile md:font-display text-display-mobile md:text-display text-on-surface leading-tight">
              Find skilled artisans.{" "}
              <span className="text-primary">Discover apprenticeship</span> opportunities.
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
              The ultimate bridge between Ghanaian craftsmanship and modern demand. Empowering local talent through direct connections and vocational growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-md pt-md">
              <Link href="/artisans">
                <Button size="lg" className="w-full sm:w-auto">
                  Find Artisans Near Me
                  <span className="material-symbols-outlined">near_me</span>
                </Button>
              </Link>
              <Link href="/apprenticeships">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Find Apprenticeships
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-md h-[400px] md:h-[500px]">
            <div className="space-y-md">
              <div className="h-3/5 rounded-xl overflow-hidden shadow-lg transform -rotate-1 hover:rotate-0 transition-transform relative">
                <Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSOUMCSvoWFp1XIlKZmxhjDfl_ycqxTv-tTK6MCMWtuOpvRGorMM1TafAjApqnidsGuVLrKf1F-1BhsrkUZjHWhYikAbR9eCRb5kyvp_x_XelJmEz302HJMePJZWjr3Lv8Rlk5_ZPo7u_wF4o8B7M8qqkkmpwSOZsjdzV7dVz9limDIuR6VwdBUw6glJo8nfEIUDxbZXCvO-TbtZE15C7Fezk1mYPp1bMfw-SGkd7scn5kJuEVl_TvXuJx4TxbVIg9hx68Lxta99c" alt="Ghanaian carpenter at work" fill className="object-cover" sizes="50vw" />
              </div>
              <div className="h-2/5 rounded-xl overflow-hidden shadow-md transform rotate-2 hover:rotate-0 transition-transform relative">
                <Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3T5C05QXCiJNZnzLo50pCHHZhS69RK4QMaPGuQprsQKGgGiqYPuFpNOyroobCwnnMCCIoxtUZr5aDBic0xFlcPqrb2z3-2Z8L_7K5ATn2apSu6omSbFSsuLtORfDnaN0BcJ0jJeX1hmJFzI9UYTEdJIfAim6WxDdU0vp-NGJXx0Q2dP2n4xxUJUS8m36B1E3VeNuKUHO2qbFa7oIGRUHOPa5CFu5izE9jp-KDXOs4c9auu5-Kx-eu4AvnYvqaTFImoIECtVp4Ghw" alt="Ghanaian seamstress" fill className="object-cover" sizes="50vw" />
              </div>
            </div>
            <div className="space-y-md pt-xl">
              <div className="h-2/5 rounded-xl overflow-hidden shadow-md transform rotate-1 hover:rotate-0 transition-transform relative">
                <Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHEvsAl7o_mU5QSuOHti8zs7V_V_GiLLlronDvNDXIcbaIpstmm24eNVZB10Dgf7TofflzFuPWeE56hvUQNwsEgDQGzVQBShCjatjqYgOnEZ9KKJOGQ71jtlVPymWSxxRgjUSMsg1QK7OZwP9njReFtDrVFf38GEoYpSzrNvBw2gLve5j9djeR-n0ulLVA3vRoHkLSBqlT9eeRCDfiLj_mgP_5W_sYD9CzyaZlHnYqUiBcCjQjCJFbTjnPhXBazMXS4qecSkjjBKY" alt="Ghanaian plumber" fill className="object-cover" sizes="50vw" />
              </div>
              <div className="h-3/5 rounded-xl overflow-hidden shadow-lg transform -rotate-2 hover:rotate-0 transition-transform relative">
                <Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdyHykwfdxelw9mU91gM4fIMzNILb7G2PWEWPoDpLtJnWsF6LQX-i5EEwyoIZTnxqNUFDl5QqQHY2F5EW7KNEoKB6Bm56QQncg-zE42l0RSI0p_NEe5U8uKXt83Xa1IMjkgrHuSCdmkJnv619pqgHHiSsX1gVdbGFK3YiVkOJqrvWFtPGdejEa7eYvg_3RQOGERyIBQibvL45dTXZtr2PTbJfL8JYyZgUo_23thk7UY6ymy9uT-qzP2B_CT2qvDaqjeAv16gRzOso" alt="Apprentice learning electrical work" fill className="object-cover" sizes="50vw" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-xl px-margin-mobile md:px-margin-desktop bg-surface-white">
        <div className="max-w-container-max mx-auto">
          <div className="text-center mb-xl">
            <h2 className="font-headline-lg text-headline-lg text-clay-heading mb-sm">Built on Trust and Craft</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Connecting you to the heartbeat of Ghana&apos;s skilled community.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
            {[
              { icon: "verified_user", title: "Verified Profiles", desc: "Every artisan undergoes a rigorous verification process to ensure skill, reliability, and safety.", bg: "bg-tertiary-container", color: "text-on-tertiary-container" },
              { icon: "groups", title: "Community Trust", desc: "Read authentic reviews from neighbors and businesses across Ghana.", bg: "bg-secondary-container", color: "text-on-secondary-container" },
              { icon: "search_check", title: "Easy Discovery", desc: "Filter by location, specialty, and rating. Finding the perfect pro has never been easier.", bg: "bg-primary-container", color: "text-on-primary-container" },
            ].map((f) => (
              <div key={f.title} className="bento-card p-xl bg-surface-container-low rounded-xl border border-border-tan flex flex-col gap-md">
                <div className={`w-12 h-12 rounded-full ${f.bg} flex items-center justify-center ${f.color}`}>
                  <span className="material-symbols-outlined">{f.icon}</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm">{f.title}</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-xl px-margin-mobile md:px-margin-desktop bg-background-sand">
        <div className="max-w-container-max mx-auto">
          <div className="flex justify-between items-end mb-xl gap-md flex-wrap">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface">Popular Categories</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant">Start your journey with the most in-demand skills.</p>
            </div>
            <Link href="/artisans" className="text-primary font-label-caps text-label-caps flex items-center gap-xs hover:underline">
              VIEW ALL <span className="material-symbols-outlined text-[16px]">north_east</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
            {categories.map((cat) => (
              <Link key={cat.id} href={`/artisans?category=${cat.slug}`} className="group">
                <div className="aspect-square rounded-xl overflow-hidden relative">
                  <Image src={cat.image} alt={cat.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="25vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-md">
                    <span className="text-white font-headline-sm text-headline-sm">{cat.name}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Artisans */}
      <section className="py-xl px-margin-mobile md:px-margin-desktop bg-surface-white">
        <div className="max-w-container-max mx-auto">
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xl">Featured Artisans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
            {featuredArtisans.map((artisan) => (
              <Link key={artisan.id} href={`/artisans/${artisan.id}`} className="group">
                <div className="bento-card bg-surface-container-low rounded-xl border border-border-tan overflow-hidden">
                  <div className="relative aspect-[4/3]">
                    <Image src={artisan.profilePhoto} alt={artisan.name} fill className="object-cover" sizes="33vw" />
                  </div>
                  <div className="p-lg">
                    <h3 className="font-headline-sm text-headline-sm group-hover:text-primary transition-colors">{artisan.businessName}</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">{artisan.trade} · {artisan.town}</p>
                    <div className="flex items-center gap-xs mt-sm text-secondary">
                      <span className="material-symbols-outlined material-symbols-filled text-[16px]">star</span>
                      <span className="font-label-caps text-label-caps">{artisan.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-margin-mobile md:px-margin-desktop bg-inverse-surface text-inverse-on-surface">
        <div className="max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-2 gap-xl items-center">
          <div className="space-y-lg">
            <h2 className="font-display-mobile md:font-display text-display-mobile md:text-display leading-tight">
              Ready to join the ecosystem?
            </h2>
            <p className="font-body-lg text-body-lg text-surface-variant/80">
              Whether you are a solo artisan looking for work or a business seeking talent, we have a place for you.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
            <div className="p-xl rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex flex-col gap-md">
              <span className="material-symbols-outlined text-[48px] text-secondary-fixed">construction</span>
              <h3 className="font-headline-sm text-headline-sm">For Artisans</h3>
              <p className="text-body-sm opacity-80">Showcase your skills, find clients, and grow your legacy.</p>
              <Link href="/register?role=artisan" className="mt-auto">
                <Button className="w-full">Join as Artisan</Button>
              </Link>
            </div>
            <div className="p-xl rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex flex-col gap-md">
              <span className="material-symbols-outlined text-[48px] text-tertiary-fixed">domain</span>
              <h3 className="font-headline-sm text-headline-sm">For Businesses</h3>
              <p className="text-body-sm opacity-80">Hire verified pros or offer apprenticeship spots.</p>
              <Link href="/register?role=business" className="mt-auto">
                <Button variant="secondary" className="w-full">Join as Business</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
