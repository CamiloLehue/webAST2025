import {
  TbBrandFacebook,
  TbBrandInstagram,
  TbBrandLinkedin,
  TbMail,
  TbPhone,
} from "react-icons/tb";

function TopHeader() {
  const TELEPHONE = "+56 9 1234 5678";
  const EMAIL = "contacto@ast.cl";
  return (
    <div className=" max-w-5xl mx-auto flex justify-between items-center px-5 h-8">
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
        <button>
          <TbBrandFacebook
            size={18}
            className="text-primary-100 hover:text-white-100 transition-colors duration-500"
          />
        </button>
        <button>
          <TbBrandInstagram
            size={21}
            className="text-primary-100 hover:text-white-100 transition-colors duration-500"
          />
        </button>
        <button>
          <TbBrandLinkedin
            size={19.5}
            className="relative top-[1px] text-primary-100 hover:text-white-100 transition-colors duration-500"
          />
        </button>
      </div>
    </div>
  );
}

export default TopHeader;
