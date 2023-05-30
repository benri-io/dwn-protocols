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
  const [data, updateData] = useState();

  function update() {
    var channel = document.getElementById("channelSelect").value;
    var protocol = document.getElementById("protocolSelect").value;
    var version = document.getElementById("versionSelect").value;
    fetchMetadata({
      channel: channel,
      protocol: protocol,
      version: version,
    })
      .then(function (metadata) {
        console.log(metadata);
        updateData(metadata);
      })
      .catch(function (err) {
        alert(err);
      });
  }
  const root = getRootFromProtocolTree();
  var namespaces = buildNamespaces(root);
  // console.log(data);
  // useEffect(() => {
  //   const proc = fetchMetadata().then((data) => {
  //     updateData(data);
  //   });
  // });
  return (
    <div className="searchBar container text-left">
      <div className="row">
        <label htmlFor="channelSelect" className="col">
          Channel
        </label>
        <select className="form-select col" id="channelSelect">
          <option defaultValue>{namespaces[0].name}</option>
          {namespaces.slice(1).map((ns) => {
            {
              return (
                <option key="{ns.name}" value="{ns.name}" onChange={update}>
                  {" "}
                  {ns.name}{" "}
                </option>
              );
            }
          })}
        </select>
      </div>
      <div className="row">
        <label htmlFor="protocolSearch" className="col">
          Protocol
        </label>
        <select
          className="form-select col"
          id="protocolSelect"
          onChange={update}
        >
          <option defaultValue>
            {getProtocols(namespaces, "dev")[0].name}
          </option>
          <option>
            {getProtocols(namespaces, "dev")
              .slice(1)
              .map((protocol) => {
                return protocol.name;
              })}
          </option>
        </select>
      </div>
      <div className="row">
        <label htmlFor="versionSelect" className="col">
          Version
        </label>
        <select
          className="form-select col"
          id="versionSelect"
          onChange={update}
        >
          <option defaultValue>0.0.1</option>
          <option></option>
        </select>
      </div>
      <div className="row mt-5">
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
  "https://raw.githubusercontent.com/benri-io/dwn-protocols/main/protocols/dev/yeeter/0.0.1/protocol.json";

const yeeterMetadataFile =
  "https://raw.githubusercontent.com/benri-io/dwn-protocols/main/protocols/dev/yeeter/0.0.1/metadata.json";

function buildPath({ namespace, protocol, version }) {
  return `https://raw.githubusercontent.com/benri-io/dwn-protocols/main/protocols/${namespace}/${protocol}/${version}`;
}

async function fetchMetadata({ channel, protocol, version }) {
  console.log("fetching metadata", channel, protocol, version);
  const resp = await fetch(
    buildPath({ namespace: channel, version: version, protocol: protocol }) +
      "/metadata.json"
  )
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
