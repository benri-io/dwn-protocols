const { readFile } = require("fs/promises");
const path = require("path");

async function extractTags(paths) {
  const contents = await Promise.all(paths.map((path) => readFile(path)));

  const tagsSet = contents.reduce((tags, content) => {
    const curTags = matter(content).data?.tags ?? [];
    curTags.forEach((tag) => tags.add(tag));
    return tags;
  }, new Set());

  return Array.from(tagsSet);
}

async function extractBodyWithMeta(paths) {
  const contents = await Promise.all(paths.map((path) => readFile(path)));
  return contents.map((content, index) => ({
    matter: matter(content),
    path: paths[index],
  }));
}

async function extractMetadataAndProtocol(paths) {
  const contents = await Promise.all(paths.map((path) => readFile(path)));
  // parse metadata
  let ret = contents.map((content, index) => ({
    metadata: JSON.parse(content),
    path: paths[index],
  }));

  // parse protocol
  const results = await Promise.all(
    ret.map(async (i) => {
      let protocolpath = i.metadata.protocol_path
        ? i.metadata.protocol_path
        : "protocol.json";
      parsed = path.parse(i.path);
      i.protocol_path = path.join(parsed.dir, protocolpath);
      i = await readFile(i.protocol_path).then((content) => {
        i.protocol = JSON.parse(content);
        return i;
      });
      return i;
    })
  );
  return ret;
}

module.exports = {
  extractTags,
  extractMetadataAndProtocol,
  extractBodyWithMeta,
};
