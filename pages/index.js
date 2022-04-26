import { Router, useRouter } from "next/router";
import { useState } from "react";
import { setCookie } from "nookies";
import Image from "next/image";
import Swal from "sweetalert2";
const Index = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  async function handleLogin(e) {
    e.preventDefault();
    const loginInfo = {
      identifier: username,
      password: password,
    };
    const login = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/local`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginInfo),
      }
    );
    const loginResponse = await login.json();
    console.log(loginResponse);
    if (loginResponse.error) {
      Swal.fire({
        title: "Verify email or password",
        color: "white",
        icon: "warning",
        iconColor: "red",
        background: "#232130",
        confirmButtonColor: "#9DC230",
      });
      return;
    }
    try {
      setCookie(null, "jwt", loginResponse.jwt, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });
      setCookie(null, "userId", loginResponse.user.id, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });
      setCookie(null, "roleId", loginResponse.user.role.id, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });
    } catch (error) {
      console.log(error)
    }
    router.push("/inventario");
  }
  return (
    <div className="flex w-full">
      <div className="w-9/12 h-screen relative hidden lg:block">
        <div className="w-full absolute h-full">
          <Image src="/assets/agricultura.jpg" objectFit="fill" layout="fill" />
        </div>

        <div className="absolute flex justify-center items-center w-full h-full font-semibold flex-col">
          <div className="flex flex-col items-start">
            <h1 className="text-white text-5xl m-0 tracking-wider">
              Sistema de inventario
            </h1>
          </div>
        </div>
      </div>
      <div className="lg:w-5/12 bg-mainColor-300 max-w-4xl flex items-center w-full h-screen">
        <div className=" flex flex-col w-full mx-auto ">
          <div className="w-8/12 mx-auto">
            <h1 className="text-white pb-2 tracking-wider text-lg">
              Bienvenido
            </h1>
            <form
              className="flex flex-col space-y-4"
              onSubmit={(e) => handleLogin(e)}
            >
              <div className="flex items-center rounded-xl border-mainColor-150 border-2 bg-mainColor-200 w-full pl-2 pt-1 pb-1">
                <Image src="/assets/mail.png" width={48} height={48} />
                <input
                  required
                  className="outline-none bg-mainColor-200 text-white ml-1 mr-4 w-full"
                  type="email"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="flex items-center rounded-xl border-mainColor-150 border-2 bg-mainColor-200 w-full pl-2 pt-1 pb-1">
                <Image src="/assets/lock.png" width={48} height={48} />
                <input
                  required
                  className="outline-none bg-mainColor-200 text-white ml-1 mr-4 w-full"
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex flex-col items-center space-y-1">
                <button
                  className="bg-mainColor-150 w-full h-10 text-white rounded-xl"
                  type="submit"
                >
                  LOGIN
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
