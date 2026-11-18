


import SignUpForm, {
  
} from "@/components/auth/SignUpForm";
import { Pizza } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const SignUpPage = () => {
     
    return (
        <div className="min-h-screen grid lg:grid-cols-2">

             
         <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-red-600 p-12 text-white">
      
    {/* Decorative background */}
            <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-red-500 opacity-60" />
            <div className="absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-red-700 opacity-50" />

    {/* Logo */}
            <div className="relative z-10 flex gap-2">
                <span className="flex size-9 items-center justify-center rounded-full text-red-600 bg-white">
                    <Pizza className="size-5" />
                </span>
            <Link href="/" className="text-3xl font-extrabold tracking-wide">
                PizzaHub<span className="text-orange-300">.</span>
            </Link>
            </div>

    {/* Main content */}
            <div className="relative z-10 max-w-lg space-y-6">
            <span className="inline-block rounded-full bg-white/15 px-4 py-2 text-sm font-medium">
                Welcome to PizzaHub
            </span>

            <h1 className="text-5xl font-extrabold leading-tight">
                Your favorite pizza,
                <span className="block text-orange-200">
                delivered fresh.
                </span>
            </h1>

            <p className="text-lg leading-8 text-red-100">
                Discover delicious pizzas, explore amazing restaurants,
                and enjoy your favorite meals delivered right to your door.
            </p>

            {/* Pizza image */}
            <div className="pt-4">
                <Image
                src="/asset/pizza-banner.png"
                alt="Delicious Pizza"
                width={100}
                height={150}
                priority
                className="w-60 max-w-md rounded-2xl object-cover drop-shadow-2xl"
                />
            </div>
            </div>

    {/* Bottom text */}
            <div className="relative z-10 text-sm text-red-100">
            © 2026 PizzaHub. All rights reserved.
            </div>
         </div>
         <div >
            <SignUpForm/>
            
         </div>



             
            
        </div>
    );
};

export default SignUpPage;