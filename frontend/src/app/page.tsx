"use client";

import { useEffect, useState } from "react";
import api from "../api/backend";

export default function Home() {

  const [data, setData] = useState<any>(null);

  useEffect(() => {
    api.get("/status")
      .then((res) => {
        setData(res.data);
      });
  }, []);

  return (

    <main className="flex min-h-screen items-center justify-center">

      <div>

        <h1 className="text-4xl font-bold">

          PoliVerse AI

        </h1>

        <br />

        {data ? (

          <div>

            <h2>{data.project}</h2>

            <p>Status : {data.status}</p>

            <p>Version : {data.version}</p>

          </div>

        ) : (

          <p>Loading...</p>

        )}

      </div>

    </main>

  );
}