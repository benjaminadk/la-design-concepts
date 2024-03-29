#!/usr/bin/env node

const program = require("commander");

const path = require("path");
const { readdir, rename } = require("./lib/utils");

program
  .option("-b, --brand [name]", "Type of filename formatting based on brand", "kravet")
  .parse(process.argv);

const main = async () => {
  const { brand } = program;
  try {
    const files = await readdir(process.cwd());

    for (let file of files) {
      const oldPath = path.join(process.cwd(), file);

      let newFile;
      if (brand === "jf") {
        newFile = file.replace("-400x400", "").replace("-01", "");
      } else if (brand === "kravet") {
        newFile =
          file
            .slice(0, file.length - 4)
            .replace(/\s/g, "")
            .replace(/\./g, "!") + ".jpg";
      } else if (brand === "rl") {
        let pieces = file.split(" ");
        newFile = pieces[pieces.length - 1].replace("jpeg", "jpg");
      } else if (brand === "curated") {
        newFile = file.toLowerCase().replace("_1_1", "_1");
      } else if (brand === "scalamandre") {
        newFile = file.replace("_", "");
      } else if (brand === "osborne-little") {
        newFile = file.slice(0, 8) + ".jpg";
      } else if (brand === "osborne-hash") {
        newFile = file.replace(/_(.+)\.jpg/, ".jpg");
      } else if (brand === "roomshot") {
        newFile = file.replace(".jpg", "_room.jpg");
      } else if (brand === "roomshot-fix") {
        newFile = file.replace("_detail", "");
      } else if (brand === "fabricut-furniture") {
        newFile = file.toLowerCase().replace(" &", "").replace(/\s/g, "-");
      } else if (brand === "min") {
        newFile = file.replace("-min.jpg", ".jpg");
      } else if (brand === "fb") {
        newFile = "fb-" + file;
      } else if (brand === "seabrook-room") {
        newFile = file.replace("-A", "_room").replace("-R", "_room");
      } else if (brand === "thumb") {
        newFile = file.replace(".jpg", "_thumb.jpg");
      } else if (brand === "room-fix") {
        newFile = file.replace("_room_room", "_room");
      } else if (brand === "decorative-crafts") {
        newFile = file
          .replace("-silo-xx", "")
          .replace("-xx", "")
          .replace("-silo-xx", "")
          .replace("-silo-for-web-xx", "")
          .replace("silo-xx", "");
      } else if (brand === "cole-son") {
        newFile = file.replace("_r1", "");
      } else if (brand === "coll-thumb") {
        newFile = file.toLowerCase().replace("-400x400", "").replace("fabric", "fabrics");
      } else if (brand === "JPG") {
        newFile = file.replace(".JPG", ".jpg");
      } else if (brand === "tyler") {
        newFile = file.replace("400x400-", "");
      } else if (brand === "sch-image") {
        newFile = file.replace("---", "-").replace("'", "").replace("--", "-");
      } else if (brand === "ralph") {
        newFile = file.toLowerCase().replace(";", "").replace(/\s/g, "-").replace(".jpeg", ".jpg");
      } else if (brand === "lower") {
        newFile = file.toLowerCase();
      } else if (brand === "kasmir") {
        newFile = file.replace(/\s/g, "-");
      } else if (brand === "maya") {
        newFile = file.replace("-swatch-", "-");
      } else if (brand === "room-case") {
        newFile = file.replace("_Room", "_room");
      } else if (brand === "gal") {
        newFile = file.replace("-300x300", "");
        console.log(newFile);
      } else if (brand === "gal2") {
        newFile = file
          .toLowerCase()
          .replace("_notrim", "")
          .replace("_36x18__notrim", "")
          .replace("_36x18", "")
          .replace("_18x36", "")
          .replace("_36x40", "")
          .replace("_17.5x18", "")
          .replace("_36x36_no_trim", "")
          .replace("_36x36-notrim", "")
          .replace("_36.125x18-notrim", "")
          .replace("_36x36-notrim", "")
          .replace("_-36.125x18-notrim", "")
          .replace("_36x36", "")
          .replace("-notrim", "")
          .replace("_36x34_no_trim", "")
          .replace("-36x18", "")
          .replace("-no_trim", "")
          .replace("_36.125x18notrim", "")
          .replace("_33.75x18", "")
          .replace("notrim", "")
          .replace("-36_125x18", "")
          .replace("_", "-");
      } else if (brand === "gal3") {
        newFile = file.replace(".jpg", "_room.jpg");
      } else if (brand === "bella1") {
        newFile = file.replace("_detail", "");
      } else if (brand === "bella2") {
        newFile = file.replace("_detail", "_thumb");
      }

      const newPath = path.join(process.cwd(), newFile);

      await rename(oldPath, newPath);
    }
  } catch (error) {
    console.log(error);
  }
};

main();
