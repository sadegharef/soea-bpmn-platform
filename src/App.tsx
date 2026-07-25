/**
 * @file App.tsx
 * @description نقطه ورود و کامپوننت اصلی مدیریت مسیرها و پوسته نرم‌افزار هم‌نگار (BpmnCraft)
 * @architecture
 * - Single Responsibility Principle (SRP): تفکیک نمای داشبورد، ویرایشگر بوم و نمای تعبیه‌شده (Embed Viewer)
 * - Dependency Inversion Principle (DIP): اتکا به WorkspaceProvider جهت تامین داده‌ها و حالت‌ها
 */

import React, { useEffect, useState } from "react";
import BpmnModelerApp from "./components/BpmnModelerApp";
import EmbedViewer from "./components/EmbedViewer";
import { DiagramsDashboard } from "./components/DiagramsDashboard";
import { LoginScreen } from "./components/LoginScreen";
import { WorkspaceProvider, useWorkspace } from "./context/WorkspaceContext";

/**
 * کامپوننت داخلی مدیریت محتوای اصلی بر اساس وضعیت احراز هویت و نمای فعال (Login vs Dashboard vs Modeler)
 */
function MainAppContent() {
  const { isAuthenticated, activeView } = useWorkspace();
  const [theme, setTheme] = useState<"light" | "dark">((): "light" | "dark" => {
    return (localStorage.getItem("bpmn-theme") as "light" | "dark") || "light";
  });

  // اعمال کلاس دارک‌مود به ریشه سند HTML جهت هماهنگی با Tailwind CSS
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.add("dark-theme");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.remove("dark-theme");
    }
    localStorage.setItem("bpmn-theme", theme);
  }, [theme]);

  // تا زمانی که کاربر وارد سامانه هم‌نگار نشده است، فقط صفحه ورود نشان داده می‌شود
  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  // رندر نمای داشبورد یا بوم طراحی بر اساس حالت برنامه
  if (activeView === "dashboard") {
    return <DiagramsDashboard theme={theme} setTheme={setTheme} />;
  }

  return <BpmnModelerApp theme={theme} setTheme={setTheme} />;
}

/**
 * کامپوننت ریشه برنامه با قابلیت بررسی آدرس URL جهت اشتراک‌گذاری و تعبیه فرآیندها
 */
export default function App() {
  const [viewRoute, setViewRoute] = useState<{ type: "editor" | "viewer"; processId?: string }>({ type: "editor" });

  useEffect(() => {
    const handleLocationCheck = () => {
      const path = window.location.pathname;
      // پشتیبانی از مسیریابی اشتراک‌گذاری عمومی و تعبیه در وب‌سایت‌ها (/view/processId یا /embed/processId)
      if (path.startsWith("/view/") || path.startsWith("/embed/")) {
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

    handleLocationCheck();
    window.addEventListener("popstate", handleLocationCheck);
    return () => {
      window.removeEventListener("popstate", handleLocationCheck);
    };
  }, []);

  // در صورت فراخوانی حالت مشاهده اشتراکی، نمای ساده مشاهده دیاگرام رندر می‌شود
  if (viewRoute.type === "viewer" && viewRoute.processId) {
    return <EmbedViewer processId={viewRoute.processId} />;
  }

  // در غیر این صورت ارائه کامل سیستم با فراهم‌کننده فضای کاری (WorkspaceProvider)
  return (
    <WorkspaceProvider>
      <MainAppContent />
    </WorkspaceProvider>
  );
}
