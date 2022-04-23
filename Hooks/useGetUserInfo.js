import { useEffect, useState } from "react";
import { parseCookies } from "nookies";
const useGetUserInfo = () => {
  const [userId,setUserId] = useState();
  const [jwt, setJwt] = useState();
  const [roleId, setRoleId] = useState();
 
  useEffect(() => {
    const cookies = parseCookies();
    setJwt(cookies.jwt);
    setRoleId(Number(cookies.roleId));
    setUserId(Number(cookies.userId));
  }, []);
  return { jwt, roleId,userId };
};
export default useGetUserInfo;
