import React from "react";
import SideBar from "../../components/Sidebar";
import { useRouter } from "next/router";
import useGetUserInfo from "../../Hooks/useGetUserInfo";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import moment from "moment";
export default function edit() {
  const router = useRouter();
  const id = Number(router.query.id);
  const { jwt } = useGetUserInfo();
  const [inventario, setInventario] = useState();
  const [registro, setRegistro] = useState({});
  async function onSubmit(e) {
    e.preventDefault();
    let formDataToSend = {
      data: {
        Movement: registro.Movement,
        Quantity: registro.Quantity,
        stock: id,
        fecha_movimiento: moment(),
      },
    };
    await actualizarStock();
    console.log(formDataToSend);
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/registers`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      )
      .then((res) => {
        Swal.fire({
          title: "Registro creado correctamente",
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
          title: "Error al crear registro",
          color: "white",
          icon: "error",
          background: "#232130",
          confirmButtonColor: "#9DC230",
        });
      });
  }
  async function actualizarStock(e) {
    let quantity = 0;
    if (registro.Movement === "Agregar") {
      console.log("add");
      quantity = inventario.attributes.Quantity + registro.Quantity;
    } else {
      quantity = inventario.attributes.Quantity - registro.Quantity;
    }
    console.log(quantity);
    let formDataToSend = {
      data: {
        Quantity: quantity,
      },
    };
    console.log(formDataToSend);
    await axios
      .put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/stocks/${id}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      )
      .catch((error) => {
        Swal.fire({
          title: "Error al actualizar inventario",
          color: "white",
          icon: "error",
          background: "#232130",
          confirmButtonColor: "#9DC230",
        });
      });
  }
  const obtenerInventario = async () => {
    if (jwt && id) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/stocks/${id}?populate[0]=product`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      console.log(res);
      const productos = await res.json();
      console.log(productos.data);
      setInventario(productos.data);
    }
  };

  useEffect(() => {
    obtenerInventario();
  }, [jwt, id]);

  return (
    <SideBar>
      <div className="mt-24 h-screen">
        <form onSubmit={(e) => onSubmit(e)}>
          <div className="w-full flex flex-col space-y-6 mx-auto max-w-7xl">
            <div className="grid grid-cols-4 gap-x-2 gap-y-4">
              <input
                className="Input col-span-2"
                placeholder="Nombre"
                defaultValue={
                  inventario?.attributes.product.data.attributes.Name
                }
                required
                disabled
              />
              <input
                className="Input col-span-2"
                placeholder="Codigo"
                defaultValue={
                  inventario?.attributes.product.data.attributes.Code
                }
                required
                disabled
              />
              <input
                className="Input col-span-4"
                placeholder="Cantidad"
                defaultValue={inventario?.attributes.Quantity}
                required
                type="number"
                disabled
              />
              <input
                className="Input col-span-2"
                placeholder="Cantidad"
                required
                type="number"
                onChange={(e) => {
                  {
                    setRegistro({
                      ...registro,
                      Quantity: Number(e.target.value),
                    });
                  }
                }}
              />
              <select
                className="Input col-span-2"
                placeholder="Nombre"
                required
                onChange={(e) => {
                  {
                    setRegistro({
                      ...registro,
                      Movement: e.target.value,
                    });
                  }
                }}
              >
                <option value="">Selecciona un movimiento</option>
                <option value="Agregar">Agregar</option>
                <option value="Retirar">Retirar</option>
              </select>
            </div>

            <button className="rounded-xl w-1/4 mx-auto border border-black bg-mainColor-150  text-white  h-12 col-span-2">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </SideBar>
  );
}
