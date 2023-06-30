import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta property="og:description" content="Chat via" />
        <meta property="og:image:width" content="476" />
        <meta property="og:image:height" content="480" />
        <link rel="icon" href="/images/Logo.png" />
        <link rel="apple-touch-icon" href="/images/Logo.png" />
        <link rel="image_src" href="/images/Logo.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
