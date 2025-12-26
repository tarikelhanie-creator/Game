import { Link } from "react-router-dom";

export default function Nav() {
  return (
    <div className="w-full flex justify-center mt-6">
      <nav
        className="
          w-225
          bg-green-500
          rounded-3xl
          border-4 border-green-900
          shadow-[0_10px_0_#14532d]
          px-10 py-6
        "
      >
        {/* Title */}
        <h1 className="text-center text-4xl font-extrabold uppercase text-white tracking-wide">
          World Cup
        </h1>

        {/* Links */}
        <div className="mt-6 flex justify-center gap-8">
          <Link
            to="/"
            className="
              px-6 py-3
              bg-green-400
              text-white
              font-extrabold
              uppercase
              rounded-full
              border-4 border-green-900
              shadow-[0_6px_0_#14532d]
              hover:bg-green-300
              active:translate-y-1
              active:shadow-none
              transition-all
            "
          >
            Home
          </Link>
          <Link
            to="/local"
            className="
              px-6 py-3
              bg-green-400
              text-white
              font-extrabold
              uppercase
              rounded-full
              border-4 border-green-900
              shadow-[0_6px_0_#14532d]
              hover:bg-green-300
              active:translate-y-1
              active:shadow-none
              transition-all
            "
          >
            Local
          </Link>
          <Link
            to="/worldwide"
            className="
              px-6 py-3
              bg-green-400
              text-white
              font-extrabold
              uppercase
              rounded-full
              border-4 border-green-900
              shadow-[0_6px_0_#14532d]
              hover:bg-green-300
              active:translate-y-1
              active:shadow-none
              transition-all
            "
          >
            Worldwide
          </Link>
        </div>
      </nav>
    </div>
  );
}