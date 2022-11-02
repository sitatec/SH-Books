import { GetServerSideProps } from "next";

export interface AuthPagesProps {
  /**
   * The route where the user should be redirected once signed in/up
   */
  redirectRoute: string;
}

export const getAuthPageServerSideProps: GetServerSideProps = async (
  context
) => {
  return {
    props: {
      redirectRoute: context.req.headers.referer || "/",
    },
  };
};
