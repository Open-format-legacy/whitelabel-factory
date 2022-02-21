export function formatRevert(message: string) {
  if (message.startsWith("err:")) {
    return "An error occurred. Please try again.";
  } else {
    return message.split(":")[2];
  }
}
