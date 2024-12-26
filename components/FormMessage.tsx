export type Message =
  | { success: string }
  | { error: string }
  | { message: string };

const FormMessage = ({ message }: { message: Message }) => {
  return (
    <div className="flex flex-col gap-2 w-full max-w-md text-sm">
      {"success" in message && (
        <div className="text-white border-l-2 border-white px-4">
          {message.success}
        </div>
      )}
      {"error" in message && (
        <div className="text-destructive-white border-l-2 border-destructive-white px-4">
          {message.error}
        </div>
      )}
      {"message" in message && (
        <div className="text-white border-l-2 px-4">{message.message}</div>
      )}
    </div>
  );
};

export default FormMessage;