import { parseCookies } from "nookies";
import "../styles/globals.css";
import nookies from "nookies";
function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
function redirectUser(ctx, location) {
  if (ctx.req) {
    ctx.res.writeHead(302, {
      Location: location,
      "Content-Type": "text/html; charset=utf-8",
    });
    ctx.res.end();
  } else {
    Router.push(location);
  }
}

MyApp.getInitialProps = async ({ Component, ctx }) => {
  let pageProps = {};
  const jwt = parseCookies(ctx).jwt;
  if (jwt) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    console.log(res.status)
    if (res.status !== 200) {
      console.log("first")
      try {
        nookies.destroy(ctx, "jwt");
        nookies.destroy(ctx, "roleId");
        nookies.destroy(ctx, "userId");
        redirectUser(ctx, "/");
        return;
      } catch (error) {}
    }
  }

  if (jwt == undefined || !jwt) {
    if (ctx.pathname !== "/") {
      redirectUser(ctx, "/");
    }
  }

  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }
  return {
    pageProps,
  };
};
export default MyApp;
