import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { auth } from "../../../../lib/auth";
import TrainerApp from "./TrainerApp";

// Setup like this in case we want to do server component stuff :-)
export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    throw notFound();
  }

  if (session.user?.appRole !== "trainer") {
    throw notFound();
  }

  return <TrainerApp />;
}
