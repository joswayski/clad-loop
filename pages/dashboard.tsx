import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const Dashboard = () => {
  const [session, setSession] = useState(null);
  const router = useRouter();
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>

      <button
        onClick={async () => {
          await supabase.auth.signOut();
          console.log("Logged out");
          router.push("/");
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
