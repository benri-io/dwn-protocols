import React, { useEffect, useState } from "react";

import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";

import styles from "./index.module.css";
import protocolTree from "@site/static/data/protocol-directory-tree.json";
import CodeBlock from "@theme/CodeBlock";

function getRootFromProtocolTree() {
  for (var i = 0; i < protocolTree.length; i++) {
    if (protocolTree[i].name == "protocols") {
      return protocolTree[i];
    }
  }
  throw new Error("Could not find root of protocol tree");
}

function buildNamespaces(root) {
  var namespaces = [];
  root.contents.forEach((child) => {
    if (child.type == "directory") {
      namespaces.push(child);
    }
  });
  return namespaces;
}

function getProtocols(namespaces, selected) {
  for (var i = 0; i < namespaces.length; i++) {
    if (namespaces[i].name === selected) {
      return namespaces[i].contents;
    }
  }
  throw new Error("Could not find version for namespace " + selected);
}

function getVersions(protocols, selected) {
  for (var i = 0; i < protocols.length; i++) {
    if (protocols[i].name === selected) {
      return protocols[i].contents;
    }
  }
  throw new Error("Could not find version for " + selected);
}

function SearchBar() {
  const root = getRootFromProtocolTree();
  var namespaces = buildNamespaces(root);
  const [data, updateData] = useState();
  useEffect(() => {
    const proc = fetchMetadata().then((data) => {
      updateData(data);
    });
  });
  return (
    <div className="searchBar container text-left">
      <div class="row">
        <label for="channelSelect" className="col">
          Channel
        </label>
        <select className="form-select col" id="channelSelect">
          <option selected>{namespaces[0].name}</option>
          {namespaces.slice(1).map((ns) => {
            return <option value="{ns.name}"> {ns.name} </option>;
          })}
        </select>
      </div>
      <div class="row">
        <label for="protocolSearch" className="col">
          Protocol
        </label>
        <select className="form-select col" id="protocolSelect">
          <option selected>{getProtocols(namespaces, "dev")[0].name}</option>
          <option>
            {getProtocols(namespaces, "dev")
              .slice(1)
              .map((protocol) => {
                return protocol.name;
              })}
          </option>
        </select>
      </div>
      <div class="row">
        <label for="versionSelect" className="col">
          Version
        </label>
        <select className="form-select col" id="protocolSelect">
          <option selected>0.0.1</option>
          <option></option>
        </select>
      </div>
      <div class="row mt-5">
        <CodeBlock
          language="js"
          title="/dev/yeeter/0.0.1/metadata.json"
          showLineNumbers
        >
          {JSON.stringify(data, null, 2)}
        </CodeBlock>
      </div>
    </div>
  );
}

const yeeterFile =
  "https://raw.githubusercontent.com/benri-io/dwn-protocols/main/protocols/dev/tbd/yeeter/0.0.1/protocol.json";

const yeeterMetadataFile =
  "https://raw.githubusercontent.com/benri-io/dwn-protocols/main/protocols/dev/tbd/yeeter/0.0.1/metadata.json";

async function fetchMetadata() {
  const resp = await fetch(yeeterMetadataFile)
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      console.log(error);
    });
  return resp;
}

async function fetchProtocol() {
  const resp = await fetch(yeeterFile)
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      console.log(error);
    });
  return resp;
}

function ProtocolDisplay() {
  const [data, updateData] = useState();
  useEffect(() => {
    const proc = fetchProtocol().then((data) => {
      updateData(data);
    });
  });
  return (
    <div className="w-full h-full">
      <CodeBlock
        language="js"
        title="/dev/yeeter/0.0.1/protocol.json"
        showLineNumbers
      >
        {JSON.stringify(data, null, 2)}
      </CodeBlock>
    </div>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Protocols Collections<head />"
    >
      <main className="h-screen align-middle	">
        <div className="grid grid-cols-4 gap-4 h-screen w-screen">
          <div className="col col-span-2 align-middle justify-center w-screen h-screen">
            Choose a protocol that you would want to use
            <SearchBar />
          </div>
          <div className="col-span-2">
            <ProtocolDisplay className="bg-slate-600" />
          </div>
        </div>
      </main>
    </Layout>
  );
}
