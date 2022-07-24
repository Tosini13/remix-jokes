import type { Joke } from "@prisma/client";
import { json, type LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData, useParams } from "@remix-run/react";
import { db } from "~/utils/db.server";

type LoaderData = {
  joke: Joke;
};

export const loader: LoaderFunction = async ({ params }) => {
  const joke = await db.joke.findUnique({
    where: { id: params.jokeId },
  });
  if (!joke) throw new Error("Joke not found");
  const data: LoaderData = { joke };
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
  const { jokeId } = useParams();
  return (
    <div className="error-container">{`There was an error loading joke by the id ${jokeId}. Sorry.`}</div>
  );
}
