import type { Joke } from "@prisma/client";
import { json, type LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";

type LoaderData = {
  joke: Joke;
};

export const loader: LoaderFunction = async ({ params }) => {
  const count = await db.joke.count();
  const randomRowNumber = Math.floor(Math.random() * count);
  const [randomJoke] = await db.joke.findMany({
    take: 1,
    skip: randomRowNumber,
  });
  if (!randomJoke) throw new Error("Random joke not found");
  const data: LoaderData = { joke: randomJoke };
  return json(data);
};

export default function JokeRoute() {
  const { joke } = useLoaderData<LoaderData>();
  return (
    <div>
      <p>Here's your hilarious joke:</p>
      <p>{joke.createdAt}</p>
      <p>{joke.content}</p>
      <Link to=".">{joke.name} Permalink</Link>
    </div>
  );
}

export function ErrorBoundary() {
  return <div className="error-container">I did a whoopsies.</div>;
}
