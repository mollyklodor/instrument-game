import { Switch, Route, Router as WouterRouter } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import Home from "@/pages/Home";
import Game from "@/pages/Game";
import NotFound from "@/pages/not-found";

function Routes() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/game/:family" component={Game} />
      <Route path="/game" component={Game} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <WouterRouter hook={useHashLocation}>
      <Routes />
    </WouterRouter>
  );
}
