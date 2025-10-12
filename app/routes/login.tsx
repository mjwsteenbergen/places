import { Button } from "~/components/button";

export default function Login() {
  return <div className="bg-primary-medium w-screen h-screen flex justify-center items-center bg-red-500">
    <div className="bg-neutral-default p-8 rounded-lg shadow">
        <h1 className="font-heading text-5xl mb-4 w-full text-center">Login</h1>
        <p>You don't seem to be authenticated</p>
        <Button href="/" className="w-full mt-4">Login with Authentik</Button>
    </div>
  </div>;
}