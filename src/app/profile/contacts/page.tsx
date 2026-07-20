"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { ContactWithArtisan } from "@/lib/types";

export default function ContactHistoryPage() {
  const [contacts, setContacts] = useState<ContactWithArtisan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/customer/contacts")
      .then((r) => r.json())
      .then((d) => {
        setContacts(d.contacts ?? []);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="skeleton h-64 rounded-xl" />;
  }

  return (
    <div>
      <h1 className="font-headline-lg text-headline-lg text-on-surface mb-md">Contact History</h1>
      <p className="font-body-sm text-body-sm text-on-surface-variant mb-xl">
        Artisans you&apos;ve reached out to via phone or WhatsApp.
      </p>

      {contacts.length === 0 ? (
        <div className="bg-surface-white border border-border-tan rounded-xl p-xl text-center">
          <span className="material-symbols-outlined text-[48px] text-on-surface-variant/30 mb-md">call_log</span>
          <p className="font-body-lg text-on-surface-variant">No contacts yet.</p>
          <Link href="/artisans" className="text-primary font-body-sm mt-md inline-block hover:underline">
            Find an artisan
          </Link>
        </div>
      ) : (
        <div className="space-y-md">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="bg-surface-white border border-border-tan rounded-xl p-lg shadow-card flex flex-wrap justify-between items-center gap-md"
            >
              <div>
                <Link
                  href={`/artisans/${contact.artisanId}`}
                  className="font-headline-sm text-headline-sm text-on-surface hover:text-primary"
                >
                  {contact.artisan?.businessName ?? "Artisan"}
                </Link>
                <p className="font-body-sm text-body-sm text-on-surface-variant capitalize flex items-center gap-xs mt-xs">
                  <span className="material-symbols-outlined text-[16px]">
                    {contact.channel === "whatsapp" ? "chat" : "call"}
                  </span>
                  {contact.channel}
                </p>
              </div>
              <div className="text-right">
                <p className="font-label-caps text-[11px] text-on-surface-variant">{formatDate(contact.createdAt)}</p>
                <Link
                  href={`/artisans/${contact.artisanId}`}
                  className="text-primary font-body-sm text-body-sm hover:underline mt-xs inline-block"
                >
                  Leave a review
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
