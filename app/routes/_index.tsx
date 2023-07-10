/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable react/jsx-key */
/* eslint-disable jsx-a11y/alt-text */
import { json, type LoaderArgs, type V2_MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader({}: LoaderArgs) {
  const url = await fetch(
    "https://api.themoviedb.org/3/trending/movie/day?language=en-US",
    {
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiZDFmYWUzYzIxMjhhYjlmZjI0Yzk4NDhiZDIyMDVlZCIsInN1YiI6IjY0YWI4NzIxNjZhMGQzMDEwMGQ5ZTk3YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.3ag-MS6zj8rITe8AkJpJG0cj1FnV6p9EF6PEkjEkM7g",
      },
    }
  );
  return json(await url.json());
}

export default function Index() {
  const data = useLoaderData();

  return (
    <div className=" bg-white py-6 sm:py-8 lg:py-12">
      <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
        <div className="mb-10 md:mb-16">
          <h2 className=" mb-4 text-center text-2xl font-bold">
            Top Trending Movies
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-8">
          {data.results.map((movie: any) => (
            <div className=" flex flex-col overflow-hidden rounded-lg border bg-white">
              <Link
                to={`movie/${movie.id}/comments`}
                prefetch="intent"
                className="group relative h-52 overflow-hidden bg-gray-100 md:h-64"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt="image movie"
                  className=" absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110"
                />
              </Link>
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <h2 className=" mb-2 text-lg font-semibold text-gray-800">
                  <Link
                    to={`movie/${movie.id}/comments`}
                    prefetch="intent"
                    className=" transition duration-100 hover:text-orange-500 active:text-orange-600"
                  >
                    {movie.title}
                  </Link>
                </h2>
                <p className=" text-gray-500 line-clamp-3">{movie.overview}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
