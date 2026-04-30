import ReactDOMServer from "react-dom/server";
import { ReactNode } from "react";

const useConvertHTML = () => {

    const convertHTML = (node: ReactNode,title?: string) => {

         const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <title>${title ?? "Sales Page"}</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body>
      ${ReactDOMServer.renderToStaticMarkup(node)}
    </body>
  </html>
  `;
        
        return html;
    }

    return {
        convertHTML
    }
}

export default useConvertHTML;