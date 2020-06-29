import * as React from "react";
import "./styles.css";
// import { useService } from "@xstate/react/lib/fsm";
import { useSubscription } from "use-subscription";
import { StateMachine, EventObject, Typestate } from "@xstate/fsm";
import { trelloBoardService } from "./instances";

function useService<
  Context extends object,
  Event extends EventObject = EventObject,
  State extends Typestate<Context> = any
>(service: StateMachine.Service<Context, Event, State>) {
  const config = React.useMemo(() => {
    let currentState: StateMachine.State<Context, Event, State> | undefined;
    return {
      getCurrentValue() {
        return currentState;
      },
      subscribe(callback: () => void) {
        const { unsubscribe } = service.subscribe(state => {
          currentState = state;
          callback();
        });
        return unsubscribe;
      }
    };
  }, [service]);

  return useSubscription(config);
}

function TrelloBoard(): JSX.Element {
  const a = useService(trelloBoardService);

  // React.useEffect(() => {
  //   trelloBoardService.send("START");
  // }, []);

  if (!a) {
    return <p>Initial</p>;
  }

  return (
    <div>
      <p>Trello board: {a.context.boardID}</p>
      <p><em>{a.value}</em></p>
      <p>Lists: {a.context.data?.lists.length}</p>
      <p>Cards: {a.context.data?.cards.length}</p>
    </div>
  );
}

function generateCSSRule(name: string): string {
  const toName = (valueString: string) =>
    valueString.replace(/[%:]/g, found => "\\" + found);

  if (name.startsWith("w-")) {
    return `.${toName(name)} { width: ${name.substring(2)}; }`;
  }

  if (name.startsWith("mx-")) {
    const value = name.substring(3);
    return `.${toName(name)} { margin-left: ${value}; margin-right: ${value}; }`;
  }

  return `.${toName(name)} { display: ${name}; }`;
}

const styles = ["block", "flex", "w-50%", "w-100%", "mx-auto"].map(generateCSSRule);

export default function App() {
  return (
    <div className="App">
      <style>{styles}</style>
      <button
        className="block w-50% mx-auto"
        onClick={() => {
          trelloBoardService.send("START");
        }}
      >
        Start
      </button>
      <TrelloBoard />
    </div>
  );
}
