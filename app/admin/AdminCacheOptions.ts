export const AdminPageTime: {
  next: NextFetchRequestConfig;
  cache: RequestCache;
} = {
  next: { revalidate: 120 },
  cache: "force-cache",
};
