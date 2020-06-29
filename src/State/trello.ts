import { createMachine, assign } from "@xstate/fsm";
import { PivotsType } from "pivots";
import { PivotsOnlyTypes } from "pivots/dist/types";

interface TrelloBoard {
  id: string;
  name: string;
  lists: Array<{
    id: string;
    name: string;
  }>;
  cards: Array<{
    id: string;
    name: string;
    desc: string;
  }>;
}

interface TrelloBoardContext {
  boardID: string;
  data?: TrelloBoard;
}
type TrelloBoardEvent = PivotsType<{
  START: {};
  SUCCESS: { data: TrelloBoard };
}>;

export const trelloBoardMachine = createMachine<
  TrelloBoardContext,
  TrelloBoardEvent
>({
  id: "trelloBoard",
  initial: "Idle",
  context: {
    boardID: "", // To be overwritten
    data: undefined
  },
  states: {
    Idle: { on: { START: "Loading" } },
    Loading: {
      entry: ["LOAD"],
      on: {
        SUCCESS: {
          target: "Loaded",
          actions: assign({
            data: (
              _context,
              event: PivotsOnlyTypes<TrelloBoardEvent, "SUCCESS">
            ) => event.data
          })
        }
      }
    },
    Loaded: {}
  }
});
