import Image from "next/image";
import { useRouter } from "next/router";
import { destroyCookie } from "nookies";
import Link from "next/link";
import useGetUserInfo from "../Hooks/useGetUserInfo";
const SideBar = (props) => {
  const router = useRouter();
  const { roleId } = useGetUserInfo();
  return (
    <div className="h-screen flex bg-mainColor-100">
      {/* <!-- Fixed sidebar --> */}
      <div className="bg-mainColor-200 w-1/2 h-screen  md:w-full max-w-xs text-black hidden lg:block">
        <div className="flex justify-center w-full mx-auto bg-mainColor-200">
          <Image
            src="/assets/logo.png"
            alt="seeds"
            width={230}
            height={200}
            objectFit="contain"
          />
        </div>
        <div className="flex justify-around h-auto flex-col">
          <ul className="space-y-4">
            <Link href="/inventario" passHref>
              <div
                className={`flex items-center justify-center ${
                  router.pathname === "/inventario"
                    ? "bg-mainColor-150"
                    : router.pathname === "/inventario/[id]"
                    ? "bg-mainColor-150"
                    : ""
                }  w-3/4 space-x-2  mx-auto rounded-xl p-3 cursor-pointer`}
              >
                {/* <Image
                  src="/assets/dashboard.png"
                  width={24}
                  height={24}
                  alt="dashboard"
                /> */}
                <h1 className="m-0 tracking-wider w-20 text-white">
                  Inventario
                </h1>
              </div>
            </Link>
            <Link href="/inventario/nuevo" passHref>
              <div
                className={`flex items-center justify-center ${
                  router.pathname === "/inventario/nuevo"
                    ? "bg-mainColor-150"
                    : ""
                }  w-3/4 space-x-2  mx-auto rounded-xl p-3 cursor-pointer`}
              >
                {/* <Image
                  src="/assets/dashboard.png"
                  width={24}
                  height={24}
                  alt="dashboard"
                /> */}
                <h1 className="m-0 tracking-wider w-20 text-white">
                  Nuevo Inventario
                </h1>
              </div>
            </Link>

            <Link href="/productos" passHref>
              <div
                className={`flex items-center justify-center ${
                  router.pathname === "/productos" ? "bg-mainColor-150" : ""
                } space-x-2 w-3/4 mx-auto rounded-xl p-3 cursor-pointer`}
              >
                <h1 className="m-0 tracking-wider w-20 text-white">
                  Productos
                </h1>
              </div>
            </Link>
            <Link href="/productos/nuevo" passHref>
              <div
                className={`flex items-center justify-center ${
                  router.pathname === "/productos/nuevo"
                    ? "bg-mainColor-150"
                    : ""
                } space-x-2 w-3/4 mx-auto rounded-xl p-3 cursor-pointer`}
              >
                <h1 className="m-0 tracking-wider w-20 text-white">
                  Nuevo Producto
                </h1>
              </div>
            </Link>
            <Link href="/registros" passHref>
              <div
                className={`flex items-center justify-center ${
                  router.pathname.includes("/registros")
                    ? "bg-mainColor-150"
                    : ""
                } space-x-2 w-3/4 mx-auto rounded-xl p-3 cursor-pointer`}
              >
                <h1 className="m-0 tracking-wider w-20 text-white">
                  Registros
                </h1>
              </div>
            </Link>
          </ul>
          <div
            className="flex items-center justify-center w-3/4 space-x-2 mx-auto rounded-xl p-3 cursor-pointer"
            onClick={() => {
              destroyCookie({}, "jwt", {
                path: "/",
              });

              destroyCookie({}, "userId", {
                path: "/",
              });
              router.push("/");
            }}
          >
            <h1 className="m-0 tracking-wider w-20 text-white">
              Cerrar Sesion
            </h1>
          </div>
        </div>
      </div>
      <div className="flex-1 flex overflow-hidden bg-mainColor-150">
        <div className="flex-1 overflow-y-scroll p-4">{props.children}</div>
      </div>
    </div>
  );
};

export default SideBar;
