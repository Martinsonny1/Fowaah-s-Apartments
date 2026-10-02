import { signIn, signOut } from "../actions";

export const metadata = { title: "Admin login | Fowaah's Apartments", robots: { index: false, follow: false } };

export default async function Login({ searchParams }) {
  const { error } = await searchParams;
  return (
    <div className="container py-16 max-w-md">
      <h1 className="section-title">ADMIN <span>LOGIN</span></h1>
      {error === "invalid" && <p className="badge badge-red mt-5">Wrong email or password.</p>}
      {error === "forbidden" && (
        <div className="card p-5 mt-5">
          <p className="font-bold text-[#962b20]">This account does not have admin access.</p>
          <form action={signOut}><button className="btn btn-outline mt-3">Sign out</button></form>
        </div>
      )}
      <form action={signIn} className="card p-6 grid gap-3 mt-6">
        <input className="input" type="email" name="email" placeholder="Email" autoComplete="email" required />
        <input className="input" type="password" name="password" placeholder="Password" autoComplete="current-password" required />
        <button className="btn btn-primary">Sign in</button>
      </form>
    </div>
  );
}
