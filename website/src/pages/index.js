import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";

import styles from "./index.module.css";

function SearchBar() {
  return (
    <div className="searchBar container text-left">
      <div class="row">
        <label for="protocolSearch" className="col">
          Protocol
        </label>
        <input
          type="text"
          id="protocolSearch"
          className="col"
          placeholder="Search"
        />
      </div>
      <div class="row">
        <label for="channelSelect" className="col">
          Channel
        </label>
        <select className="form-select col" id="channelSelect">
          <option selected>dev</option>
          <option value="stable">stable</option>
          <option value="beta">beta</option>
        </select>
      </div>
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
            <SearchBar />
          </div>
          <div className="bg-slate-600 col-span-2"></div>
        </div>
      </main>
    </Layout>
  );
}
