import { interpret, createMachine } from "@xstate/fsm";
import { trelloBoardMachine } from "./State/trello";

export const trelloBoardService = interpret(
  createMachine(
    {
      ...trelloBoardMachine.config,
      context: {
        boardID: "6bi5Hyct"
      }
    },
    {
      actions: {
        LOAD(context) {
          const boardURL = `https://trello.com/b/${context.boardID}.json`;
          fetch(boardURL)
            .then(res => res.json())
            .then(data => {
              console.log(
                "trelloBoardService",
                trelloBoardService,
                "data",
                data
              );
              trelloBoardService.send({ type: "SUCCESS", data });
            });
        }
      }
    }
  )
).start();
