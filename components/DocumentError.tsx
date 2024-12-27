import Link from "next/link";

const DocumentError = () => {
  return (
    <div className="flex flex-col gap-y-2">
      <h1 className="text-2xl font-bold text-white">
        Oops. Something went wrong.
      </h1>
      <p className="text-sm text-gray-200">
        We couldn't find the document you were looking for or you don't have
        access to it.
      </p>
      <Link
        href="/dashboard"
        className="text-sm text-gray-200 mt-3 border-2 w-fit p-2 rounded-xl"
      >
        Go back to Dashboard
      </Link>
    </div>
  );
};

export default DocumentError;
