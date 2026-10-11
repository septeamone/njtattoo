import { contacts } from "@/content/contacts";
import s from "./Phone.module.css";

/** The phone number, in the colour of the dot; a tel: link, so a tap on a phone dials. */
export function Phone({ className = "" }: { className?: string }) {
  return (
    <a href={contacts.tel} className={`${s.phone} ${className}`} dir="ltr" data-dot-hover>
      {contacts.phone}
    </a>
  );
}
