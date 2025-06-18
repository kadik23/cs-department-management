import { Link } from "@inertiajs/react";

export default function Home({name}){
    return <>
        <h1 className="text-white">Hello {name}...</h1>
        <Link href ="/about" className="text-white">About me</Link>
    </>
}