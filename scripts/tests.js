const github = require("@actions/github");
const path = require("path");
const { readFile, readFileSync } = require("fs/promises");

const {
  SLUG_PATTERN,
  VERSION_PATTERN,
  MARKDOWN_FILENAME,
  METADATA_FILENAME,
  LEVENSHTIEN_TRESHOLD,
  PROTOCOLS_FOLDER,
  SITE_URL,
  SPACE_PATTERN,
  NOT_ALPHANUMERIC_PATTERN,
} = require("./constants");
const core = require("@actions/core");

function testStructure(dirs) {
  return dirs.length === 4;
}

function testName(name) {
  return SLUG_PATTERN.test(name);
}

function testVersion(version) {
  return VERSION_PATTERN.test(version);
}

function testFileName(fileName) {
  return fileName === METADATA_FILENAME;
}

function testAuthors(authors) {
  return (
    Array.isArray(authors) &&
    authors.every((a) => {
      return (
        typeof a === "object" &&
        typeof a.name === "string" &&
        (typeof a.email === "string" || !a.email)
      );
    })
  );
}

function testMetaPiuriAndFileStructire(piuri, folders) {
  return (
    piuri.replace(SITE_URL, "").replace(NOT_ALPHANUMERIC_PATTERN, "") ===
    folders.join("").replace(NOT_ALPHANUMERIC_PATTERN, "")
  );
}

function testTitleAndProtocolFolder(title, folder) {
  return (
    title.toLocaleLowerCase().replace(SPACE_PATTERN, "") ===
    folder.replace(SPACE_PATTERN, "")
  );
}

function testTagsDuplicates(tags) {
  return tags.length === new Set(tags).size;
}

// function testTagsSimilarity(oldTags, newTags) {
//   const result = [];
//   newTags.forEach((newTag) => {
//     const tagResult = { tag: newTag, similars: [] };
//     oldTags.forEach((oldTag) => {
//       const levenshtienResult = levenshtien(newTag, oldTag);
//       if (levenshtienResult.similarity > LEVENSHTIEN_TRESHOLD) {
//         tagResult.similars.push(oldTag);
//       }
//     });
//     result.push(tagResult);
//   });

//   return result;
// }

function testPRAuthor(prAuthore, metaAuthor) {
  return prAuthore === metaAuthor;
}

function testUniqueName(name, existingNames) {
  const formattedName = name.replace(NOT_ALPHANUMERIC_PATTERN, "");
  const formattedExistiongNames = existingNames.map((n) =>
    n.replace(NOT_ALPHANUMERIC_PATTERN, "")
  );

  const existingIndex = formattedExistiongNames.findIndex(
    (n, index) => n === formattedName && name !== existingNames[index]
  );

  return {
    isUnique: existingIndex === -1,
    existing: existingNames[existingIndex],
  };
}

function testProtocols({ registeredProtocols, logger }) {
  let countErrors = 0;
  // TODO: Make sure no errant files
  registeredProtocols.forEach(
    ({ path: filePath, protocol: protocol, metadata: metadata }) => {
      logger.startGroup(`Protocol path: ${filePath}.`);
      const parsedFilePath = path.parse(filePath);
      const dirs = parsedFilePath.dir.split("/");
      let name = dirs.slice(2)[0];
      let version = dirs.slice(2)[1];

      if (!testStructure(dirs)) {
        logger.error(
          `A new protocol must be in ${PROTOCOLS_FOLDER}/<channel>/<protocol_name>/<protocol_version> folder`
        );
        countErrors++;
        return countErrors;
      }

      if (!testName(name)) {
        logger.error(
          'Should have correct name folder. Only letters, digits and "-" as separator allowed e.g my-cool-protocol'
        );
        countErrors++;
      }

      if (!testVersion(version)) {
        logger.error("Should have correct version folder e.g 1.0");
        countErrors++;
      }

      if (!testFileName(parsedFilePath.base)) {
        logger.error(
          `Metadata file name should be equal to ${METADATA_FILENAME}`
        );
        countErrors++;
      }
      if (!testAuthors(metadata.authors)) {
        logger.error(
          `Authors should be array of objects with next fields: name is string, email is optional string`
        );
        countErrors++;
      }

      if (!testTitleAndProtocolFolder(metadata.name, name)) {
        logger.error(
          `Meta field title should include the same letters and digits as protocol file structure`
        );
        countErrors++;
      }
    }
  );
  return countErrors;
}

module.exports = {
  testStructure,
  testName,
  testVersion,
  testFileName,
  //testTagsSimilarity,
  testProtocols,
};
