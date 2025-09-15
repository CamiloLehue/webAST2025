import NavBar from "./NavBar";
import TopHeader from "./TopHeader";

function Header() {
  return (
    <header className=" flex flex-col bg-bg-100 h-30 text-white-100">
      <div className="">
        <TopHeader />
      </div>
      <div className="max-w-3xl mx-auto flex justify-between items-center px-5 h-full w-full">
        <div>
          <h1>Logo</h1>
        </div>
        <div>
          <NavBar />
        </div>
      </div>
    </header>
  );
}

export default Header;
