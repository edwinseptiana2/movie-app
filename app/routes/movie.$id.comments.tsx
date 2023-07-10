import { type LoaderArgs, json, type ActionArgs } from "@remix-run/node";
import {
  Form,
  useLoaderData,
  useNavigation,
  useParams,
} from "@remix-run/react";
import { db } from "~/utils/db.server";

export async function loader({ params }: LoaderArgs) {
  const data = await db.comment.findMany({
    where: {
      MovieId: params.id,
    },
    orderBy: {
      CreatedAt: "desc",
    },
  });
  return json({ data });
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const data = await db.comment.create({
    data: {
      message: formData.get("comment") as String,
      MovieId: formData.get("id") as String,
    },
  });
  return json({ data });
}

export default function Comments() {
  const { id } = useParams();
  const { data } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  return (
    <div className=" rounded-lg border p-3">
      <h1 className=" text-xl font-semibold mb-5 text-orange-500">
        Your Opinion :
      </h1>
      <div>
        <Form method="POST">
          <textarea
            name="comment"
            className=" w-full border border-orange-500 rounded-lg p-2 focus:ring-orange-600 focus:border-orange-600 focus:outline-orange-600"
            placeholder="Write your comment here..."
          ></textarea>
          <input type="hidden" name="id" value={id} />
          {navigation.state === "submitting" ? (
            <button
              type="button"
              disabled
              className=" bg-orange-500 px-4 py-2 rounded-lg text-white"
            >
              Loading...
            </button>
          ) : (
            <button
              type="submit"
              className=" bg-orange-500 px-4 py-2 rounded-lg text-white"
            >
              Add Comment
            </button>
          )}
        </Form>
        <div className="mt-5 flex-col gap-y-3">
          {data.map((post) => (
            <div key={post.id}>
              <p>{post.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
