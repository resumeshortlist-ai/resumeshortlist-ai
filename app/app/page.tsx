// app/app/page.tsx
import { Suspense } from "react";
import AppClient from "./AppClient";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div style={{ padding: 24, fontFamily: "system-ui" }}>Loading…</div>}>
      <AppClient />
    </Suspense>
  );
}
