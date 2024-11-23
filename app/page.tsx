import { getSession } from "@/lib/auth-client";
import { headers } from "next/headers";


export default async function Home() {
  const auth = await getSession({
    fetchOptions:{
      headers: await headers()
    }
  })
  // console.log(auth)
  return (
   <h1>Shuvo</h1>
  );
}
