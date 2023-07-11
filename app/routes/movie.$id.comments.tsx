import { type LoaderArgs, json, type ActionArgs } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
  useParams,
} from "@remix-run/react";
import { useEffect, useRef } from "react";
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
  const { _action } = Object.fromEntries(formData);

  if (_action === "create") {
    const data = await db.comment.create({
      data: {
        message: formData.get("comment") as String,
        MovieId: formData.get("id") as String,
      },
    });
    return json({ data });
  }

  if (_action === "delete") {
    const data = await db.comment.delete({
      where: { id: formData.get("postId") as String },
    });
    return json({ data });
  }
}

const textareaClassName = `text-gray-600`;

export default function Comments() {
  const { id } = useParams();
  const { data } = useLoaderData<typeof loader>();
  const navigation = useNavigation();

  const isAdding = navigation.state === "submitting";

  let formRef = useRef();
  let commentRef = useRef();

  useEffect(() => {
    if (!isAdding) {
      formRef.current?.reset();
      commentRef.current?.focus();
    }
  }, [isAdding]);

  return (
    <div className=" rounded-lg border p-3">
      <h1 className=" text-xl font-semibold mb-5 text-orange-500">
        Your Opinion :
      </h1>
      <div>
        <Form method="post" ref={formRef}>
          <textarea
            name="comment"
            className=" w-full border border-orange-500 rounded-lg p-2 focus:ring-orange-600 focus:border-orange-600 focus:outline-orange-600"
            placeholder="Write your comment here..."
            ref={commentRef}
          />

          <input type="hidden" name="id" value={id} />
          {navigation?.state === "submitting" ? (
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
              name="_action"
              value="create"
            >
              Add Comment
            </button>
          )}
        </Form>
        <div className="mt-5 flex-col gap-y-3">
          <ul className="list-disc space-y-2 pl-4 text-sm">
            {data.map((post) => (
              <li key={post.id} className={`${textareaClassName} font-mono`}>
                <span className="text-gray-600">
                  {post.message}{" "}
                  <Form
                    method="post"
                    name="delete"
                    style={{ display: "inline" }}
                  >
                    <input type="hidden" name="postId" value={post.id} />
                    <button
                      type="submit"
                      name="_action"
                      value="delete"
                      className="bg-orange-600 h-5 w-5 text-white rounded-full"
                    >
                      x
                    </button>
                  </Form>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
