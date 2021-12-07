import { useCallback, useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { FlightLogService } from "../src/flight-log";
import LogCard from "../src/LogCard";
import LogForm from "../src/LogForm";
// import BoardingPassCard from "../src/BoardingPassCard";

const flightLogService = new FlightLogService();

export default function Home() {
  const [logs, setLogs] = useState([]);
  const printavg = () =>{
    let key = []
    let value = []
    let avg = {}
    logs.forEach(e =>{
      if(!key.includes(e.passengerName)){
        key.push(e.passengerName)
        value.push(e)
      }else{
        if(e.type === "arrival"){
          let i = value.findIndex(p => {
            return p.passengerName === e.passengerName && p.type === "departure"
          })
          let data = value.splice(i,1)
          key.splice(i,1)
          let k = data[0].airport + " to " + e.airport;
          let deltatime = e.timestamp - data[0].timestamp;
          avg[k] = avg[k] ? avg[k] : []
          avg[k].push(deltatime)
        }
      }
    })
    for (const value in avg){
      console.log(value,":",avg[value].reduce((a,b)=>a+b,0)/avg[value].length)
    }
   
  }
  const handleAddLog = useCallback(
    (log) => {
      let temp = logs.concat(log)
      setLogs(temp);
    },
    [logs]
  );

  useEffect(() => {
    const fetch = async () => {
      const data = await flightLogService.getLogs();
      setLogs(data);
    };

    fetch();
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next Airline!</a>
        </h1>
        <p className={styles.description}>
          Get started by editing{" "}
          <code className={styles.code}>pages/index.js</code>
        </p>
        <div className={styles.card} style={{ margin: 16, width: "100%" }}>
          <h2>Flight Logs</h2>
          <LogCard style={{ width: "100%" }} data={logs}></LogCard>
        </div>
        <button onClick= {printavg}>Print avg time to console</button>
        <div className={styles.card} style={{ margin: 16, width: "100%" }}>
          <h2>Departure Logging</h2>
          <LogForm
            style={{ width: "100%" }}
            data={logs}
            type={"departure"}
            onSubmit={handleAddLog}
          ></LogForm>
        </div>
        <div className={styles.card} style={{ margin: 16, width: "100%" }}>
          <h2>Arrival Logging</h2>
          <LogForm
            style={{ width: "100%" }}
            data={logs}
            type={"arrival"}
            onSubmit={handleAddLog}
          ></LogForm>
        </div>
        {/* Render boarding pass here */}
        {/* {[].map((_, i) => ( */}
        {/*   <BoardingPassCard key={i} /> */}
        {/* ))} */}
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}
