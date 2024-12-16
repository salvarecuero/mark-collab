export type PageProps = {
  params: {
    id?: string;
    slug?: string;
  };
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};
