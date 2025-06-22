import { Link, Head } from "@inertiajs/react";

export default function Home({ flash }) {
    return (
        <>
            <Head title="Home" />
            <h1 className="text-3xl font-bold text-white">Home Page</h1>

            {flash.message && (
                <div className="mb-4 rounded bg-green-100 p-4 text-sm text-green-700">
                    {flash.message}
                </div>
            )}

            <p className="text-white">Welcome to the application!</p>

            <div className="mt-4">
                <Link href="/about" className="text-blue-500 hover:underline">
                    Go to About Page
                </Link>
            </div>
        </>
    );
}
