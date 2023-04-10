const core = require("@actions/core");
const walkSync = require("walk-sync");
const { testProtocols } = require("./tests");
const { extractBodyWithMeta, extractMetadataAndProtocol } = require("./utils");
const { PROTOCOLS_FOLDER } = require("./constants");

const modifiedProtocolPaths = process.argv
  .slice(2)
  .filter((p) => p.endsWith(".json"));

async function run() {
  let countErrors = 0;
  try {
    const allProtocolsPaths = walkSync(PROTOCOLS_FOLDER, {
      directories: false,
      includeBasePath: true,
      globs: ["**/metadata.json"],
    });

    var data = await extractMetadataAndProtocol(allProtocolsPaths);
    countErrors += testProtocols({
      registeredProtocols: data,
      logger: core,
    });
  } catch (e) {
    countErrors++;
    core.error(e);
  }

  if (countErrors > 0) {
    core.setFailed(`Errors: ${countErrors}`);
  }
}

void run();
