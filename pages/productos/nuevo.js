import React, { useState, useEffect } from "react";
import axios from "axios";
import useGetUserInfo from "../../Hooks/useGetUserInfo";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import SideBar from "../../components/Sidebar";
function NuevoProducto(props) {
  const router = useRouter();
  const { jwt } = useGetUserInfo();
  const [nuevoProducto, setNuevoProducto] = useState();

  function onSubmit(e) {
    e.preventDefault();
    let formDataToSend = {
      data: {
        Name: nuevoProducto.Name,
        Code: nuevoProducto.Code,
        Quantity: nuevoProducto.Quantity,
      },
    };
    console.log(formDataToSend);
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      })
      .then((res) => {
        Swal.fire({
          title: "Producto creado correctamente",
          color: "white",
          icon: "success",
          iconColor: "#9DC230",
          background: "#232130",
          confirmButtonColor: "#9DC230",
        });
        router.push("/productos");
      })
      .catch((error) => {
        Swal.fire({
          title: "Error al crear producto",
          color: "white",
          icon: "error",
          background: "#232130",
          confirmButtonColor: "#9DC230",
        });
      });
  }

  return (
    <>
      <SideBar>
        <div className="mt-24 h-screen">
          <form onSubmit={(e) => onSubmit(e)}>
            <div className="w-full flex flex-col space-y-6 mx-auto max-w-7xl">
              <div className="grid grid-cols-4 gap-x-2 gap-y-4">
                <input
                  className="Input col-span-2"
                  placeholder="Nombre"
                  required
                  onChange={(e) => {
                    {
                      setNuevoProducto({
                        ...nuevoProducto,
                        Name: e.target.value,
                      });
                    }
                  }}
                />

                <input
                  className="Input col-span-2"
                  placeholder="Codigo"
                  required
                  onChange={(e) => {
                    {
                      setNuevoProducto({
                        ...nuevoProducto,
                        Code: e.target.value,
                      });
                    }
                  }}
                />
              </div>
              <button className="rounded-xl w-1/4 mx-auto border border-black bg-mainColor-150  text-white  h-12 col-span-2">
                Guardar
              </button>
            </div>
          </form>
        </div>
      </SideBar>
    </>
  );
}

export default NuevoProducto;
