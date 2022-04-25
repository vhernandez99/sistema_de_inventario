import React, { useState, useEffect } from "react";
import axios from "axios";
import useGetUserInfo from "../../Hooks/useGetUserInfo";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import SideBar from "../../components/Sidebar";
function NuevoInventario(props) {
  const router = useRouter();
  const { jwt } = useGetUserInfo();
  const [nuevoInventario, setNuevoInventario] = useState();
  const [productos, setProductos] = useState([]);
  function onSubmit(e) {
    e.preventDefault();
    let formDataToSend = {
      data: {
        Quantity: nuevoInventario.Quantity,
        product: nuevoInventario.product,
      },
    };
    console.log(formDataToSend);
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/api/Stocks`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      })
      .then((res) => {
        Swal.fire({
          title: "Inventario creado correctamente",
          color: "white",
          icon: "success",
          iconColor: "#9DC230",
          background: "#232130",
          confirmButtonColor: "#9DC230",
        });
        router.push("/inventario");
      })
      .catch((error) => {
        Swal.fire({
          title: "Error al crear inventario",
          color: "white",
          icon: "error",
          background: "#232130",
          confirmButtonColor: "#9DC230",
        });
      });
  }

  const obtenerInventario = async () => {
    if (jwt) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      console.log(res);
      const productos = await res.json();
      console.log(productos.data);
      setProductos(productos.data);
    }
  };

  useEffect(() => {
    obtenerInventario();
  }, [jwt]);

  return (
    <>
      <SideBar>
        <div className="mt-24 h-screen">
          <form onSubmit={(e) => onSubmit(e)}>
            <div className="w-full flex flex-col space-y-6 mx-auto max-w-7xl">
              <div className="grid grid-cols-4 gap-x-2 gap-y-4">
                <select
                  className="Input col-span-2"
                  placeholder="Nombre"
                  required
                  onChange={(e) => {
                    {
                      setNuevoInventario({
                        ...nuevoInventario,
                        product: Number(e.target.value),
                      });
                      console.log(e.target.value)
                    }
                  }}
                >
                  <option value="">Selecciona un producto</option>
                  {productos.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.attributes.Name}
                    </option>
                  ))}
                </select>

                <input
                  className="Input col-span-2"
                  placeholder="Cantidad"
                  required
                  type="number"
                  onChange={(e) => {
                    {
                      setNuevoInventario({
                        ...nuevoInventario,
                        Quantity: Number(e.target.value),
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

export default NuevoInventario;
