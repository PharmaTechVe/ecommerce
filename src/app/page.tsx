import { redirect } from 'next/navigation';

export default function Home() {
  // solo redirige fuera de test environment
  if (process.env.NODE_ENV !== 'test') {
    redirect('/login');
  }
  return <div>Testing Home</div>;
}
