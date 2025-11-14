import Image from "next/image";
import Link from "next/link";

export default function Navbar(){
    return (
        <header>
            <nav>
                <Link href='/' className='logo' >
                <Image src='/favicon.ico' alt='logo' width={26} height={26} />
                  <p>DevEvent</p>
                </Link>

                <ul>
                    <Link href="/">Home</Link>
                    <Link href="/">Events</Link>
                    <Link href="/">Create Event</Link>
                </ul>
            </nav>
        </header>
    )
}