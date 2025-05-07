import axios from "axios";
import * as cheerio from "cheerio";
import { useState } from "react";

export default function Home({ headings }) {
  const [selected, setSelected] = useState("");

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>TOC Dropdown from stumbleguymod.com</h1>

      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        style={{ padding: "10px", width: "100%", fontSize: "16px" }}
      >
        <option value="">Select a Heading</option>
        {headings.map((heading, idx) => (
          <option key={idx} value={heading}>
            {heading}
          </option>
        ))}
      </select>

      {selected && (
        <p style={{ marginTop: "20px" }}>
          <strong>Selected Heading:</strong> {selected}
        </p>
      )}
    </div>
  );
}

export async function getStaticProps() {
  const url = "https://stumbleguymod.com/";

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const headings = [];

    $(".ez-toc-section").each((i, el) => {
      const text = $(el).text().trim();
      if (text) headings.push(text);
    });

    return {
      props: {
        headings,
      },
      revalidate: 3600,
    };
  } catch (error) {
    console.error("Error fetching TOC:", error.message);
    return {
      props: {
        headings: [],
      },
    };
  }
}
