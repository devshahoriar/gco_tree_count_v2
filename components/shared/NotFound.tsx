import { Home } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '../ui/button'

const NotFound = () => {
  return (
    <main className="h-screen w-screen">
      <div className="flex flex-col items-center justify-center h-full">
        <Image
          alt="Page not found"
          height={1000}
          width={1000}
          src="/imgs/notfound.png"
          className="size-[100%] sm:size-[550px]"
        />
        <Button asChild>
          <Link href="/">
            <Home /> Go back home
          </Link>
        </Button>
      </div>
    </main>
  )
}

export default NotFound
