import SignInForm from "@/components/auth/SignInForm";
import { Pizza } from "lucide-react";
import Link from "next/link";

const SignInPage = () => {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">

         
      {/* Left Side */}
      <div className="hidden lg:flex relative overflow-hidden bg-red-600">

        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-red-500 opacity-60" />
            <div className="absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-red-700 opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(0,0,0,0.12),transparent_35%)]" />
       
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20 text-white">
          <div className="relative z-10 flex gap-2 -mt-20">
                <span className="flex size-9 items-center justify-center rounded-full text-red-600 bg-white">
                    <Pizza className="size-5" />
                </span>
            <Link href="/" className="text-3xl font-extrabold tracking-wide">
                PizzaHub<span className="text-orange-300">.</span>
            </Link>
            </div>

          <h2 className="text-3xl xl:text-4xl font-bold leading-tight mt-5">
            Welcome Back!
          </h2>

          <p className="mt-5 max-w-lg text-lg leading-8 text-red-50">
            Sign in to PizzaHub and enjoy your favorite pizzas, manage your
            orders, and get delicious food delivered right to your door.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <span className="rounded-full bg-white/15 px-4 py-2 text-sm backdrop-blur-sm">
              🍕 Fresh Pizza
            </span>

            <span className="rounded-full bg-white/15 px-4 py-2 text-sm backdrop-blur-sm">
              🚴 Fast Delivery
            </span>

            <span className="rounded-full bg-white/15 px-4 py-2 text-sm backdrop-blur-sm">
              ❤️ Easy Ordering
            </span>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
        <SignInForm />
      </div>
    </div>
  );
};

export default SignInPage;