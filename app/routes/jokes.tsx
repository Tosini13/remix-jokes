import type { Joke } from "@prisma/client";
import { json, type LoaderFunction } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";

import style from "~/styles/jokes.css";
import { db } from "~/utils/db.server";

export const links: LoaderFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: style,
    },
  ];
};

type LoaderData = {
  jokes: Array<Joke>;
};

export const loader: LoaderFunction = async () => {
  const data = {
    jokes: await db.joke.findMany({
      take: 5,
      select: { id: true, name: true },
      orderBy: { createdAt: "desc" },
    }),
  };

  return json(data);
};

export default function JokesRoute() {
  const { jokes } = useLoaderData<LoaderData>();

  return (
    <div id="jokes-layout">
      <header className="jokes-header">
        <div className="container">
          <h1 className="home-link">
            <Link to="/" title="Remix Jokes" aria-label="Remix Jokes">
              <span className="logo">🤪</span>
              <span className="logo-medium">J🤪KES</span>
            </Link>
          </h1>
        </div>
      </header>
      <main className="jokes-main">
        <div className="container">
          <div className="jokes-list">
            <Link to=".">Get a random joke</Link>
            <p>Here are a few more jokes to check out:</p>
            <ul>
              {jokes.map((joke) => (
                <li key={joke.id}>
                  <Link to={joke.id}>{joke.name}</Link>
                </li>
              ))}
            </ul>
            <Link to="new" className="button">
              Add your own
            </Link>
          </div>
          <div className="jokes-outlet">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
