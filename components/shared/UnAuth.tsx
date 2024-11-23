import Image from 'next/image'
import Link from 'next/link'
import { Button } from '../ui/button'

const UnAuth = () => {
  return (
    <section className="w-full h-[90vh] flex justify-center items-center flex-col">
      <Image alt="Unauth" src="/imgs/unauth.png" height={500} width={500} />
      <Link href="/join">
        <Button>Login</Button>
      </Link>
    </section>
  )
}

export default UnAuth
