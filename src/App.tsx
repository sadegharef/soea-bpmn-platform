import React, { useEffect, useState } from "react";
import BpmnModelerApp from "./components/BpmnModelerApp";
import EmbedViewer from "./components/EmbedViewer";

export default function App() {
  const [viewRoute, setViewRoute] = useState<{ type: "editor" | "viewer"; processId?: string }>({ type: "editor" });

  useEffect(() => {
    const handleLocationCheck = () => {
      const path = window.location.pathname;
      if (path.startsWith("/view/")) {
        const parts = path.split("/");
        const processId = parts[2];
        if (processId) {
          setViewRoute({ type: "viewer", processId });
        } else {
          setViewRoute({ type: "editor" });
        }
      } else {
        setViewRoute({ type: "editor" });
      }
    };

    // Check location on mount
    handleLocationCheck();

    // Also support browser back/forward buttons
    window.addEventListener("popstate", handleLocationCheck);
    return () => {
      window.removeEventListener("popstate", handleLocationCheck);
    };
  }, []);

  if (viewRoute.type === "viewer" && viewRoute.processId) {
    return <EmbedViewer processId={viewRoute.processId} />;
  }

  return <BpmnModelerApp />;
}
