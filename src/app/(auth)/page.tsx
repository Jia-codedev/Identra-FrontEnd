import AuthComponent from "@/modules/auth/login/view/page";
export default async function Home() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-signin-frame bg-cover bg-no-repeat bg-center">
      <AuthComponent />
    </div>
  );
}
