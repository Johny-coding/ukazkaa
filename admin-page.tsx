import { redirect } from "next/navigation";

/**
 * Next.js varianta přesměruje neveřejnou URL /admin na vstupní stránku,
 * která podle query parametru otevře mock přihlášení. Ve statické GitHub Pages
 * variantě stejnou cestu obslouží 404.html bez viditelného odkazu v navigaci.
 */
export default function AdminRoute() {
  redirect("/?admin=1");
}
