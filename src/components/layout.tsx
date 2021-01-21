import { FunctionComponent, ReactNode } from "react";
import Link from "next/link";
// import { useAuth } from "src/auth/useAuth";

interface IProps {
  main: ReactNode;
}
const Layout: FunctionComponent<IProps> = ({ main }) => {
  const authenticated = false;

  const logout = () => null;
  return (
    <div className="bg-gray-500 max-w-screen-2xl mx-auto text-white">
      <nav className="bg-gray-300 " style={{ height: "64px" }}>
        <div className="px-6 flex items-center justify-between h-16">
          <Link href="/">
            <a>
              <img
                src="/home-color.svg"
                alt="Home house"
                className="inline w-6"
              ></img>
            </a>
          </Link>
          {authenticated ? (
            <>
              <Link href="/houses/add">
                <a>Add House</a>
              </Link>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <Link href="/auth">
              <a>Login</a>
            </Link>
          )}
        </div>
      </nav>
      <main style={{ minHeight: "calc(100vh - 64px)" }}>{main}</main>
    </div>
  );
};

export default Layout;
