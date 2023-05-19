export const getIdFromUrl = (url: string) => {
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/; // eslint-disable-line
  const match = url.match(regExp);
  if (match && match[2].length == 11) {
    return match[2];
  } else {
    return null
  }
}