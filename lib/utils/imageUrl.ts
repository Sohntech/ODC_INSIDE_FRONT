export const getImageUrl = (path: string | undefined | null) => {
  if (!path) return null;
  if (path.startsWith('http')) {
    return path;
  }
  return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
};