import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-surface-container-highest border-t border-border-tan mt-auto pb-24 md:pb-xl">
      <div className="w-full px-margin-mobile md:px-margin-desktop py-xl grid grid-cols-1 md:grid-cols-4 gap-lg max-w-container-max mx-auto">
        <div className="space-y-md">
          <span className="font-headline-sm text-headline-sm text-clay-heading">Paa O Paa!</span>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Find skilled artisans. Discover apprenticeship opportunities. Across Ghana.
          </p>
        </div>
        <div className="space-y-md">
          <h4 className="font-label-caps text-label-caps text-primary uppercase">Quick Links</h4>
          <ul className="space-y-sm">
            {["About Us", "Contact Support", "Terms of Service", "Privacy Policy"].map((item) => (
              <li key={item}>
                <Link href="#" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-md">
          <h4 className="font-label-caps text-label-caps text-primary uppercase">Categories</h4>
          <ul className="space-y-sm">
            {["Plumbing", "Electrical", "Carpentry", "Tailoring"].map((item) => (
              <li key={item}>
                <Link
                  href={`/artisans?category=${item.toLowerCase()}`}
                  className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-all"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-md">
          <h4 className="font-label-caps text-label-caps text-primary uppercase">Stay Updated</h4>
          <div className="flex flex-col gap-sm">
            <input
              className="bg-surface-white border border-border-tan rounded-lg px-md py-sm focus:ring-2 focus:ring-primary outline-none text-body-sm"
              placeholder="Email address"
              type="email"
            />
            <button className="bg-primary text-on-primary py-sm rounded-lg font-label-caps text-label-caps transition-all hover:bg-primary-container">
              Subscribe
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-lg border-t border-border-tan/50">
        <p className="font-label-caps text-[11px] text-on-surface-variant/50 text-center">
          © 2024 PAA O PAA! DIGITAL HUB. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  );
}
