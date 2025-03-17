import NavBar from '@/components/Navbar';
export default function Home() {
  const isLoggedIn = true;

  return (
    <div>
      <NavBar cartItemCount={2} isLoggedIn={isLoggedIn} />
    </div>
  );
}

/*import { redirect } from 'next/navigation';

export default function Home() {
  // solo redirige fuera de test environment
  if (process.env.NODE_ENV !== 'test') {
    redirect('/login');
  }
  return (
    <div>
      <h1>Home</h1>
    </div>
  );
}
*/
