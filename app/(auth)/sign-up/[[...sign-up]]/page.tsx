import { SignUp } from "@clerk/nextjs";
import Image from "next/image";
 
export default function Page() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <Image
            src="/logo.png"
            alt="Logo"
            width={200}
            height={80}
            className="mx-auto"
          />
          <h1 className="text-2xl font-semibold tracking-tight text-brand-orange">
            Créer un compte
          </h1>
          <p className="text-sm text-muted-foreground">
            Remplissez le formulaire ci-dessous
          </p>
        </div>
        <SignUp />
      </div>
    </div>
  );
}