import { useContext } from "react";
import { GlobalContext } from "../../context";
import { generateIntro } from "../../util/openai";

export default function Landing() {
  const globalContext = useContext(GlobalContext);

  console.log(globalContext);

  return (
    <main>
      Hello world!
      <button
        onClick={() => {
          if (globalContext) {
            generateIntro(globalContext.globalState);
          }
        }}
      >
        Test me
      </button>
    </main>
  );
}
