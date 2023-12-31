import { type LoaderArgs, json, type ActionArgs } from "@remix-run/node";
import {
  Form,
  useLoaderData,
  useNavigation,
  useParams,
  useActionData,
} from "@remix-run/react";
import { useEffect, useRef } from "react";
import { db } from "~/utils/db.server";

interface ActionData {
  errors?: {
    comment: string;
  };
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const comment = formData.get("comment");
  const MovieId = formData.get("id");
  const { _action } = Object.fromEntries(formData);

  if (_action === "create") {
    if (typeof comment !== "string" || typeof MovieId !== "string") {
      return json<ActionData>(
        { errors: { comment: "Bukan string" } },
        { status: 400 }
      );
    }

    if (typeof comment !== "string" || comment.length < 5) {
      return json<ActionData>(
        { errors: { comment: "kurang dari 5 karakter" } },
        { status: 400 }
      );
    }

    const data = await db.comment.create({
      data: { message: comment, MovieId: MovieId },
    });
    return json({ data });
  }

  if (_action === "delete") {
    const id = formData.get("postId");
    if (typeof id !== "string") {
      throw new Error("Form not submitted correctly.");
    }

    const data = await db.comment.delete({
      where: { id },
    });
    return json({ data });
  }
}

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

const textareaClassName = `text-gray-600`;

export default function Comments() {
  const { id } = useParams();
  const { data } = useLoaderData();
  const navigation = useNavigation();
  const actionData = useActionData();

  //console.log("state : " + state);

  const isAdding =
    navigation.state === "submitting" &&
    navigation.formData?.get("_action") === "create";

  let formRef = useRef<HTMLFormElement>(null);
  let commentRef = useRef<HTMLTextAreaElement>(null);

  // useEffect(() => {
  //   if (!isAdding) {
  //     formRef.current?.reset();
  //     //commentRef.current.value = "";
  //     commentRef.current?.focus();
  //   }
  // }, [isAdding]);

  useEffect(() => {
    if (actionData?.errors?.comment) {
      commentRef.current?.focus();
    } else {
      formRef.current?.reset();
      commentRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div className="rounded-lg pt-7 sm:border sm:p-3">
      <h1 className="text-xl font-semibold mb-5 text-orange-500">
        Your Opinion :
      </h1>
      <div>
        <Form method="post" ref={formRef}>
          <textarea
            //defaultValue={actionData?.data}
            name="comment"
            className="w-full border border-orange-500 rounded-lg p-2 focus-visible:outline focus-visible:border-orange-600 focus-visible:outline-orange-600 focus-visible:outline-1 mb-5"
            placeholder="Write your comment here..."
            ref={commentRef}
            aria-invalid={actionData?.errors?.comment ? true : undefined}
          />
          {actionData?.errors?.comment && (
            <p
              className="form-validation-error"
              id="comment-error"
              role="alert"
            >
              {actionData.errors.comment}
            </p>
          )}
          <input type="hidden" name="id" value={id} />
          {isAdding ? (
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
        <div className="mt-5 gap-y-3 flex-col">
          <ul className="list-disc space-y-2 pl-4 text-sm">
            {data.map((comment: any) => (
              <CommentItem comment={comment} key={comment.id} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function CommentItem({ comment }: { comment: any }) {
  const navigation = useNavigation();
  const isDeleting = navigation.formData?.get("postId") === comment.id;

  return (
    <li
      key={comment.id}
      className={`${textareaClassName} font-mono`}
      style={{
        opacity: isDeleting ? 0.25 : 1,
      }}
    >
      <span className="text-gray-600">
        {comment.message}{" "}
        <Form method="post" name="delete" style={{ display: "inline" }}>
          <input type="hidden" name="postId" value={comment.id} />
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
  );
}
