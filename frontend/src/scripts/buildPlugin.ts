import fs from "fs";
import path from "path";

/*
 * Go側で/static/ を静的サーバとするため、生成されたhtml のscript読み込みパスをずらす
 */
const updateIndexHtml = () => {
  return {
    name: "update-index-html",
    writeBundle() {
      const indexPath = path.resolve(
        __dirname,
        "..",
        "..",
        "dist",
        "index.html"
      );
      const htmlContent = fs.readFileSync(indexPath, "utf8");

      const updatedContent = htmlContent.replace(
        /src="\/assets\//g,
        'src="/static/assets/'
      );

      fs.writeFileSync(indexPath, updatedContent);
    },
  };
};

export default updateIndexHtml;
