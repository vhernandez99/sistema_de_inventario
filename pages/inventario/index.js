import React from "react";
import useGetUserInfo from "../../Hooks/useGetUserInfo";
import { useState, useEffect } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import Sidebar from "../../components/Sidebar";
function Index() {
  const { jwt } = useGetUserInfo();
  const [inventarioArray, setInventarioArray] = useState([]);
  useEffect(() => {
    obtenerInventario();
  }, [jwt]);
  const borrarInventario = (id) => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stocks/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
    }).then((res) => {
      obtenerInventario();
    });
  };
  const obtenerInventario = async () => {
    if (jwt) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/stocks?populate[0]=product`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      console.log(res);
      const productos = await res.json();
      console.log(productos.data);
      setInventarioArray(productos.data);
    }
  };
  return (
    <Sidebar>
      <div>
        <div className="w-full mt-16 h-screen">
          <div className="flex justify-between">
            <h1 className="text-white w-2/12 m-0">Id</h1>
            <h1 className="text-white w-2/12 m-0 hidden md:block">Producto</h1>
            <h1 className="text-white w-2/12 m-0 hidden md:block">Cantidad</h1>
            <h1 className="text-white w-2/12 m-0 hidden md:block">Codigo</h1>
            <h1 className="text-white w-2/12 m-0 text-center">Acciones</h1>
          </div>
          <div className="space-y-2 flex flex-col w-full mt-8">
            {inventarioArray?.map((item, i) => {
              return (
                <div
                  key={item.id}
                  className="bg-mainColor-200 flex items-center rounded-xl h-20 justify-between"
                >
                  <h1 className="m-0 w-2/12 text-mainColor-400 pl-4">
                    {item.id}
                  </h1>
                
                  <h1 className="m-0 w-2/12 text-mainColor-400">
                    {item.attributes.product.data?.attributes.Name}
                  </h1>
                
                  <h1 className="m-0 w-2/12 text-mainColor-400 hidden md:block">
                    {item.attributes.Quantity}
                  </h1>

                  <h1 className="m-0 w-2/12 text-mainColor-400 hidden md:block">
                    {item.attributes.product.data?.attributes.Code}
                  </h1>
             
                 
                  <div className="w-2/12 flex flex-col xl:flex xl:flex-row xl:space-x-4 justify-around items-center space-y-2 xl:space-y-0 text-white lg:pr-4 pr-0">
                    <button
                      className="bg-mainColor-300 w-full xl:w-1/2 h-8 rounded-xl tracking-wider"
                      onClick={() => {
                        Swal.fire({
                          title: "Quieres eliminar este producto?",
                          showDenyButton: true,
                          color: "white",
                          background: "#232130",
                          confirmButtonColor: "#9DC230",
                          confirmButtonText: "Yes",
                          denyButtonText: `No`,
                        }).then((result) => {
                          if (result.isConfirmed) {
                            borrarInventario(item.id);
                          } else if (result.isDenied) {
                            return;
                          }
                        });
                      }}
                    >
                      Borrar
                    </button>

                    <Link href={`/inventario/${item.id}`} passHref>
                      <button className="bg-mainColor-150 w-full xl:w-1/2 h-8 rounded-xl tracking-wider">
                        Editar
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Sidebar>
  );
}

export default Index;
