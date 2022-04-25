import React from "react";
import { useRouter } from "next/router";
import SideBar from "../../components/Sidebar";
import { useState, useEffect } from "react";
import useGetUserInfo from "../../Hooks/useGetUserInfo";
function Registro() {
  const router = useRouter();
 
  const { jwt } = useGetUserInfo();
  const [inventario, setInventario] = useState();
  const obtenerInventario = async () => {
    if (jwt && router.query.id) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/stocks/${router.query.id}?populate[0]=product`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      console.log(res);
      const registro = await res.json();
      console.log(registro.data);
      setInventario(registro.data);
    }
  };

  useEffect(() => {
    obtenerInventario();
  }, [jwt, router.query.id]);
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
            </div>
          </div>
        </form>
      </div>
    </SideBar>
  );
}
export default Registro;
