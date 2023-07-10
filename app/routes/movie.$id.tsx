import { type LoaderArgs, json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";

export async function loader({ params }: LoaderArgs) {
  const url = await fetch(
    `https://api.themoviedb.org/3/movie/${params.id}?language=en-US`,
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

export default function MovieId() {
  const data = useLoaderData();
  return (
    <div className="min-h-screen p-10">
      <img
        src={`https://image.tmdb.org/t/p/original${data.backdrop_path}`}
        alt=""
        className=" h-[40vh] object-cover w-full rounded-lg"
      />
      <h1 className=" text-4xl font-bold text-center pt-5">{data.title}</h1>
      <div className=" flex gap-x-10 mt-10  border p-3">
        <div className=" w-1/2 font-medium">
          <h1 className=" text-xl font-semibold mb-5 text-orange-500">
            Overview :
          </h1>
          <h1>
            <span className=" underline">Homepage:</span>
            <Link to={data.homepage} target="_blank">
              {" "}
              <span className="font-semibold text-gray-600 hover:text-orange-600">
                Link
              </span>
            </Link>
          </h1>
          <h1>
            <span className=" underline">Origial Language:</span>{" "}
            <span className=" font-normal">{data.original_language}</span>
          </h1>
          <p>
            <span className=" underline">Overview:</span>{" "}
            <span className=" font-normal">{data.overview}</span>
          </p>
          <p>
            <span className=" underline">Realese Date:</span>{" "}
            <span className=" font-normal">{data.release_date}</span>
          </p>
        </div>
        <div className="w-1/2">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
