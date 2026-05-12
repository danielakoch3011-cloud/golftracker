import React, { useState } from "react";

import Home from "./screens/Home";
import RoundEntry from "./screens/RoundEntry";
import Stats from "./screens/Stats";
import LiveRound from "./screens/LiveRound";
import CoachScreen from "./screens/CoachScreen";
import FinanceScreen from "./screens/FinanceScreen";
import MentalScreen from "./screens/MentalScreen";
import Plan from "./screens/Plan";
import Tools from "./screens/Tools";

import Shell from "./components/Shell";

import { demoRounds } from "./data/demoRounds";

export default function App() {
  const [tab, setTab] = useState("home");
  const [rounds, setRounds] = useState(demoRounds);

  const screens = {
    home: <Home rounds={rounds} />,
    round: (
      <RoundEntry
        rounds={rounds}
        setRounds={setRounds}
      />
    ),
    stats: <Stats rounds={rounds} />,
    live: (
      <LiveRound
        rounds={rounds}
        setRounds={setRounds}
      />
    ),
    coach: <CoachScreen rounds={rounds} />,
    finance: <FinanceScreen rounds={rounds} />,
    mental: <MentalScreen rounds={rounds} />,
    plan: <Plan />,
    tools: (
      <Tools
        rounds={rounds}
        setRounds={setRounds}
      />
    ),
  };

  return (
    <Shell tab={tab} setTab={setTab}>
      {screens[tab]}
    </Shell>
  );
}
