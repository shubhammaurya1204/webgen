import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { serverUrl } from "../App";
import axios from "axios";

function LiveSite() {
  const { id } = useParams();
  const [html, setHtml] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    const handleGetWebsite = async () => {
      // if (!slug) return;
      try {
        const result = await axios.get(
          `${serverUrl}/api/website/get-by-slug/${id}`,
          { withCredentials: true },
        );
        setHtml(result.data.latestCode);
        // console.log(result)
      } catch (error) {
        console.log(error);
        setError("site not found");
      }
    };
    handleGetWebsite();
  }, [id]);

  

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        {error}
      </div>
    );
  }
  return (
    <iframe 
  title="Live Site"
  srcDoc={html}
  sandbox="allow-scripts allow-forms allow-popups allow-modals allow-downloads"
  className="w-screen h-screen border-none"
/>
  );
}

export default LiveSite;
