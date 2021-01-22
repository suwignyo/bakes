import { FunctionComponent, ReactNode } from "react";
import Link from "next/link";
import { useAuth } from "src/auth/useAuth";

interface IProps {
  main: ReactNode;
}
const Layout: FunctionComponent<IProps> = ({ main }) => {
  const { logout, authenticated } = useAuth();

  return (
    <div className="bg-gray-300 max-w-screen-2xl mx-auto text-black">
      <nav
        className="bg-gray-100 border-b-4 border-black"
        style={{ height: "64px" }}
      >
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
          <div className="grid grid-cols-4 divide-x-2 divide-green-500 text-center">
            <div className="text-lg px-4">Home</div>
            <div className="text-lg px-4">About</div>
            <div className="text-lg px-4">Order</div>
            <div className="text-lg px-4">Contact</div>
          </div>
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
