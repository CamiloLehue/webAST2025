import {
  TbBrandFacebook,
  TbBrandInstagram,
  TbBrandLinkedin,
  TbMail,
  TbPhone,
} from "react-icons/tb";

function TopHeader() {
  const TELEPHONE = "+56 2 3366 3478, +56 2 3366 3478";
  const EMAIL = "ventas@ast.cl";
  return (
    <div className=" max-w-7xl mx-auto flex justify-between items-center px-5 h-8">
      <div className="flex justify-center items-center gap-5">
        <article className="flex justify-center items-center gap-2">
          <TbPhone className="text-primary-100 text-xs" />
          <p className="text-xs font-light">{TELEPHONE}</p>
        </article>
        <article className="flex justify-center items-center gap-2">
          <TbMail className="text-primary-100 text-xs" />
          <p className="text-xs font-light">{EMAIL}</p>
        </article>
      </div>

      <div className="flex justify-center items-center gap-3 text-white-100/90">
        <a
          href="https://www.facebook.com/AST.Chile"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:bg-bg-400 hover:px-3 transition-all duration-500 rounded-full"
        >
          <TbBrandFacebook
            size={18}
            className="text-white-100  transition-colors duration-500"
          />
        </a>
        <a
          href="https://www.instagram.com/ast_networks_chile/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:bg-bg-400 hover:px-3 transition-all duration-500 rounded-full"
        >
          <TbBrandInstagram
            size={21}
            className="text-white-100  transition-colors duration-500"
          />
        </a>
        <a
          href="https://cl.linkedin.com/company/ast-networks"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:bg-bg-400 hover:px-3 transition-all duration-500 rounded-full"
        >
          <TbBrandLinkedin
            size={19.5}
            className="relative top-[1px] text-white-100  transition-colors duration-500"
          />
        </a>
      </div>
    </div>
  );
}

export default TopHeader;
