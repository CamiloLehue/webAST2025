import NavBar from "./NavBar";
import TopHeader from "./TopHeader";

function Header() {
  return (
    <header className=" flex flex-col bg-bg-100  text-white-100">
      <div className="bg-bg-200 w-full">
        <TopHeader />
      </div>
      <div className="max-w-5xl mx-auto flex justify-between items-center px-5 h-full w-full">
        <div className="">
          <img src="AST-Logo-white.png" alt="Logo AST" className="w-30" />
        </div>
        <div className="w-full relative">
          <NavBar />
        </div>
      </div>
    </header>
  );
}

export default Header;
