import { Outlet } from "react-router";
import Header from "./header/Header";

function LayoutTemplate() {
  return (
    <div className="relative w-full min-h-screen h-full flex flex-col">
      <Header />
      <Outlet />
    </div>
  );
}

export default LayoutTemplate;
