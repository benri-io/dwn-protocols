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

function getOptions() {
  var channel = document.getElementById("channelSelect").value;
  var protocol = document.getElementById("protocolSelect").value;
  var version = document.getElementById("versionSelect").value;
  return {
    channel: channel,
    protocol: protocol,
    version: version,
  };
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
      <MetadataDisplay />
    </div>
  );
}

function buildPath({ namespace, protocol, version }) {
  return `https://raw.githubusercontent.com/benri-io/dwn-protocols/main/protocols/${namespace}/${protocol}/${version}`;
}

async function fetchMetadata({ channel, protocol, version }) {
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

async function fetchProtocol({ channel, protocol, version }) {
  const resp = await fetch(
    buildPath({ namespace: channel, version: version, protocol: protocol }) +
      "/protocol.json"
  )
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      console.log(error);
    });
  return resp;
}

function MetadataDisplay() {
  const [data, updateData] = useState();
  useEffect(() => {
    const proc = fetchMetadata(getOptions()).then((data) => {
      updateData(data);
    });
  });
  return (
    <div className="w-full h-full">
      <CodeBlock language="js" title="Metadata" showLineNumbers>
        {JSON.stringify(data, null, 2)}
      </CodeBlock>
    </div>
  );
}

function ProtocolDisplay() {
  const [data, updateData] = useState();
  useEffect(() => {
    const proc = fetchProtocol(getOptions()).then((data) => {
      updateData(data);
    });
  });
  return (
    <div className="w-full h-full">
      <CodeBlock language="js" title="Protocol Definition" showLineNumbers>
        {JSON.stringify(data, null, 2)}
      </CodeBlock>
    </div>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={`${siteConfig.title}`} description="Protocols Collections">
      <main className="flex flex-col items-center justify-center h-full">
        <div className="w-full">
          <h2 className="text-left mb-4">
            Choose a protocol that you would like to use
          </h2>
          <div className="flex flex-col md:flex-row justify-center">
            <div id="protocolselector" className="md:w-1/2">
              <SearchBar />
            </div>
            <div className="md:w-1/2 mt-4 md:mt-0">
              <ProtocolDisplay className="bg-slate-600 w-full" />
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
