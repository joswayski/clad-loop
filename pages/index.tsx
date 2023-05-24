// import "./index.css";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useRouter } from "next/router";
import Image from "next/image";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function App() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [dashClicked, setDashClicked] = useState(false);

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

  const handleSignIn = async () => {
    const { data } = await supabase.auth.signInWithPassword({
      email: "joseyvalerio@gmail.com",
      password: "test123",
    });
    // ! If you're redirecting here in combination WITH the middleware
    // ! The infinite loop will trigger on this page as "logged in" shows on line 53
    router.push("/dashboard"); //
    console.log(`data`, data);
  };

  if (!session) {
    return (
      <div>
        <h1>You&apos;re not logged in, please log in to trigger the loop.</h1>
        <button onClick={async () => handleSignIn()}>LOG IN</button>
      </div>
    );
  } else {
    return (
      <div>
        <h1>
          logged in! Infinite loop here if you&apos;re redirecting after{" "}
          <code>signInWithPassword</code> and kept the middleware the same.
          -> router.push("/dashboard")
        </h1>

        <h1>To trigger another loop and crash the browser, go to /dashboard</h1>

        {dashClicked ? (
          <h1 style={{ color: "red" }}>
            Check the logs in terminal, middleware is triggering hundreds of
            times
          </h1>
        ) : null}
        <button
          onClick={async () => {
            await supabase.auth.signOut();
          }}
        >
          Logout
        </button>

        <button
          onClick={() => {
            setDashClicked(true);
            router.push("/dashboard");
          }}
          style={{ marginLeft: 50 }}
        >
          Kill my browser please (Dashboard)
        </button>

        <div>
          <Image
            alt="doing a bit of trolling"
            height={500}
            width={500}
            src={"/rick.jpeg"}
          ></Image>
        </div>
      </div>
    );
  }
}
