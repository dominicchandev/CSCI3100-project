import { useAuth } from '@/utils/hooks/useAuth';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const { authStatus } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authStatus === "unauth") {
      router.push("/login")
    }
    if (authStatus === "auth") {
      router.push("/profile")
    }
  }, [authStatus])
}
