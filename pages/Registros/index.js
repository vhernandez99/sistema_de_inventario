import React from "react";
import useGetUserInfo from "../../Hooks/useGetUserInfo";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Swal from "sweetalert2";
import Sidebar from "../../components/Sidebar";
import moment from "moment";
function Index() {
  const { jwt } = useGetUserInfo();
  const [registrosArray, setRegistrosArray] = useState([]);
  const router = useRouter();
  useEffect(() => {
    obtenerRegistros();
  }, [jwt]);
  const obtenerRegistros = async () => {
    if (jwt) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/registers?populate[0]=stock&populate[1]=product`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      console.log(res);
      const registros = await res.json();
      console.log(registros.data);
      setRegistrosArray(registros.data);
    }
  };

  return (
    <Sidebar>
      <div>
        <div className="w-full mt-16 h-screen">
          <div className="flex justify-between">
            <h1 className="text-white w-2/12 m-0">Id</h1>
            <h1 className="text-white w-2/12 m-0 hidden md:block">
              Inventario
            </h1>
            <h1 className="text-white w-2/12 m-0 hidden md:block">
              Movimiento
            </h1>
            <h1 className="text-white w-2/12 m-0 hidden md:block">Cantidad</h1>
            <h1 className="text-white w-2/12 m-0 hidden md:block">
              Inventario
            </h1>
            <h1 className="text-white w-2/12 m-0 text-center">Actions</h1>
          </div>
          <div className="space-y-2 flex flex-col w-full mt-8">
            {registrosArray?.map((item, i) => {
              return (
                <div
                  key={item.id}
                  className="bg-mainColor-200 flex items-center rounded-xl h-20 justify-between"
                >
                  <h1 className="m-0 w-2/12 text-mainColor-400 pl-4">
                    {item.id}
                  </h1>
                  <h1 className="m-0 w-2/12 text-mainColor-400 pl-4">
                    {item.attributes.stock.data.id}
                  </h1>
                  <h1 className="m-0 w-2/12 text-mainColor-400 pl-4">
                    {item.attributes.Movement}
                  </h1>
                  <h1 className="m-0 w-2/12 text-mainColor-400 pl-4">
                    {item.attributes.Quantity}
                  </h1>

                  <h1 className="m-0 w-2/12 text-mainColor-400 pl-4">
                    {moment(item.attributes.fecha_movimiento).format(
                      "DD/MM/yyyy HH:mm:ss"
                    )}
                  </h1>
                  <div className="w-2/12 flex flex-col xl:flex xl:flex-row xl:space-x-4 justify-around items-center space-y-2 xl:space-y-0 text-white lg:pr-4 pr-0">
                    <Link passHref href={`/registros/${item.attributes.stock.data.id}`}>
                      <a
                        className="bg-mainColor-300 w-full xl:w-1/2 h-8 flex justify-center items-center rounded-xl tracking-wider"
                        
                      >
                        Detalles
                      </a>
                    </Link>

                    {/* <Link href={`/closers/${item.id}`} passHref>
                      <button className="bg-mainColor-150 w-full xl:w-1/2 h-8 rounded-xl tracking-wider">
                        Edit
                      </button>
                    </Link> */}
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
